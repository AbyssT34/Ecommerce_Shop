declare class OrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: string;
    phoneNumber: string;
    notes?: string;
}
export {};
