import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReferralModule as ClientReferralModule } from 'src/referral/referral.module';

@Module({
  imports: [PrismaModule, ClientReferralModule],
  controllers: [ReferralController],
  providers: [ReferralService],
})
export class ReferralModule {}
