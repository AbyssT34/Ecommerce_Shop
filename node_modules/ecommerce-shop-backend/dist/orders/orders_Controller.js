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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_Service_1 = require("./orders_Service");
const create_Order_dto_1 = require("./dto/create_Order.dto");
const update_OrderStatus_dto_1 = require("./dto/update_OrderStatus.dto");
const jwt_Auth_guard_1 = require("../auth/guards/jwt_Auth.guard");
const admin_Guard_guard_1 = require("../auth/guards/admin_Guard.guard");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(req, createOrderDto) {
        return this.ordersService.create(req.user.id, createOrderDto);
    }
    findAll(req) {
        if (req.user.role === 'admin') {
            return this.ordersService.findAll();
        }
        return this.ordersService.findByUser(req.user.id);
    }
    getStats() {
        return this.ordersService.getOrderStats();
    }
    findOne(id) {
        return this.ordersService.findOne(+id);
    }
    updateStatus(req, id, updateStatusDto) {
        return this.ordersService.updateStatus(+id, req.user.id, updateStatusDto);
    }
    cancelOrder(req, id) {
        return this.ordersService.cancelOrder(+id, req.user.id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_Order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(admin_Guard_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(admin_Guard_guard_1.AdminGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_OrderStatus_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "cancelOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(jwt_Auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [orders_Service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders_Controller.js.map