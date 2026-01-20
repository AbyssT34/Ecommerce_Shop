import { User } from '../../users/entities/user_Entity';
import { Product } from '../../products/entities/product_Entity';
export declare class CartItem {
    id: number;
    userId: number;
    productId: number;
    user: User;
    product: Product;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
