import { Controller, Get, Param, Res, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
    constructor(private readonly prisma: PrismaService) { }

    @Get(':id')
    @Roles(Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER, Role.OWNER, Role.SALES_REP)
    async findOne(@Req() req: any, @Param('id') id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                lines: { include: { product: true } },
                salesOrder: { include: { salesRep: { select: { name: true, email: true } } } },
            },
        });
        if (!invoice) throw new NotFoundException();
        if (invoice.organizationId !== req.user.organizationId) throw new ForbiddenException();
        return invoice;
    }

    @Get(':id/print')
    @Roles(Role.INVOICE_MAKER, Role.STORE_MAN, Role.MANAGER, Role.OWNER, Role.SALES_REP)
    async printInvoice(@Req() req: any, @Param('id') id: string, @Res() res: any) {
        const invoice: any = await this.findOne(req, id);
        const order = invoice.salesOrder;

        const linesHtml = invoice.lines.map((l: any) => `
          <tr>
            <td>${l.product?.name ?? l.productId}</td>
            <td style="text-align:center">${l.quantity}</td>
            <td style="text-align:right">$${Number(l.unitPrice).toFixed(2)}</td>
            <td style="text-align:right">${l.discount ? '-$' + Number(l.discount).toFixed(2) : '—'}</td>
            <td style="text-align:right"><strong>$${Number(l.total).toFixed(2)}</strong></td>
          </tr>`).join('');

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1e293b; padding: 40px; max-width: 800px; margin: auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid #1e3c72; padding-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 900; color: #1e3c72; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 28px; font-weight: 900; color: #1e3c72; }
    .invoice-meta .number { font-size: 14px; color: #64748b; margin-top: 4px; }
    .section { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .box h3 { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 6px; }
    .box p { font-size: 13px; color: #334155; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead th { background: #1e3c72; color: white; padding: 10px 12px; text-align: left; font-size: 12px; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    tbody td { padding: 9px 12px; border-bottom: 1px solid #e2e8f0; }
    .totals { margin-left: auto; width: 280px; }
    .totals table { font-size: 13px; }
    .totals td { padding: 6px 12px; }
    .totals tr:last-child td { font-weight: 900; font-size: 16px; color: #1e3c72; border-top: 2px solid #1e3c72; padding-top: 10px; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; color: #94a3b8; font-size: 11px; text-align: center; }
    @media print { body { padding: 20px; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom:20px">
    <button onclick="window.print()" style="background:#1e3c72;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:14px;cursor:pointer">🖨 Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">TAX INVOICE</div>
      <p style="color:#64748b;margin-top:4px">${req.user.organization?.name ?? 'Organization'}</p>
    </div>
    <div class="invoice-meta">
      <h2>${invoice.invoiceNumber}</h2>
      <div class="number">Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>
      <div class="number">Order: #${order?.id?.substring(0, 8).toUpperCase()}</div>
    </div>
  </div>

  <div class="section">
    <div class="box">
      <h3>Bill To</h3>
      <p><strong>${order?.customerName}</strong></p>
      <p>TIN: ${order?.tin}</p>
      <p>${order?.deliveryAddress}</p>
      ${order?.customerPhone ? `<p>📞 ${order.customerPhone}</p>` : ''}
    </div>
    <div class="box">
      <h3>Invoice Details</h3>
      <p>Invoice #: <strong>${invoice.invoiceNumber}</strong></p>
      <p>Tax Rate: ${invoice.taxRate}%</p>
      <p>Prepared by: ${order?.salesRep?.name ?? order?.salesRep?.email ?? '—'}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Discount</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${linesHtml}</tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td style="text-align:right">$${Number(invoice.subtotal).toFixed(2)}</td></tr>
      <tr><td>Tax (${invoice.taxRate}%)</td><td style="text-align:right">$${Number(invoice.taxAmount).toFixed(2)}</td></tr>
      <tr><td>Grand Total</td><td style="text-align:right">$${Number(invoice.grandTotal).toFixed(2)}</td></tr>
    </table>
  </div>

  <div class="footer">
    This is a system-generated invoice. ${invoice.invoiceNumber} — ${new Date(invoice.createdAt).toLocaleString()}
  </div>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    }
}
