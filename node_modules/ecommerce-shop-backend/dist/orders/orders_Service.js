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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_Entity_1 = require("./entities/order_Entity");
const order_Item_Entity_1 = require("./entities/order_Item_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
const cart_Service_1 = require("../cart/cart_Service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, productsRepository, cartService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.productsRepository = productsRepository;
        this.cartService = cartService;
    }
    async create(userId, createOrderDto) {
        const { items, shippingAddress, phoneNumber, notes } = createOrderDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await this.productsRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            if (product.stockQuantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
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
        const order = this.ordersRepository.create({
            userId,
            shippingAddress,
            phoneNumber,
            notes,
            totalAmount,
            status: 'pending',
        });
        await this.ordersRepository.save(order);
        const savedOrderItems = orderItems.map((item) => this.orderItemsRepository.create({
            ...item,
            orderId: order.id,
        }));
        await this.orderItemsRepository.save(savedOrderItems);
        await this.cartService.clearCart(userId);
        return this.findOne(order.id);
    }
    async findAll() {
        return await this.ordersRepository.find({
            relations: ['user', 'orderItems', 'orderItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'orderItems', 'orderItems.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findByUser(userId) {
        return await this.ordersRepository.find({
            where: { userId },
            relations: ['orderItems', 'orderItems.product'],
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(id, adminId, updateStatusDto) {
        const order = await this.findOne(id);
        const { status, adminNotes } = updateStatusDto;
        const previousStatus = order.status;
        order.status = status;
        if (adminNotes) {
            order.adminNotes = adminNotes;
        }
        if (status === 'approved' && previousStatus === 'pending') {
            for (const item of order.orderItems) {
                const product = await this.productsRepository.findOne({
                    where: { id: item.productId },
                });
                if (product) {
                    if (product.stockQuantity < item.quantity) {
                        throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`);
                    }
                    product.stockQuantity -= item.quantity;
                    await this.productsRepository.save(product);
                }
            }
            order.approvedAt = new Date();
            order.approvedBy = adminId;
        }
        if (status === 'rejected' && previousStatus === 'approved') {
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
    async cancelOrder(id, userId) {
        const order = await this.findOne(id);
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own orders');
        }
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_Entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_Item_Entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_Entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cart_Service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders_Service.js.map