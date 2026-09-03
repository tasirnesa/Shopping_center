export declare class CreateOrderLineDto {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
}
export declare class CreateOrderDto {
    customerName: string;
    tin: string;
    deliveryAddress: string;
    customerPhone?: string;
    branchId: string;
    customerId?: string;
    paymentMethod: string;
    paymentTerm?: string;
    chequeNumber?: string;
    creditDueDate?: Date;
    lines: CreateOrderLineDto[];
}
