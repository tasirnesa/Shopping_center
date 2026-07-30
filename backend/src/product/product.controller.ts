import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('OWNER', 'MANAGER', 'STORE_KEEPER')
  create(
    @CurrentOrg() orgId: string,
    @Body()
    dto: {
      name: string;
      barcode?: string;
      categoryId?: string;
      brandId?: string;
      unitId?: string;
      price: number;
      cost: number;
    },
  ) {
    return this.productService.create(orgId, dto);
  }

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
  findAll(@CurrentOrg() orgId: string) {
    return this.productService.findAll(orgId);
  }

  @Get('barcode/:barcode')
  @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
  findByBarcode(
    @CurrentOrg() orgId: string,
    @Param('barcode') barcode: string,
  ) {
    return this.productService.findByBarcode(orgId, barcode);
  }

  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
  findOne(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.productService.findOne(orgId, id);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  update(
    @CurrentOrg() orgId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.productService.update(orgId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  remove(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.productService.remove(orgId, id);
  }
}
