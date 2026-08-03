import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  findAll(@CurrentOrg() orgId: string) {
    return this.customersService.findAll(orgId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  findOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.customersService.findOne(orgId, id);
  }

  @Post()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  create(
    @CurrentOrg() orgId: string,
    @Body() dto: { name: string; phone?: string; email?: string },
  ) {
    return this.customersService.create(orgId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  update(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() dto: { name?: string; phone?: string; email?: string },
  ) {
    return this.customersService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  remove(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.customersService.remove(orgId, id);
  }
}
