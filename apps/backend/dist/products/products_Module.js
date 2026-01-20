"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const products_Service_1 = require("./products_Service");
const products_Controller_1 = require("./products_Controller");
const categories_Service_1 = require("./categories_Service");
const categories_Controller_1 = require("./categories_Controller");
const product_Entity_1 = require("./entities/product_Entity");
const category_Entity_1 = require("./entities/category_Entity");
const ingredient_Entity_1 = require("./entities/ingredient_Entity");
const product_Ingredient_Entity_1 = require("./entities/product_Ingredient_Entity");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_Entity_1.Product,
                category_Entity_1.Category,
                ingredient_Entity_1.Ingredient,
                product_Ingredient_Entity_1.ProductIngredient,
            ]),
        ],
        controllers: [products_Controller_1.ProductsController, categories_Controller_1.CategoriesController],
        providers: [products_Service_1.ProductsService, categories_Service_1.CategoriesService],
        exports: [products_Service_1.ProductsService, categories_Service_1.CategoriesService],
    })
], ProductsModule);
//# sourceMappingURL=products_Module.js.map