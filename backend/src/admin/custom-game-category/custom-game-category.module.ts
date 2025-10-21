import { Module } from '@nestjs/common';
import { CustomGameCategoryService } from './custom-game-category.service';
import { CustomGameCategoryController } from './custom-game-category.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Gr8CasinoModule } from 'src/gr8_casino/gr8_casino.module';

@Module({
  imports: [PrismaModule, Gr8CasinoModule],
  controllers: [CustomGameCategoryController],
  providers: [CustomGameCategoryService],
})
export class CustomGameCategoryModule {}
