import { Controller, Post, Body } from '@nestjs/common';
import { PredictDepositService } from './predict_deposit.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { AddPredictDepositDto } from './dto/AddPredictDepositDto';

@Controller('predict-deposit')
export class PredictDepositController {
  constructor(private readonly predictDepositService: PredictDepositService) {}

  @Post()
  addPredictDeposit(@LoggedUser() user: User, @Body() body: AddPredictDepositDto) {
    return this.predictDepositService.addPredictDeposit(user.id, body);
  }
}
