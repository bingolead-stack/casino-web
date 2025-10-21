import { Controller, Get, Query, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import { Response } from 'express';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';

@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HasRoles(UserRole.ADMIN, UserRole.SUB_ADMIN, UserRole.SUPER_ADMIN)
  findAll(@LoggedUser() auth: User) {
    return this.dashboardService.findAll(auth);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('finance/analysis')
  getFinanceAnalysis(
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('timezoneOffsetInMinutes') timezoneOffsetInMinutes: string,
  ) {
    return this.dashboardService.getFinanceAnalysis(
      +startTimestamp,
      +endTimestamp,
      +timezoneOffsetInMinutes,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('finance/provider-analysis')
  getAnalysisByProviders(
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('userId') userId: string,
  ) {
    return this.dashboardService.getAnalysisByProviders(
      +startTimestamp,
      +endTimestamp,
      userId,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('finance/provider-analysis-real')
  getAnalysisByProvidersReal(
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.dashboardService.getAnalysisByProvidersReal(
      +startTimestamp,
      +endTimestamp,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('finance/provider-analysis/xls')
  async exportXLS(
    @Res() res: Response,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    const workbook = await this.dashboardService.exportXLS(
      +startTimestamp,
      +endTimestamp,
    );
    const buffer = await workbook.xlsx.writeBuffer();
    res.header(
      'Content-Disposition',
      'attachment; filename=ProviderAnalysis-casino.xlsx',
    );
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('finance/analysis/sum')
  getFinanceAnalysisSum(
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.dashboardService.getFinanceAnalysisSum(
      +startTimestamp,
      +endTimestamp,
    );
  }
}
