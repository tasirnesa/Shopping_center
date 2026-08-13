import { CreateOrderLineDto } from './create-order.dto';
export declare class UpdateOrderDto {
    customerName?: string;
    tin?: string;
    deliveryAddress?: string;
    customerPhone?: string;
    branchId?: string;
    customerId?: string;
    paymentMethod?: string;
    paymentTerm?: string;
    chequeNumber?: string;
    creditDueDate?: Date;
    lines?: CreateOrderLineDto[];
}
