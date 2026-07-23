export declare class CreatePurchaseDetailDto {
    productId: string;
    quantity: number;
    cost: number;
}
export declare class CreatePurchaseDto {
    supplierId: string;
    branchId: string;
    details: CreatePurchaseDetailDto[];
}
