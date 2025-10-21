import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AgentModule } from './agents/agent.module';
import { WalletModule } from './wallet/wallet.module';
import { CustomGameCategoryModule } from './custom-game-category/custom-game-category.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReferralModule } from './referral/referral.module';

@Module({
  imports: [
    UserModule,
    AgentModule,
    WalletModule,
    CustomGameCategoryModule,
    DashboardModule,
    ReferralModule,
  ],
})
export class AdminModule {}
