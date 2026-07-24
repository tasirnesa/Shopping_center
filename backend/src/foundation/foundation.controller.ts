import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('foundation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoundationController {
    constructor(private readonly foundationService: FoundationService) { }

    // Categories
    @Get('categories')
    getCategories() { return this.foundationService.getCategories(); }

    @Post('categories')
    @Roles('OWNER', 'MANAGER')
    createCategory(@Body() body: { name: string; description?: string }) { return this.foundationService.createCategory(body); }

    @Delete('categories/:id')
    @Roles('OWNER', 'MANAGER')
    deleteCategory(@Param('id') id: string) { return this.foundationService.deleteCategory(id); }

    // Brands
    @Get('brands')
    getBrands() { return this.foundationService.getBrands(); }

    @Post('brands')
    @Roles('OWNER', 'MANAGER')
    createBrand(@Body() body: { name: string }) { return this.foundationService.createBrand(body); }

    @Delete('brands/:id')
    @Roles('OWNER', 'MANAGER')
    deleteBrand(@Param('id') id: string) { return this.foundationService.deleteBrand(id); }

    // Units
    @Get('units')
    getUnits() { return this.foundationService.getUnits(); }

    @Post('units')
    @Roles('OWNER', 'MANAGER')
    createUnit(@Body() body: { name: string }) { return this.foundationService.createUnit(body); }

    @Delete('units/:id')
    @Roles('OWNER', 'MANAGER')
    deleteUnit(@Param('id') id: string) { return this.foundationService.deleteUnit(id); }

    // Shops & Branches
    @Get('shops')
    getShops() { return this.foundationService.getShops(); }

    @Post('shops')
    @Roles('OWNER')
    createShop(@Body() body: { name: string; ownerId: string }) { return this.foundationService.createShop(body); }

    @Get('branches')
    getBranches() { return this.foundationService.getBranches(); }

    @Post('branches')
    @Roles('OWNER')
    createBranch(@Body() body: { name: string; shopId: string }) { return this.foundationService.createBranch(body); }

    // Users Management
    @Get('users')
    @Roles('OWNER', 'MANAGER')
    getUsers() { return this.foundationService.getUsers(); }

    @Patch('users/:id/role')
    @Roles('OWNER')
    updateUserRole(@Param('id') id: string, @Body() body: { role: Role }) {
        return this.foundationService.updateUserRole(id, body.role);
    }
}
