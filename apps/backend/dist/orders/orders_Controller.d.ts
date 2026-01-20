import { OrdersService } from './orders_Service';
import { CreateOrderDto } from './dto/create_Order.dto';
import { UpdateOrderStatusDto } from './dto/update_OrderStatus.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<import("./entities/order_Entity").Order>;
    findAll(req: any): Promise<import("./entities/order_Entity").Order[]>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        approvedOrders: number;
        deliveredOrders: number;
        totalRevenue: any;
    }>;
    findOne(id: string): Promise<import("./entities/order_Entity").Order>;
    updateStatus(req: any, id: string, updateStatusDto: UpdateOrderStatusDto): Promise<import("./entities/order_Entity").Order>;
    cancelOrder(req: any, id: string): Promise<import("./entities/order_Entity").Order>;
}
