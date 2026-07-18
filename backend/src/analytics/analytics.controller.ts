import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':userId')
  async getDashboard(@Param('userId') userId: string) {
    return this.analyticsService.getDashboardData(userId);
  }
}
