import { CreateOrderLineDto } from './create-order.dto';
export declare class UpdateOrderDto {
    customerName?: string;
    tin?: string;
    deliveryAddress?: string;
    customerPhone?: string;
    branchId?: string;
    lines?: CreateOrderLineDto[];
}
