import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { decrypt, encrypt } from 'src/utils/encrypt';
import sendSolana from 'src/blockchain/sendSolana';
import { numberRound } from 'src/utils/numberRound';
import { v4 as uuidv4 } from 'uuid';
import { supportingChainIds, TransactionPlatform } from 'src/utils/constants';
import {
  PredictDepositType,
  Transaction,
  TransactionType,
} from '@prisma/client';
import { TokenPriceService } from 'src/token_price/token_price.service';
import { MailService } from 'src/mail/mail.service';
import {
  BITCOIN_CHAIN_ID,
  chainIds,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from 'src/blockchain/constants';
import { transactionLink } from 'src/utils/transactionLink';
import { PredictDepositService } from 'src/predict_deposit/predict_deposit.service';
import sendEth, { sendEthLowFee } from 'src/blockchain/sendEth';
import { evmChains } from 'src/blockchain/config';
import { getBtcBalance, sendBitcoin } from 'src/blockchain/libBTC';
import { createRpcClient } from 'src/blockchain/createRpcClient';
import { formatUnits } from 'viem';

type TempTransaction = {
  cash: number;
  txHash: string;
  chainId: number;
  tokenAmont: number;
  tokenAddress: string;
};

const threshold = Number(process.env.DEPOSIT_THRESHOLD) || 10000000;
const excludeUserIds = String(process.env.DEPOSIT_EXCLUDE_USER_IDS).split(',');

@Injectable()
export class WalletBackgroundService {
  private readonly logger = new Logger(WalletBackgroundService.name);
  private intervalId: NodeJS.Timeout;
  private intervalIdPredict: NodeJS.Timeout;
  private counter = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketGateway,
    private readonly tokenPriceService: TokenPriceService,
    private readonly blockchainService: BlockchainService,
    private readonly mailService: MailService,
    private readonly predictDepositService: PredictDepositService,
  ) {}

  onModuleInit() {
    this.logger.debug('BackgroundService has been initialized');
    this.startWalletCheckTask();
    this.startPredictTask();
  }

  onModuleDestroy() {
    this.logger.debug('BackgroundService is being destroyed');
    this.stopBackgroundTask();
  }

  async startWalletCheckTask() {
    this.logger.debug('Checking wallet deposits');

    if (process.env.NODE_ENV === 'production') {
      await this.run();

      this.intervalId = setTimeout(() => this.startWalletCheckTask(), 60000);
      this.counter = (this.counter + 1) % 40320;
    }
  }

  async startPredictTask() {
    this.logger.debug('Checking wallet predicts');

    if (process.env.NODE_ENV === 'production') {
      await this.addConnectedUsersPredictDeposit();
      this.intervalIdPredict = setTimeout(
        () => this.startPredictTask(),
        860000,
      );
    }
  }

  stopBackgroundTask() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
    if (this.intervalIdPredict) {
      clearTimeout(this.intervalIdPredict);
    }
  }

  async checkUserToken(
    userId: string,
    chainId: number,
    tokenAddress: string,
    bOnlyTx: boolean = false,
  ) {
    if (!supportingChainIds.includes(chainId)) {
      return;
    }

    let bSendEmail = true;
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        agentId: true,
        userName: true,
        cash: true,
        email: true,
        solanaPk: true,
        solanaAddress: true,
        btcPk: true,
        btcAddress: true,
        ltcPk: true,
        ltcAddress: true,
        ethPk: true,
        ethAddress: true,
        wantBonus: true,
      },
      where: {
        isDeleted: false,
        id: userId,
      },
    });

    if (!user) {
      this.logger.debug('User not found');
      return;
    }

    let transaction: TempTransaction | null = null;
    const tokenPrice = await this.tokenPriceService.getTokenPrice(
      chainId,
      tokenAddress,
    );
    const token = await this.prisma.tokenPrice.findFirst({
      where: {
        chainId,
        tokenAddress,
      },
    });

    if (!token) {
      return;
    }

    const pending = await this.prisma.pendingMoney.findFirst({
      where: {
        userId: user.id,
        tokenName: token.dbField,
      },
    });

    if (chainId === BITCOIN_CHAIN_ID || chainId === LITECOIN_CHAIN_ID) {
      // BTC
      const networkType = chainId === BITCOIN_CHAIN_ID ? 'bitcoin' : 'litecoin';
      const btcBalance = await getBtcBalance(
        networkType === 'bitcoin' ? user.btcAddress : user.ltcAddress,
        networkType,
      );

      if (btcBalance >= token.minimumLimit) {
        const pk = decrypt(networkType === 'bitcoin' ? user.btcPk : user.ltcPk);
        const txId = await sendBitcoin(
          pk,
          this.configService.get<string>(
            networkType === 'bitcoin' ? 'ADMIN_BTC_WALLET' : 'ADMIN_LTC_WALLET',
          ),
          btcBalance,
          networkType,
        );

        if (txId) {
          transaction = {
            cash: numberRound(tokenPrice * (btcBalance - 1500 / 100000000)),
            txHash: txId,
            chainId: chainId,
            tokenAmont: btcBalance,
            tokenAddress: '0x',
          };
        }
      }
    } else if (chainId === SOLANA_CHAIN_ID) {
      if (token.tokenAddress === '0x') {
        const solanaBalance = await this.blockchainService.getSolanaBalance(
          user.solanaAddress,
        );
        this.logger.debug('SOL Balance: ' + solanaBalance);

        const depositAmount = solanaBalance - (pending?.tokenAmount || 0);

        if (
          !bOnlyTx &&
          tokenPrice * depositAmount >= threshold &&
          !excludeUserIds.includes(userId)
        ) {
          bSendEmail = false;
          transaction = {
            cash: numberRound((tokenPrice ?? 0) * depositAmount),
            txHash: 'pending-' + (tokenPrice * depositAmount).toString(),
            chainId: chainId,
            tokenAmont: depositAmount,
            tokenAddress: tokenAddress,
          };

          if (pending) {
            await this.prisma.pendingMoney.update({
              data: {
                tokenAmount: solanaBalance,
              },
              where: {
                id: pending.id,
              },
            });
          } else {
            await this.prisma.pendingMoney.create({
              data: {
                tokenName: token.dbField,
                userId: user.id,
                tokenAmount: solanaBalance,
              },
            });
          }
        } else {
          if (depositAmount >= token.minimumLimit) {
            const pk = decrypt(user.solanaPk);

            const res = await sendSolana(
              pk,
              this.configService.get<string>('ADMIN_SOL_WALLET'),
              depositAmount - 0.001,
            );

            transaction = {
              cash: numberRound(tokenPrice * res.amount),
              txHash: res.txHash,
              chainId: chainId,
              tokenAmont: res.amount,
              tokenAddress: tokenAddress,
            };
          }
        }
      } else {
        const balance = await this.blockchainService.getSPLTokenBalance(
          token.tokenAddress,
          user.solanaAddress,
          token.tokenDecimals,
        );

        const depositAmount = balance - (pending?.tokenAmount || 0);

        if (
          !bOnlyTx &&
          tokenPrice * depositAmount >= threshold &&
          !excludeUserIds.includes(userId)
        ) {
          bSendEmail = false;
          transaction = {
            cash: numberRound((tokenPrice ?? 0) * depositAmount),
            txHash: 'pending-' + (tokenPrice * depositAmount).toString(),
            chainId: chainId,
            tokenAmont: depositAmount,
            tokenAddress: tokenAddress,
          };

          if (pending) {
            await this.prisma.pendingMoney.update({
              data: {
                tokenAmount: balance,
              },
              where: {
                id: pending.id,
              },
            });
          } else {
            await this.prisma.pendingMoney.create({
              data: {
                tokenName: token.dbField,
                userId: user.id,
                tokenAmount: balance,
              },
            });
          }
        } else {
          if (depositAmount >= token.minimumLimit) {
            const pk = decrypt(user.solanaPk);
            const signature = await this.blockchainService.sendSPLToken(
              pk,
              this.configService.get<string>('ADMIN_SOL_WALLET'),
              token.tokenAddress,
              depositAmount,
              token.tokenDecimals,
            );

            if (signature) {
              this.logger.debug(
                'Transferred ' +
                  token.tokenName +
                  ' to the admin address. User wallet is ' +
                  user.solanaAddress,
              );

              transaction = {
                cash: numberRound(tokenPrice * depositAmount),
                txHash: signature,
                chainId: SOLANA_CHAIN_ID,
                tokenAmont: depositAmount,
                tokenAddress: token.tokenAddress,
              };
            }
          }
        }
      }
    } else {
      const chain = evmChains[chainId];

      if (token.tokenAddress === '0x') {
        // ethereum native token
        try {
          const ethBalance = await this.blockchainService.getEthBalance(
            user.ethAddress as `0x${string}`,
            chain,
          );

          const depositAmount = ethBalance - (pending?.tokenAmount || 0);

          if (
            !bOnlyTx &&
            tokenPrice * depositAmount >= threshold &&
            !excludeUserIds.includes(userId)
          ) {
            bSendEmail = false;
            transaction = {
              cash: numberRound((tokenPrice ?? 0) * depositAmount),
              txHash: 'pending-' + (tokenPrice * depositAmount).toString(),
              chainId: chain.id,
              tokenAmont: depositAmount,
              tokenAddress: tokenAddress,
            };

            if (pending) {
              await this.prisma.pendingMoney.update({
                data: {
                  tokenAmount: ethBalance,
                },
                where: {
                  id: pending.id,
                },
              });
            } else {
              await this.prisma.pendingMoney.create({
                data: {
                  tokenName: token.dbField,
                  userId: user.id,
                  tokenAmount: ethBalance,
                },
              });
            }
          } else {
            if (depositAmount >= token.minimumLimit) {
              this.logger.debug(
                `${chain.name} balance:${depositAmount} is greater than ${token.minimumLimit}`,
              );

              const pk = decrypt(user.ethPk);
              let ethToSend = 0;
              if ((chain.id === 1 || chain.id === 56) && depositAmount > 0.1) {
                ethToSend = Math.floor(depositAmount * 100) / 100;
                if (depositAmount - ethToSend < 0.0015) {
                  ethToSend = depositAmount - 0.0015;
                }
              }

              const res = await sendEth(
                chain.id,
                pk,
                this.configService.get<string>('ADMIN_ETH_WALLET'),
                ethToSend,
              );

              this.logger.debug(
                `Transferred ${res.amount} ${chain.name} to the admin wallet`,
              );

              if (chain.id === 1 || chain.id === 56) {
                await sendEthLowFee(
                  chain.id,
                  pk,
                  this.configService.get<string>('FEE_PAYER_ETH'),
                );
              }

              if (res.txHash) {
                transaction = {
                  cash: numberRound((tokenPrice ?? 0) * ethBalance),
                  txHash: res.txHash,
                  chainId: chain.id,
                  tokenAmont: res.amount,
                  tokenAddress: tokenAddress,
                };
              }
            }
          }
        } catch (ex) {
          this.logger.error(ex);
        }
      } else {
        try {
          const tokenBalance = await this.blockchainService.getERC20Balance(
            chainId,
            token.tokenAddress,
            user.ethAddress,
          );

          const depositAmount = tokenBalance - (pending?.tokenAmount || 0);

          if (
            !bOnlyTx &&
            tokenPrice * depositAmount >= threshold &&
            !excludeUserIds.includes(userId)
          ) {
            bSendEmail = false;
            transaction = {
              cash: numberRound((tokenPrice ?? 0) * depositAmount),
              txHash: 'pending-' + (tokenPrice * depositAmount).toString(),
              chainId: chain.id,
              tokenAmont: tokenBalance - (pending?.tokenAmount || 0),
              tokenAddress: tokenAddress,
            };

            if (pending) {
              await this.prisma.pendingMoney.update({
                data: {
                  tokenAmount: tokenBalance,
                },
                where: {
                  id: pending.id,
                },
              });
            } else {
              await this.prisma.pendingMoney.create({
                data: {
                  tokenName: token.dbField,
                  userId: user.id,
                  tokenAmount: tokenBalance,
                },
              });
            }
          } else {
            if (depositAmount >= token.minimumLimit) {
              this.logger.debug(
                `${chain.name} balance:${depositAmount} is greater than ${token.minimumLimit}`,
              );

              const pk = decrypt(user.ethPk);
              const pkPayer = decrypt(
                this.configService.get<string>('ETH_PAYER_WALLET'),
              );

              const client = createRpcClient(chainId);
              const gasPrice = (await client.getGasPrice()) + 1000000000n;
              const gasLimit = BigInt(400000);

              let fee = +formatUnits(gasPrice * gasLimit * 10000n, 18) / 10000;
              if (chain.id === 1 && fee < 0.0007) {
                fee = 0.0007;
              }

              if (chain.id === 137) {
                fee *= 10;
              }

              const res1 = await sendEth(
                chain.id,
                pkPayer,
                user.ethAddress,
                fee,
              );
              if (res1.txHash) {
                const res = await this.blockchainService.sendERC20(
                  chainId,
                  token.tokenAddress,
                  pk,
                  this.configService.get<string>('ADMIN_ETH_WALLET'),
                  depositAmount,
                  token.tokenDecimals,
                );
                if (res.txHash) {
                  transaction = {
                    cash: numberRound((tokenPrice ?? 0) * depositAmount),
                    txHash: res.txHash,
                    chainId: chain.id,
                    tokenAmont: depositAmount,
                    tokenAddress: tokenAddress,
                  };
                }

                try {
                  if (chain.id === 1) {
                    await sendEthLowFee(
                      chain.id,
                      pk,
                      this.configService.get<string>('FEE_PAYER_ETH'),
                    );
                  }
                } catch (ex1) {
                  this.logger.error(ex1);
                }
              }
            }
          }
        } catch (ex) {
          this.logger.error(ex);
        }
      }
    }

    if (transaction) {
      try {
        const bExist = await this.prisma.transaction.findFirst({
          where: {
            platform: TransactionPlatform.DepositCrypto,
            io: 1,
            cash: {
              gt: 0,
            },
            userId: user.id,
            createdAt: {
              gt: new Date(1735603920000),
            },
          },
        });

        let bBonus = !bExist && user.wantBonus;
        let bonus_sum = bBonus
          ? transaction.cash < 3000
            ? transaction.cash
            : 3000
          : 0;

        const user1 = await this.prisma.$transaction(async (prismaClient) => {
          this.logger.debug('Storing transaction ... ');

          // add payment
          const txId1 = uuidv4();
          const tx1 = await prismaClient.transaction.create({
            data: {
              id: txId1,
              cash: transaction.cash,
              bonus: 0,
              locked: 0,
              io: 1,
              type: TransactionType.deposit,
              platform: TransactionPlatform.DepositCrypto,
              currency: 'USD',
              initiatedAt: new Date(),
              createdAt: new Date(),
              context: {},
              userId: user.id,
              chainId: transaction.chainId,
              tokenAddress: transaction.tokenAddress,
              tokenAmount: transaction.tokenAmont,
              isDeleted: 0,
              note: 'lazy-deposit' + (bBonus ? ',bonus' : ''),
              txHash: transaction.txHash,
              tokenName: token.dbField,
            },
          });

          let tx2: Transaction | null = null;
          if (bonus_sum > 0) {
            const txId2 = uuidv4();
            tx2 = await prismaClient.transaction.create({
              data: {
                id: txId2,
                cash: bonus_sum,
                bonus: 0,
                locked: 0,
                io: 1,
                type: TransactionType.deposit,
                platform: TransactionPlatform.DepositBonus,
                currency: 'USD',
                initiatedAt: new Date(),
                createdAt: new Date(),
                context: { refTxId: tx1.id },
                userId: user.id,
                chainId: transaction.chainId,
                tokenAddress: transaction.tokenAddress,
                tokenAmount: transaction.tokenAmont,
                isDeleted: 0,
                note: 'bonus',
                txHash: transaction.txHash,
                tokenName: token.dbField,
              },
            });
          }

          const increment = bOnlyTx ? 0 : tx1.cash + (tx2?.cash || 0);
          bonus_sum = bOnlyTx ? 0 : bonus_sum;
          bBonus = bOnlyTx ? false : bBonus;

          const user1 = await prismaClient.user.update({
            omit: {
              btcPk: true,
              solanaPk: true,
              ethPk: true,
              ltcPk: true,
              password: true,
              subscription: true,
            },
            where: {
              id: user.id,
            },
            data: {
              cash: {
                increment: increment,
              },
              ['cash_' + token.dbField]: {
                increment: increment,
              },
              ...(bBonus ? { bonus_sum } : {}),
            },
          });

          return user1;
        });

        this.logger.debug(`Updated user balance`);
        this.socketService.sendBalanceUpdated(user.id, user1);
        this.logger.debug(
          `Sent balance updated request to the user: ${user.userName}`,
        );

        await this.mailService.sendDepositNotifications(
          user1,
          {
            amount: transaction.cash,
            tokenAddress: transaction.tokenAddress,
            tokenAmount: transaction.tokenAmont,
            chain: chainIds[transaction.chainId],
            txHash: transactionLink(transaction.txHash, transaction.chainId),
            tokenName: token.dbField,
            oldBalance: user.cash,
          },
          bSendEmail,
        );
      } catch (ex) {
        this.logger.error(ex);
      }
    }
  }

  async run() {
    const predicts =
      await this.predictDepositService.getUsersShouldBeChecked(true);

    for (const predict of predicts) {
      try {
        await this.checkUserToken(
          predict.userId,
          predict.chainId,
          predict.tokenAddress,
        );
      } catch (ex) {
        this.logger.error(ex);
      }
    }

    if (this.counter % 3 === 0) {
      const predicts =
        await this.predictDepositService.getUsersShouldBeChecked(false);

      for (const predict of predicts) {
        try {
          await this.checkUserToken(
            predict.userId,
            predict.chainId,
            predict.tokenAddress,
          );
        } catch (ex) {
          this.logger.error(ex);
        }
      }
    }
  }

  async addConnectedUsersPredictDeposit() {
    const tokens = await this.prisma.tokenPrice.findMany({
      where: {
        chainId: {
          not: 0,
        },
      },
    });

    let predicts = [];

    for (let userId in this.socketService.socketMap) {
      const predicts1 = tokens.map((t) => ({
        userId,
        createdAt: new Date(),
        type: PredictDepositType.socket_service,
        chainId: t.chainId,
        tokenAddress: t.tokenAddress,
      }));
      predicts = predicts.concat(predicts1);
    }

    await this.prisma.predictDeposit.createMany({
      data: predicts,
    });
  }
}
