import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [WalletModule, PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
