"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_Service_1 = require("./orders_Service");
const orders_Controller_1 = require("./orders_Controller");
const order_Entity_1 = require("./entities/order_Entity");
const order_Item_Entity_1 = require("./entities/order_Item_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
const cart_Module_1 = require("../cart/cart_Module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([order_Entity_1.Order, order_Item_Entity_1.OrderItem, product_Entity_1.Product]),
            cart_Module_1.CartModule,
        ],
        controllers: [orders_Controller_1.OrdersController],
        providers: [orders_Service_1.OrdersService],
        exports: [orders_Service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders_Module.js.map