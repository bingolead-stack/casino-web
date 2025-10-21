import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SocketModule } from './socket/socket.module';
import { PushModule } from './push/push.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './global-exception.filter';
import { WalletModule } from './wallet/wallet.module';
import { ProfileModule } from './profile/profile.module';
import { AdminModule } from './admin/admin.module';
import { AgentModule } from './agent/agent.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenPriceModule } from './token_price/token_price.module';
import { PredictDepositModule } from './predict_deposit/predict_deposit.module';
import { FavoriteGameModule } from './favorite_game/favorite_game.module';
import { ReferralModule } from './referral/referral.module';
import { RecentGameModule } from './recent_game/recent_game.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ChatModule } from './chat/chat.module';
import { SettingModule } from './setting/setting.module';
import { UserActivityModule } from './user_activity/user_activity.module';
import { XswiftlyModule } from './xswiftly/xswiftly.module';
import { PrizeModule } from './prize/prize.module';
import { Gr8CasinoModule } from './gr8_casino/gr8_casino.module';
import { PlayerModule } from './player/player.module';
import { TransactionModule } from './transaction/transaction.module';
import { LiveSupportModule } from './live_support/live_support.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BlockchainModule,
    MailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    SocketModule,
    PushModule,
    WalletModule,
    ProfileModule,
    AdminModule,
    AgentModule,
    TokenPriceModule,
    PredictDepositModule,
    FavoriteGameModule,
    RecentGameModule,
    ReferralModule,
    XswiftlyModule,
    ChatModule,
    SettingModule,
    UserActivityModule,
    PrizeModule,
    Gr8CasinoModule,
    PlayerModule,
    TransactionModule,
    LiveSupportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
