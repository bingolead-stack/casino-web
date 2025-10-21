import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionPlatform } from 'src/utils/constants';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  
}
