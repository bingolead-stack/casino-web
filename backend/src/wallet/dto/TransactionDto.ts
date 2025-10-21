import {
  IsString,
  IsObject,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  ROLLBACK = 'rollback',
}

type Context = {
  product: string;
  reason: string;
  betId: string;
  parentId: string;
}

type AmountBreakdown = {
  cash: number;
  bonus: number;
  locked: number;
}

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  initiatedAt: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsObject()
  context: Context;

  @IsObject()
  amountBreakdown: AmountBreakdown;
}
