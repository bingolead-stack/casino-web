import { Body, Controller, Logger, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/strategies/public-strategy';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailService: MailService) {}

  @Post()
  @Public()
  fetchGameById(@Body() body: any) {
    return this.mailService.sendMail(
      body.from,
      body.to,
      body.subject,
      body.template,
      body.variables,
    );
  }
}
