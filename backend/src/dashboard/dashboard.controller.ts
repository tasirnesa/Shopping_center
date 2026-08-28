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
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('summary')
  @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER', 'SALES_REP', 'INVOICE_MAKER', 'STORE_MAN', 'DRIVER')
  getSummary(@CurrentOrg() orgId: string) {
    return this.dashboardService.getSummary(orgId);
  }

  @Get('today-orders')
  @Roles(Role.SALES_REP, Role.MANAGER, Role.OWNER, Role.SYSTEM_ADMIN)
  getTodayOrders(@CurrentOrg() orgId: string, @Req() req: any) {
    return this.dashboardService.getTodayOrderStats(orgId, req.user.id, req.user.role);
  }

  @Get('fulfillment')
  @Roles(Role.SALES_REP, Role.INVOICE_MAKER, Role.STORE_MAN, Role.DRIVER, Role.MANAGER, Role.OWNER, Role.SYSTEM_ADMIN)
  getFulfillment(@CurrentOrg() orgId: string, @Req() req: any) {
    // If user has no orgId (created before fix), still return empty structure gracefully
    if (!orgId) {
      return {};
    }
    return this.dashboardService.getFulfillmentDashboard(orgId, req.user.role, req.user.id);
  }

  @Get('admin')
  @Roles(Role.MANAGER, Role.OWNER, Role.SYSTEM_ADMIN)
  getAdminDashboard(@CurrentOrg() orgId: string) {
    return this.dashboardService.getAdminDashboard(orgId);
  }

  @Get('sales-performance')
  @Roles(Role.MANAGER, Role.OWNER, Role.SYSTEM_ADMIN)
  getSalesPerformance(@CurrentOrg() orgId: string) {
    return this.dashboardService.getSalesPerformance(orgId);
  }

  @Get('system')
  @Roles(Role.SYSTEM_ADMIN)
  getSystemDashboard() {
    return this.dashboardService.getSystemDashboard();
  }
}
