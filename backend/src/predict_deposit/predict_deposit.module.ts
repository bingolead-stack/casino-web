import { Module } from '@nestjs/common';
import { PredictDepositService } from './predict_deposit.service';
import { PredictDepositController } from './predict_deposit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PredictDepositController],
  providers: [PredictDepositService],
  exports: [PredictDepositService],
})
export class PredictDepositModule {}
