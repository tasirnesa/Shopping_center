export class AdjustStockDto {
  productId!: string;
  branchId!: string;
  quantityChange!: number; // positive = add, negative = subtract
  reason!: string;
}
