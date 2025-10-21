import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { SocketModule } from 'src/socket/socket.module';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletBackgroundService } from './wallet.background.service';
import { TokenPriceModule } from 'src/token_price/token_price.module';
import { PushModule } from 'src/push/push.module';
import { MailModule } from 'src/mail/mail.module';
import { PredictDepositModule } from 'src/predict_deposit/predict_deposit.module';
import { UserActivityModule } from 'src/user_activity/user_activity.module';

@Module({
  imports: [
    SocketModule,
    BlockchainModule,
    PrismaModule,
    TokenPriceModule,
    PushModule,
    MailModule,
    PredictDepositModule,
    UserActivityModule,
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletBackgroundService,
  ],
  exports: [WalletService],
})
export class WalletModule {}
