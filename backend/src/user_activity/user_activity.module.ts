import { Module } from '@nestjs/common';
import { UserActivityService } from './user_activity.service';
import { UserActivityController } from './user_activity.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserActivityController],
  providers: [UserActivityService],
  exports: [UserActivityService],
})
export class UserActivityModule {}
