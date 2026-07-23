import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @Roles('OWNER', 'MANAGER', 'STORE_KEEPER')
    create(@Body() createProductDto: Prisma.ProductCreateInput) {
        return this.productService.create(createProductDto);
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
    findAll() {
        return this.productService.findAll();
    }

    @Get('barcode/:barcode')
    @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
    findByBarcode(@Param('barcode') barcode: string) {
        return this.productService.findByBarcode(barcode);
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'CASHIER', 'STORE_KEEPER')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @Patch(':id')
    @Roles('OWNER', 'MANAGER')
    update(@Param('id') id: string, @Body() updateProductDto: Prisma.ProductUpdateInput) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @Roles('OWNER')
    remove(@Param('id') id: string) {
        return this.productService.remove(id);
    }
}
