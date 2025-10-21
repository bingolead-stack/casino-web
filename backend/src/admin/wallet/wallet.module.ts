import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { SocketModule } from 'src/socket/socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletModule as GlobalWalletModule } from 'src/wallet/wallet.module';
import { PushModule } from 'src/push/push.module';
import { MailModule } from 'src/mail/mail.module';
import { TokenPriceModule } from 'src/token_price/token_price.module';

@Module({
  imports: [
    SocketModule,
    PrismaModule,
    GlobalWalletModule,
    PushModule,
    MailModule,
    TokenPriceModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
