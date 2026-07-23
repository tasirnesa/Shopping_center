export class CreatePurchaseDetailDto {
    productId!: string;
    quantity!: number;
    cost!: number;
}

export class CreatePurchaseDto {
    supplierId!: string;
    branchId!: string;
    details!: CreatePurchaseDetailDto[];
}
