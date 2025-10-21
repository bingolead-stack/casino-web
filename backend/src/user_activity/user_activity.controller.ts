import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserActivityService } from './user_activity.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('user-activity')
export class UserActivityController {
  constructor(private readonly userActivityService: UserActivityService) {}

  @Get(':id')
  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getActivities(
    @Param('id') userId: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.userActivityService.getActivities(
      userId,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }
}
