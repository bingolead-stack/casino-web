import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Gr8CasinoModule } from 'src/gr8_casino/gr8_casino.module';

@Module({
  imports: [Gr8CasinoModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
