import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_Item_Entity';
import { Product } from '../products/entities/product_Entity';
import { AddToCartDto } from './dto/add_ToCart.dto';
export declare class CartService {
    private cartItemsRepository;
    private productsRepository;
    constructor(cartItemsRepository: Repository<CartItem>, productsRepository: Repository<Product>);
    addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CartItem>;
    getCart(userId: number): Promise<{
        items: CartItem[];
        summary: {
            totalItems: number;
            totalPrice: string;
        };
    }>;
    updateCartItem(userId: number, cartItemId: number, quantity: number): Promise<CartItem>;
    removeFromCart(userId: number, cartItemId: number): Promise<{
        message: string;
    }>;
    clearCart(userId: number): Promise<{
        message: string;
    }>;
    getCartItemsByUserId(userId: number): Promise<CartItem[]>;
}
