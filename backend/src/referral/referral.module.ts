import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReferralBackgroundService } from './referral.background.service';
import { VIPBackgroundService } from './vip.background.service';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PrismaModule, SocketModule],
  controllers: [ReferralController],
  providers: [ReferralService, ReferralBackgroundService, VIPBackgroundService],
  exports: [ReferralService],
})
export class ReferralModule {}
