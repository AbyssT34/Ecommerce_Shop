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
exports.ProductIngredient = void 0;
const typeorm_1 = require("typeorm");
const product_Entity_1 = require("./product_Entity");
const ingredient_Entity_1 = require("./ingredient_Entity");
let ProductIngredient = class ProductIngredient {
};
exports.ProductIngredient = ProductIngredient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ingredient_id' }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "ingredientId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_Entity_1.Product, (product) => product.productIngredients, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_Entity_1.Product)
], ProductIngredient.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ingredient_Entity_1.Ingredient, (ingredient) => ingredient.productIngredients, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'ingredient_id' }),
    __metadata("design:type", ingredient_Entity_1.Ingredient)
], ProductIngredient.prototype, "ingredient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_primary', default: true }),
    __metadata("design:type", Boolean)
], ProductIngredient.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductIngredient.prototype, "priority", void 0);
exports.ProductIngredient = ProductIngredient = __decorate([
    (0, typeorm_1.Entity)('product_ingredients')
], ProductIngredient);
//# sourceMappingURL=product_Ingredient.entity.js.map