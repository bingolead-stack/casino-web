import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { MailModule } from 'src/mail/mail.module';
import * as fs from 'fs';
import { SocketModule } from 'src/socket/socket.module';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserActivityModule } from 'src/user_activity/user_activity.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { algorithm: 'RS256' },
      privateKey: fs.readFileSync(`private_key`),
      publicKey: fs.readFileSync(`public_key`),
    }),
    PrismaModule,
    MailModule,
    SocketModule,
    BlockchainModule,
    UserActivityModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
