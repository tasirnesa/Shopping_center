import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';
import { FileUploadService } from '../orders/file-upload.service';
import * as path from 'path';

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @Roles('OWNER', 'MANAGER', 'INVOICE_MAKER', 'SALES_REP')
  findAll(@CurrentOrg() orgId: string) {
    return this.customersService.findAll(orgId);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'INVOICE_MAKER', 'SALES_REP')
  findOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.customersService.findOne(orgId, id);
  }

  @Post()
  @Roles('OWNER', 'MANAGER', 'INVOICE_MAKER')
  create(
    @CurrentOrg() orgId: string,
    @Body() dto: {
      name: string;
      phone?: string;
      email?: string;
      tin?: string;
      creditLimit?: number;
    },
  ) {
    return this.customersService.create(orgId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER', 'INVOICE_MAKER')
  update(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() dto: {
      name?: string;
      phone?: string;
      email?: string;
      tin?: string;
      creditLimit?: number;
    },
  ) {
    return this.customersService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  remove(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.customersService.remove(orgId, id);
  }

  /** Upload or replace a customer's EFDA license file */
  @Post(':id/efda')
  @Roles('OWNER', 'MANAGER', 'INVOICE_MAKER')
  @UseInterceptors(FileInterceptor('file'))
  async uploadEfda(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    this.fileUploadService.validateFile(file);
    const subPath = path.join('customers', orgId, id);
    const storedPath = await this.fileUploadService.store(file, subPath, 'EFDA_LICENSE');
    return this.customersService.saveEfdaLicense(orgId, id, storedPath, file.originalname);
  }
}
