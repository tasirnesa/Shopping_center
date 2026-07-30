import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg, CurrentBranch } from '../auth/org.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  create(
    @CurrentOrg() orgId: string,
    @CurrentBranch() userBranchId: string,
    @Body()
    dto: {
      customerId?: string;
      discount?: number;
      details: { productId: string; quantity: number; price: number }[];
      branchId?: string;
    },
  ) {
    const branchId = dto.branchId || userBranchId;
    if (!branchId) {
      throw new BadRequestException('branchId is required');
    }
    return this.salesService.create(orgId, { ...dto, branchId });
  }

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  findAll(@CurrentOrg() orgId: string) {
    return this.salesService.findAll(orgId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  findOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.salesService.findOne(orgId, id);
  }

  @Post('returns')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  processReturn(
    @CurrentOrg() orgId: string,
    @CurrentBranch() userBranchId: string,
    @Body()
    dto: {
      saleId: string;
      branchId?: string;
      details: { productId: string; quantity: number; price: number }[];
    },
  ) {
    const branchId = dto.branchId || userBranchId;
    if (!dto.saleId || !branchId) {
      throw new BadRequestException('saleId and branchId are required');
    }
    return this.salesService.processReturn(orgId, { ...dto, branchId });
  }
}
