import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
  getSummary(@CurrentOrg() orgId: string) {
    return this.dashboardService.getSummary(orgId);
  }

  @Get('fulfillment')
  @Roles(Role.SALES_REP, Role.INVOICE_MAKER, Role.STORE_MAN, Role.DRIVER, Role.MANAGER, Role.OWNER, Role.SYSTEM_ADMIN)
  getFulfillment(@CurrentOrg() orgId: string, @Req() req: any) {
    return this.dashboardService.getFulfillmentDashboard(orgId, req.user.role);
  }
}
