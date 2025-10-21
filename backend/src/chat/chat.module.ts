import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SocketModule } from 'src/socket/socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [SocketModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
