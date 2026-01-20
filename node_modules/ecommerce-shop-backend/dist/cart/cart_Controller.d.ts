import { CartService } from './cart_Service';
import { AddToCartDto } from './dto/add_ToCart.dto';
import { UpdateCartItemDto } from './dto/update_CartItem.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<import("./entities/cart_Item_Entity").CartItem>;
    getCart(req: any): Promise<{
        items: import("./entities/cart_Item_Entity").CartItem[];
        summary: {
            totalItems: number;
            totalPrice: string;
        };
    }>;
    updateCartItem(req: any, id: string, updateCartItemDto: UpdateCartItemDto): Promise<import("./entities/cart_Item_Entity").CartItem>;
    removeFromCart(req: any, id: string): Promise<{
        message: string;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
