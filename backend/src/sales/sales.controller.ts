import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @Roles('OWNER', 'MANAGER', 'CASHIER')
    create(@Body() createSaleDto: Prisma.SaleCreateInput) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    @Roles('OWNER', 'MANAGER', 'CASHIER')
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    @Roles('OWNER', 'MANAGER', 'CASHIER')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }
}
