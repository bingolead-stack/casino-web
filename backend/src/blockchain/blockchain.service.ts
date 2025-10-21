import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from './dto/TokenResponseDto';
import {
  BITCOIN_CHAIN_ID,
  chainIds,
  cmcIds,
  LITECOIN_CHAIN_ID,
  SOLANA_CHAIN_ID,
} from './constants';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  ComputeBudgetProgram,
} from '@solana/web3.js';
import * as TweetNaCl from 'tweetnacl';
import Moralis from 'moralis';
import {
  createWalletClient,
  decodeFunctionData,
  erc20Abi,
  formatUnits,
  http,
  parseUnits,
  publicActions,
} from 'viem';

const solanaWeb3 = require('@solana/web3.js');
import { SolNetwork } from '@moralisweb3/common-sol-utils';
import {
  getAccount,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { createRpcClient } from './createRpcClient';
import { getKeypairFromBase58 } from './sendSolana';
import { verifySolanaTx } from './verifySolanaTx';
import { evmChains, rpcUrls } from './config';
import { decrypt } from 'src/utils/encrypt';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(private readonly configService: ConfigService) {
    if (!Moralis.Core.isStarted) {
      Moralis.start({
        apiKey: this.configService.get<string>('MORALIS_API_KEY'),
      });
    }
  }

  async getCoingeckoTokenPrice(
    token: 'solana' | 'bitcoin' | 'eth' | 'litecoin',
  ) {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
      );
      const data = await res.json();
      return Number(data[token]?.usd);
    } catch (ex) {
      return 0;
    }
  }

  async getCmcTokenPrice(token: string) {
    if (cmcIds[token]) {
      const res = await fetch(
        `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${cmcIds[token]}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': this.configService.get<string>('CMC_API_KEY'),
          },
        },
      );
      const data = await res.json();
      return Number(data.data[cmcIds[token]].quote.USD.price);
    }
  }

  async getPortalsTokenPrice(chainId: number, tokenAddress: string) {
    const chains = {
      1: 'ethereum',
      56: 'bsc',
      137: 'polygon',
      43114: 'avalanche',
      250: 'fantom',
      10: 'optimism',
      42161: 'arbitrum',
      100: 'gnosis',
      8453: 'base',
    };

    if (chains[chainId]) {
      const res = await fetch(
        `https://api.portals.fi/v2/tokens?ids=${chains[chainId]}%3A${tokenAddress}&sortDirection=asc&limit=25&page=0`,
        {
          headers: {
            Authorization: this.configService.get<string>('PORTAL_FI_KEY'),
          },
        },
      );

      const resData = await res.json();

      const data = resData.tokens[0] as TokenResponseDto;
      // this.logger.debug(data);
      return data?.price;
    } else if (chainId === SOLANA_CHAIN_ID) {
      return this.getCoingeckoTokenPrice('solana');
    } else if (chainId === BITCOIN_CHAIN_ID) {
      return this.getCoingeckoTokenPrice('bitcoin');
    }

    return 0;
  }

  async getAlchemyTokenPrice(chainId: number, tokenAddress: string) {
    const symbols = {
      1: 'ETH',
      56: 'BNB',
      137: 'POL',
      43114: 'AVAX',
      250: 'fantom',
      10: 'optimism',
      42161: 'arbitrum',
      100: 'gnosis',
      8453: 'BASE',
      [BITCOIN_CHAIN_ID]: 'BTC',
      [SOLANA_CHAIN_ID]: 'SOL',
      [LITECOIN_CHAIN_ID]: 'LTC',
    };

    const chainsEnums = {
      1: 'eth-mainnet',
      56: 'bnb-mainnet',
      137: 'polygon-mainnet',
      43114: 'avax-mainnet',
      250: 'fantom',
      10: 'optimism',
      42161: 'arbitrum',
      100: 'gnosis',
      8453: 'BASE',
      [BITCOIN_CHAIN_ID]: 'BTC',
      [SOLANA_CHAIN_ID]: 'SOL',
      [LITECOIN_CHAIN_ID]: 'LTC',
    };

    if (!symbols[chainId]) {
      return 0;
    }

    const alchemyKey = this.configService.get<string>('ALCHEMY_API_KEY');
    if (tokenAddress === '0x') {
      const res = await fetch(
        `https://api.g.alchemy.com/prices/v1/${alchemyKey}/tokens/by-symbol?symbols=${symbols[chainId]}`,
      );

      const resData = await res.json();
      if (res.status === 200) {
        return Number(resData.data[0].prices[0].value);
      } else {
        this.logger.error(resData);
        return 0;
      }
    } else {
      const res = await fetch(
        `https://api.g.alchemy.com/prices/v1/${alchemyKey}/tokens/by-address?network=${chainsEnums[chainId]}&address=${tokenAddress}`,
      );

      const resData = await res.json();
      if (res.status === 200) {
        return Number(resData.data[0].prices[0].value);
      } else {
        this.logger.error(resData);
        return 0;
      }
    }
  }

  async getTokenPrice(chainId: number, tokenAddress: string) {
    try {
      if (chainId === BITCOIN_CHAIN_ID) {
        return await this.getAlchemyTokenPrice(BITCOIN_CHAIN_ID, '0x');
      } else if (chainId === LITECOIN_CHAIN_ID) {
        return await this.getAlchemyTokenPrice(LITECOIN_CHAIN_ID, '0x');
      } else if (chainId === SOLANA_CHAIN_ID) {
        if (tokenAddress === '0x') {
          return await this.getAlchemyTokenPrice(SOLANA_CHAIN_ID, '0x');
        }
        const response = await Moralis.SolApi.token.getTokenPrice({
          network: SolNetwork.MAINNET,
          address: tokenAddress,
        });
        return response.result.usdPrice;
      } else {
        if (tokenAddress === '0x') {
          return await this.getAlchemyTokenPrice(chainId, tokenAddress);
        }
        const response = await Moralis.EvmApi.token.getTokenPrice({
          chain: '0x' + chainId.toString(16),
          address: tokenAddress,
        });
        return response.result.usdPrice;
      }
    } catch (ex) {
      this.logger.error(ex);
      return 0;
    }
  }

  async getToken(chainId: number, tokenAddress: string) {
    if ([1, 137, 56, 8453, 100, 43114, 250, 10, 42161].includes(chainId)) {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: '0x' + chainId.toString(16),
        address: tokenAddress,
      });
      return response.result;
    }

    if (chainId === SOLANA_CHAIN_ID) {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': this.configService.get<string>('MORALIS_API_KEY'),
        },
      };

      const response = await fetch(
        `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`,
        options,
      );

      if (response.status === 200) {
        const res = await response.json();

        const price = await Moralis.SolApi.token.getTokenPrice({
          network: SolNetwork.MAINNET,
          address: tokenAddress,
        });

        return {
          tokenName: res.name,
          tokenSymbol: res.symbol,
          tokenLogo: res.logo,
          tokenDecimals: +res.decimals,
          usdPrice: price.result.usdPrice,
          usdPriceFormatted: price.result.usdPrice.toLocaleString('en-US'),
        };
      }

      throw new BadRequestException('token.not-found');
    }
  }

  generateEthAddress(): { address: string; privateKey: string } {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return { address: account.address, privateKey };
  }

  generateSolanaAddress(): { address: string; privateKey: string } {
    const keypair = Keypair.generate();
    return {
      address: keypair.publicKey.toString(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
  }

  async getSolanaTransactionDetails(signature, cluster = 'mainnet-beta') {
    await new Promise((resolve, reject) => setTimeout(() => resolve(1), 3000));

    const connection = new solanaWeb3.Connection(
      this.configService.get<string>('SOLANA_ENDPOINT') ||
        solanaWeb3.clusterApiUrl(cluster),
      'confirmed',
    );

    try {
      const transaction = await connection.getParsedTransaction(
        signature,
        'confirmed',
      );

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const blockTime = transaction.blockTime;
      const transactionDate = blockTime ? new Date(blockTime * 1000) : null;

      const instructions = transaction.transaction.message.instructions;
      let sender, receiver, tokenAddress, tokenAmount;

      for (const instruction of instructions) {
        if (instruction.program === 'system') {
          // Check if the instruction is a native SOL transfer
          if (instruction.parsed && instruction.parsed.type === 'transfer') {
            const info = instruction.parsed.info;
            sender = info.source;
            receiver = info.destination;
            tokenAmount = +info.lamports / 1_000_000_000; // Amount in lamports
            tokenAddress = '0x';
            break;
          }
        } else if (
          instruction.program === 'spl-token' &&
          instruction.parsed &&
          instruction.parsed.type === 'transfer'
        ) {
          // Handle token transfer
          const info = instruction.parsed.info;

          const sourceTokenAccount = await connection.getParsedAccountInfo(
            new solanaWeb3.PublicKey(info.source),
          );
          sender = sourceTokenAccount.value.data.parsed.info.owner;
          tokenAddress = sourceTokenAccount.value.data.parsed.info.mint;

          const destinationTokenAccount = await connection.getParsedAccountInfo(
            new solanaWeb3.PublicKey(info.destination),
          );
          receiver = destinationTokenAccount.value.data.parsed.info.owner;

          // console.log(tokenAddress);
          const mintAccountInfo = await connection.getParsedAccountInfo(
            new solanaWeb3.PublicKey(tokenAddress),
          );
          // console.log(mintAccountInfo);
          const decimals = mintAccountInfo.value.data.parsed.info.decimals;
          tokenAmount = Number(info.amount.toString()) / Math.pow(10, decimals);
        }
      }

      return {
        sender,
        receiver,
        tokenAddress,
        tokenAmount,
        transactionDate,
      };
    } catch (error) {
      this.logger.error('Error fetching transaction details:', error);
      throw error;
    }
  }

  verifySolanaSignature(message: string, signature: any, publicKey: string) {
    // Encode the message to a Uint8Array
    const encodedMessage = new TextEncoder().encode(message);

    // Convert the signature from base64 to a Uint8Array
    const signatureUint8 = Uint8Array.from(signature);

    // Convert the public key to a Uint8Array
    const publicKeyObj = new PublicKey(publicKey);
    const publicKeyUint8 = publicKeyObj.toBytes();

    try {
      // Verify the signature
      const isValid = TweetNaCl.sign.detached.verify(
        encodedMessage,
        signatureUint8,
        publicKeyUint8,
      );

      return isValid;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  public async getERC20Balance(
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
  ) {
    const client = createRpcClient(chainId);
    const [decimals, balance] = await Promise.all([
      client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      }),
      client.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [walletAddress as `0x${string}`],
      }),
    ]);

    const amount = +formatUnits(balance, decimals);
    return amount;
  }

  public async sendERC20(
    chainId: number,
    tokenAddress: string,
    pk: string,
    recipient: string,
    tokenAmount: number,
    decimals: number,
  ) {
    const client = createRpcClient(chainId);
    // Create an account from the private key
    const account = privateKeyToAccount(pk as `0x${string}`);

    // Create a wallet client with the specified account, chain, and HTTP transport
    const walletClient = createWalletClient({
      account,
      chain: evmChains[chainId],
      transport: http(rpcUrls[chainId]),
    }).extend(publicActions);

    const amount = parseUnits(tokenAmount.toString(), decimals);
    // const { request } = await walletClient.simulateContract({
    //   chain: evmChains[chainId],
    //   account,
    //   address: tokenAddress as `0x${string}`,
    //   abi: erc20Abi,
    //   functionName: 'transfer',
    //   args: [recipient as `0x${string}`, amount],
    // });
    // const hash = await walletClient.writeContract(request);

    const gasPrice = (await client.getGasPrice()) + 1000000000n;
    const gasLimit = BigInt(400000);

    const hash = await walletClient.writeContract({
      chain: evmChains[chainId],
      account,
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, amount],
      gas: gasLimit,
      gasPrice,
    });

    // Wait for the transaction to be mined
    const receipt = await walletClient.waitForTransactionReceipt({
      hash: hash,
    });
    console.log('Transaction confirmed:', receipt.transactionHash);

    return { txHash: hash, amount };
  }

  public async getEthereumTransaction(chainId: number, txHash: string) {
    const client = createRpcClient(chainId);
    const token = {
      from: '',
      to: '',
      address: '',
      amount: 0,
    };

    let transaction;
    try {
      this.logger.debug(`Getting transaction data ${txHash} ...`);
      transaction = await client.getTransaction({
        hash: txHash as `0x${string}`,
      });
    } catch (error) {
      this.logger.error('Error fetching transaction:', error);
      throw error;
    }

    // Output logs
    this.logger.debug(`From: ${transaction.from}`);
    this.logger.debug(`To: ${transaction.to}`);
    this.logger.debug(`Value (in Wei): ${transaction.value.toString()}`);
    this.logger.debug(`Input Data: ${transaction.input}`);

    token.from = transaction.from;

    if (transaction.input && transaction.input !== '0x') {
      // in case of token call
      this.logger.debug(transaction.input);

      // Decode the function data
      const decodedData = decodeFunctionData({
        abi: erc20Abi,
        data: transaction.input,
      });

      // Output logs
      this.logger.debug('Function Name:', decodedData.functionName);
      this.logger.debug('Function Arguments:', decodedData.args);

      // Check if the transaction is transfer tx
      if (decodedData.functionName !== 'transfer') {
        this.logger.error('Transaction is not transfer transaction');
        throw new BadRequestException('Your transaction is not valid');
      }

      // Getting decimals
      this.logger.debug('Getting decimals');
      const decimals = await client.readContract({
        address: transaction.to,
        abi: erc20Abi,
        functionName: 'decimals',
      });
      this.logger.debug('Decimals is ' + decimals);

      token.to = decodedData.args[0];
      token.address = transaction.to;
      token.amount = +formatUnits(decodedData.args[1], decimals);
      this.logger.debug('tokenAmount is ' + token.amount);
    } else {
      token.to = transaction.to;
      token.address = '0x';
      token.amount = +formatUnits(transaction.value.toString(), 18);
    }

    return token;
  }

  async getNftTokenIds(chainId: number, tokenAddress: string, address: string) {
    let result: any[] = [];

    let response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: '0x' + chainId.toString(16),
      format: 'decimal',
      tokenAddresses: [tokenAddress],
      mediaItems: false,
      address: address,
      normalizeMetadata: false,
    });

    result = result.concat(response.result);
    while (response.hasNext()) {
      response = await response.next();
      result = result.concat(response.result);
    }

    return result;
  }

  async getSolanaBalance(address: string) {
    const connection = new Connection(
      this.configService.get<string>('SOLANA_ENDPOINT') ||
        clusterApiUrl('mainnet-beta'),
      'confirmed',
    );
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);

    // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
    const solBalance = balance / 1e9;

    this.logger.debug(`Balance for wallet ${address}: ${solBalance} SOL`);
    return solBalance;
  }

  async getEthBalance(address: `0x${string}`, chain) {
    const client = createRpcClient(chain.id);
    // Get the balance of the source wallet
    const balance = await client.getBalance({
      address: address,
    });

    return +formatUnits(balance, 18);
  }

  async getSPLTokenBalance(
    tokenMintAddress: string,
    walletAddress: string,
    decimals: number = 0,
  ) {
    const connection = new Connection(
      this.configService.get<string>('SOLANA_ENDPOINT') ||
        clusterApiUrl('mainnet-beta'),
      'confirmed',
    );

    // Create PublicKey objects for the wallet and token mint
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);

    // Get the associated token account address for the wallet
    const associatedTokenAddress = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      walletPublicKey,
    );

    // Fetch the account information
    try {
      // Fetch the mint information to get decimals
      // const mintInfo = await getMint(connection, tokenMintPublicKey);
      // const decimals = mintInfo.decimals;

      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      const balance = Number(tokenAccount.amount) / Math.pow(10, decimals);
      this.logger.debug(`Token:${tokenMintAddress} balance is ${balance}`);
      return balance;
    } catch (error) {
      console.error('Error fetching token account information:', error);
      return 0;
    }
  }

  async sendSPLToken(
    senderPrivateKey: string,
    recipientAddress: string,
    tokenMintAddress: string,
    amountToSend: number,
    decimals: number,
  ) {
    // Connect to the Solana network
    const connection = new Connection(
      this.configService.get<string>('SOLANA_ENDPOINT') ||
        clusterApiUrl('mainnet-beta'),
      'confirmed',
    );

    // Create a Keypair from the sender's private key
    const secretKey = Buffer.from(senderPrivateKey, 'hex');
    const senderKeypair = Keypair.fromSecretKey(secretKey);

    // Create PublicKey objects for the recipient and token mint
    const recipientPublicKey = new PublicKey(recipientAddress);
    const tokenMintPublicKey = new PublicKey(tokenMintAddress);
    const payer = getKeypairFromBase58(
      decrypt(this.configService.get<string>('SOL_PAYER_WALLET')),
    );

    // Get or create the associated token account for the recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      tokenMintPublicKey,
      recipientPublicKey,
    );

    // Get the sender's associated token account
    const senderTokenAccount = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      senderKeypair.publicKey,
    );

    // Create the transfer instruction
    const transferInstruction = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount.address,
      senderKeypair.publicKey,
      Math.round(amountToSend * Math.pow(10, decimals)),
    );

    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: 100000,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 1000000,
    });

    // Create and send the transaction
    const transaction = new solanaWeb3.Transaction()
      .add(modifyComputeUnits)
      .add(addPriorityFee)
      .add(transferInstruction);
    transaction.feePayer = payer.publicKey;

    try {
      const signature = await connection.sendTransaction(transaction, [
        senderKeypair,
        payer,
      ]);
      console.log(`Transaction sent with signature: ${signature}`);
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed');

      await new Promise((resolve, reject) =>
        setTimeout(() => resolve(1), 3000),
      );
      await verifySolanaTx(signature);
      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return '';
    }
  }
}
