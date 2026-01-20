import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_Item.entity';
import { Product } from '../products/entities/product_Entity';
import { AddToCartDto } from './dto/add_ToCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Verify product exists and has stock
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.stockQuantity < quantity) {
      throw new BadRequestException(`Insufficient stock. Available: ${product.stockQuantity}`);
    }

    // Check if item already in cart
    const existingCartItem = await this.cartItemsRepository.findOne({
      where: { userId, productId },
      relations: ['product'],
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;

      if (existingCartItem.quantity > product.stockQuantity) {
        throw new BadRequestException(`Insufficient stock. Available: ${product.stockQuantity}`);
      }

      return await this.cartItemsRepository.save(existingCartItem);
    }

    // Create new cart item
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

  async getCart(userId: number) {
    const cartItems = await this.cartItemsRepository.find({
      where: { userId },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' },
    });

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      items: cartItems,
      summary: {
        totalItems,
        totalPrice: totalPrice.toFixed(2),
      },
    };
  }

  async updateCartItem(userId: number, cartItemId: number, quantity: number) {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { id: cartItemId, userId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity > cartItem.product.stockQuantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${cartItem.product.stockQuantity}`,
      );
    }

    cartItem.quantity = quantity;
    return await this.cartItemsRepository.save(cartItem);
  }

  async removeFromCart(userId: number, cartItemId: number) {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemsRepository.remove(cartItem);
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    await this.cartItemsRepository.delete({ userId });
    return { message: 'Cart cleared successfully' };
  }

  async getCartItemsByUserId(userId: number) {
    return await this.cartItemsRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }
}
