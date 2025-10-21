import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('referers')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findReferers(
    @Query('keyword') keyword: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.referralService.findReferers(keyword, +offset, +length);
  }

  @Get('referers/:id')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findOne(
    @Param('id') userId: string,
    @Query('year') year: number,
    @Query('month') month: number,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.referralService.findRefererDetail(
      userId,
      +year,
      +month,
      +offset,
      +length,
    );
  }
}
