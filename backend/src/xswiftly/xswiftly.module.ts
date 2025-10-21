import { Module } from '@nestjs/common';
import { XswiftlyService } from './xswiftly.service';
import { XswiftlyController } from './xswiftly.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SocketModule } from 'src/socket/socket.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [PrismaModule, SocketModule, MailModule],
  controllers: [XswiftlyController],
  providers: [XswiftlyService],
})
export class XswiftlyModule {}
