import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order_Entity';
import { OrderItem } from './entities/order_Item.entity';
import { Product } from '../products/entities/product_Entity';
import { CartService } from '../cart/cart_Service';
import { CreateOrderDto } from './dto/create_Order.dto';
import { UpdateOrderStatusDto } from './dto/update_OrderStatus.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private cartService: CartService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items, shippingAddress, phoneNumber, notes } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    let totalAmount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        );
      }

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
        productName: product.name,
        productSku: product.sku,
      });
    }

    // Create order
    const order = this.ordersRepository.create({
      userId,
      shippingAddress,
      phoneNumber,
      notes,
      totalAmount,
      status: 'pending',
    });

    await this.ordersRepository.save(order);

    // Create order items
    const savedOrderItems = orderItems.map((item) =>
      this.orderItemsRepository.create({
        ...item,
        orderId: order.id,
      }),
    );

    await this.orderItemsRepository.save(savedOrderItems);

    // Clear cart after order creation
    await this.cartService.clearCart(userId);

    return this.findOne(order.id);
  }

  async findAll() {
    return await this.ordersRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: number) {
    return await this.ordersRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, adminId: number, updateStatusDto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    const { status, adminNotes } = updateStatusDto;

    const previousStatus = order.status;
    order.status = status;

    if (adminNotes) {
      order.adminNotes = adminNotes;
    }

    // Handle stock changes based on status transitions
    if (status === 'approved' && previousStatus === 'pending') {
      // Deduct stock when order is approved
      for (const item of order.orderItems) {
        const product = await this.productsRepository.findOne({
          where: { id: item.productId },
        });

        if (product) {
          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
            );
          }
          product.stockQuantity -= item.quantity;
          await this.productsRepository.save(product);
        }
      }

      order.approvedAt = new Date();
      order.approvedBy = adminId;
    }

    if (status === 'rejected' && previousStatus === 'approved') {
      // Refund stock if order is rejected after approval
      for (const item of order.orderItems) {
        const product = await this.productsRepository.findOne({
          where: { id: item.productId },
        });

        if (product) {
          product.stockQuantity += item.quantity;
          await this.productsRepository.save(product);
        }
      }
    }

    await this.ordersRepository.save(order);
    return this.findOne(id);
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.findOne(id);

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = 'cancelled';
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }

  async getOrderStats() {
    const totalOrders = await this.ordersRepository.count();
    const pendingOrders = await this.ordersRepository.count({
      where: { status: 'pending' },
    });
    const approvedOrders = await this.ordersRepository.count({
      where: { status: 'approved' },
    });
    const deliveredOrders = await this.ordersRepository.count({
      where: { status: 'delivered' },
    });

    const revenueResult = await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total')
      .where('order.status IN (:...statuses)', {
        statuses: ['approved', 'processing', 'shipped', 'delivered'],
      })
      .getRawOne();

    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      deliveredOrders,
      totalRevenue: revenueResult?.total || 0,
    };
  }
}
