import { Module } from '@nestjs/common';
import { LiveSupportController } from './live_support.controller';
import { LiveSupportService } from './live_support.service';
import { SocketModule } from 'src/socket/socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [SocketModule, PrismaModule],
  controllers: [LiveSupportController],
  providers: [LiveSupportService],
})

export class LiveSupportModule {}