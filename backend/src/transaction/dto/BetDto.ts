import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class BetDto {
  amount: number;
  currency: string;
  gameId: string;
  playerId: string;
  provider: string;
  reason: string;
  roundClosed: boolean;
  roundId: string;
  sessionToken: string;
  sideSplit?: {
    base: number;
    side: number;
  };
  txId?: string;
  betTxId?: string;
  refundTxId?: string;
}
