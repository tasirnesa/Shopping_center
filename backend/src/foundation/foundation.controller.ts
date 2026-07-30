import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';
import { Role } from '@prisma/client';

@Controller('foundation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoundationController {
  constructor(private readonly foundationService: FoundationService) {}

  // Categories
  @Get('categories')
  getCategories(@CurrentOrg() orgId: string) {
    return this.foundationService.getCategories(orgId);
  }

  @Post('categories')
  @Roles('OWNER', 'MANAGER')
  createCategory(
    @CurrentOrg() orgId: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.foundationService.createCategory(orgId, body);
  }

  @Delete('categories/:id')
  @Roles('OWNER', 'MANAGER')
  deleteCategory(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.foundationService.deleteCategory(orgId, id);
  }

  // Brands
  @Get('brands')
  getBrands(@CurrentOrg() orgId: string) {
    return this.foundationService.getBrands(orgId);
  }

  @Post('brands')
  @Roles('OWNER', 'MANAGER')
  createBrand(@CurrentOrg() orgId: string, @Body() body: { name: string }) {
    return this.foundationService.createBrand(orgId, body);
  }

  @Delete('brands/:id')
  @Roles('OWNER', 'MANAGER')
  deleteBrand(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.foundationService.deleteBrand(orgId, id);
  }

  // Units
  @Get('units')
  getUnits(@CurrentOrg() orgId: string) {
    return this.foundationService.getUnits(orgId);
  }

  @Post('units')
  @Roles('OWNER', 'MANAGER')
  createUnit(@CurrentOrg() orgId: string, @Body() body: { name: string }) {
    return this.foundationService.createUnit(orgId, body);
  }

  @Delete('units/:id')
  @Roles('OWNER', 'MANAGER')
  deleteUnit(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.foundationService.deleteUnit(orgId, id);
  }

  // Branches
  @Get('branches')
  getBranches(@CurrentOrg() orgId: string) {
    return this.foundationService.getBranches(orgId);
  }

  @Post('branches')
  @Roles('OWNER')
  createBranch(
    @CurrentOrg() orgId: string,
    @Body()
    body: { name: string; code?: string; phone?: string; address?: string },
  ) {
    return this.foundationService.createBranch(orgId, body);
  }

  // Users Management
  @Get('users')
  @Roles('OWNER', 'MANAGER')
  getUsers(@CurrentOrg() orgId: string) {
    return this.foundationService.getUsers(orgId);
  }

  @Patch('users/:id/role')
  @Roles('OWNER')
  updateUserRole(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() body: { role: Role },
  ) {
    return this.foundationService.updateUserRole(orgId, id, body.role);
  }
}
