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
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // ───── SYSTEM_ADMIN only ─────

  @Get()
  @Roles('SYSTEM_ADMIN')
  findAll() {
    return this.organizationService.findAll();
  }

  @Post()
  @Roles('SYSTEM_ADMIN')
  create(
    @Body()
    dto: {
      name: string;
      businessType?: string;
      tin?: string;
      phone?: string;
      email?: string;
      address?: string;
    },
  ) {
    return this.organizationService.create(dto);
  }

  @Get(':id')
  @Roles('SYSTEM_ADMIN', 'OWNER')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  @Roles('SYSTEM_ADMIN', 'OWNER')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.organizationService.update(id, dto);
  }

  @Delete(':id')
  @Roles('SYSTEM_ADMIN')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }

  // ───── Settings (Org Owner or System Admin) ─────

  @Get('settings/my')
  @Roles('OWNER', 'MANAGER')
  getMySettings(@CurrentOrg() orgId: string) {
    return this.organizationService.getSettings(orgId);
  }

  @Patch('settings/my')
  @Roles('OWNER')
  updateMySettings(@CurrentOrg() orgId: string, @Body() dto: any) {
    return this.organizationService.updateSettings(orgId, dto);
  }
}
