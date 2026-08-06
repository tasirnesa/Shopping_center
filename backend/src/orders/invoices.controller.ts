import { Controller, Get, Param, Res, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
    constructor(private readonly prisma: PrismaService) { }

    @Get(':id')
    @Roles(Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER)
    async findOne(@Req() req: any, @Param('id') id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: { lines: true, salesOrder: true },
        });
        if (!invoice) throw new NotFoundException();
        if (invoice.organizationId !== req.user.organizationId) throw new ForbiddenException();
        return invoice;
    }

    @Get(':id/pdf')
    @Roles(Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER)
    async downloadPdf(@Req() req: any, @Param('id') id: string, @Res() res: any) {
        const invoice = await this.findOne(req, id);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(`%PDF-1.4\nInvoice ${invoice.invoiceNumber}`);
    }
}
