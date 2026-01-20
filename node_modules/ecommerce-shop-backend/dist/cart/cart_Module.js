"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_Service_1 = require("./cart_Service");
const cart_Controller_1 = require("./cart_Controller");
const cart_Item_Entity_1 = require("./entities/cart_Item_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cart_Item_Entity_1.CartItem, product_Entity_1.Product])],
        controllers: [cart_Controller_1.CartController],
        providers: [cart_Service_1.CartService],
        exports: [cart_Service_1.CartService],
    })
], CartModule);
//# sourceMappingURL=cart_Module.js.map