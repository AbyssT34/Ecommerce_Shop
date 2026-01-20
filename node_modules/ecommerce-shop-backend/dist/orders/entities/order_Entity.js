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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_Entity_1 = require("../../users/entities/user_Entity");
const order_Item_Entity_1 = require("./order_Item_Entity");
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_Entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_Entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_Item_Entity_1.OrderItem, (orderItem) => orderItem.order, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'processing', 'shipped', 'delivered', 'rejected', 'cancelled'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' }),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', name: 'shipping_address' }),
    __metadata("design:type", String)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number' }),
    __metadata("design:type", String)
], Order.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'admin_notes' }),
    __metadata("design:type", String)
], Order.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order_Entity.js.map