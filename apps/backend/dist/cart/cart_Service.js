"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_Item_Entity_1 = require("./entities/cart_Item_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
let CartService = class CartService {
    constructor(cartItemsRepository, productsRepository) {
        this.cartItemsRepository = cartItemsRepository;
        this.productsRepository = productsRepository;
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        if (product.stockQuantity < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.stockQuantity}`);
        }
        const existingCartItem = await this.cartItemsRepository.findOne({
            where: { userId, productId },
            relations: ['product'],
        });
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            if (existingCartItem.quantity > product.stockQuantity) {
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.stockQuantity}`);
            }
            return await this.cartItemsRepository.save(existingCartItem);
        }
        const cartItem = this.cartItemsRepository.create({
            userId,
            productId,
            quantity,
        });
        await this.cartItemsRepository.save(cartItem);
        return await this.cartItemsRepository.findOne({
            where: { id: cartItem.id },
            relations: ['product', 'product.category'],
        });
    }
    async getCart(userId) {
        const cartItems = await this.cartItemsRepository.find({
            where: { userId },
            relations: ['product', 'product.category'],
            order: { createdAt: 'DESC' },
        });
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
        return {
            items: cartItems,
            summary: {
                totalItems,
                totalPrice: totalPrice.toFixed(2),
            },
        };
    }
    async updateCartItem(userId, cartItemId, quantity) {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId, userId },
            relations: ['product'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (quantity > cartItem.product.stockQuantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${cartItem.product.stockQuantity}`);
        }
        cartItem.quantity = quantity;
        return await this.cartItemsRepository.save(cartItem);
    }
    async removeFromCart(userId, cartItemId) {
        const cartItem = await this.cartItemsRepository.findOne({
            where: { id: cartItemId, userId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.cartItemsRepository.remove(cartItem);
        return { message: 'Item removed from cart' };
    }
    async clearCart(userId) {
        await this.cartItemsRepository.delete({ userId });
        return { message: 'Cart cleared successfully' };
    }
    async getCartItemsByUserId(userId) {
        return await this.cartItemsRepository.find({
            where: { userId },
            relations: ['product'],
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_Item_Entity_1.CartItem)),
    __param(1, (0, typeorm_1.InjectRepository)(product_Entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
//# sourceMappingURL=cart_Service.js.map