import { Module } from '@nestjs/common';
import { TokenPriceService } from './token_price.service';
import { TokenPriceController } from './token_price.controller';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [BlockchainModule, PrismaModule],
  controllers: [TokenPriceController],
  providers: [TokenPriceService],
  exports: [TokenPriceService],
})
export class TokenPriceModule {}
