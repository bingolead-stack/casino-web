import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { XswiftlyService } from './xswiftly.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { Public } from 'src/auth/strategies/public-strategy';
import { ProcessPaymentCallbackDto } from './dto/ProcessPaymentCallbackDto';
import { Request } from 'express';

@Controller('xswiftly')
export class XswiftlyController {
  constructor(private readonly xswiftlyService: XswiftlyService) {}

  @Post('process-payment')
  processPayment(@LoggedUser() user: User, @Body() body: ProcessPaymentDto) {
    return this.xswiftlyService.processPayment(user.id, body);
  }

  @Public()
  @Post('process-payment-callback')
  processPaymentCallback(
    @Body() body: ProcessPaymentCallbackDto,
    @Req() req: Request,
  ) {
    const bearer = this.extractTokenFromHeader(req);
    if (bearer !== 'f17af17f6b59b4e7f1d4a6e99fbf7675') {
      throw new BadRequestException();
    }

    return this.xswiftlyService.processPaymentCallback(body);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
