import { User } from '../../users/entities/user_Entity';
import { OrderItem } from './order_Item_Entity';
export declare class Order {
    id: number;
    userId: number;
    user: User;
    orderItems: OrderItem[];
    status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'rejected' | 'cancelled';
    totalAmount: number;
    shippingAddress: string;
    phoneNumber: string;
    notes: string;
    adminNotes: string;
    approvedAt: Date;
    approvedBy: number;
    createdAt: Date;
    updatedAt: Date;
}
