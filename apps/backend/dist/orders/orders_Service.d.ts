import { Repository } from 'typeorm';
import { Order } from './entities/order_Entity';
import { OrderItem } from './entities/order_Item_Entity';
import { Product } from '../products/entities/product_Entity';
import { CartService } from '../cart/cart_Service';
import { CreateOrderDto } from './dto/create_Order.dto';
import { UpdateOrderStatusDto } from './dto/update_OrderStatus.dto';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private productsRepository;
    private cartService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, productsRepository: Repository<Product>, cartService: CartService);
    create(userId: number, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    findByUser(userId: number): Promise<Order[]>;
    updateStatus(id: number, adminId: number, updateStatusDto: UpdateOrderStatusDto): Promise<Order>;
    cancelOrder(id: number, userId: number): Promise<Order>;
    getOrderStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        approvedOrders: number;
        deliveredOrders: number;
        totalRevenue: any;
    }>;
}
