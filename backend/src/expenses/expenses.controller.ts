import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentOrg } from '../auth/org.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @Roles('OWNER', 'MANAGER')
  findAll(
    @CurrentOrg() orgId: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.expensesService.findAll(orgId, branchId);
  }

  @Get('summary')
  @Roles('OWNER', 'MANAGER')
  summary(@CurrentOrg() orgId: string) {
    return this.expensesService.summary(orgId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  create(@CurrentOrg() orgId: string, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(orgId, dto);
  }

  @Delete(':id')
  @Roles('OWNER', 'MANAGER')
  remove(@CurrentOrg() orgId: string, @Param('id') id: string) {
    return this.expensesService.remove(orgId, id);
  }
}
