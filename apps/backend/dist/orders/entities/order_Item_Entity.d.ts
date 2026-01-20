import { Order } from './order_Entity';
import { Product } from '../../products/entities/product_Entity';
export declare class OrderItem {
    id: number;
    orderId: number;
    productId: number;
    order: Order;
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    productName: string;
    productSku: string;
}
