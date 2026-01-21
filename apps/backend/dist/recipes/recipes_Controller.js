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
exports.RecipesController = void 0;
const common_1 = require("@nestjs/common");
const recipes_Service_1 = require("./recipes_Service");
const create_Recipe_dto_1 = require("./dto/create_Recipe.dto");
const jwt_Auth_guard_1 = require("../auth/guards/jwt_Auth.guard");
const admin_Guard_guard_1 = require("../auth/guards/admin_Guard.guard");
let RecipesController = class RecipesController {
    constructor(recipesService) {
        this.recipesService = recipesService;
    }
    create(createRecipeDto) {
        return this.recipesService.create(createRecipeDto);
    }
    findAll() {
        return this.recipesService.findAll();
    }
    getAvailableRecipes() {
        return this.recipesService.getAvailableRecipes();
    }
    suggestRecipesFromCart(body) {
        return this.recipesService.suggestRecipesFromCart(body.productIds);
    }
    getRecipeWithProducts(id) {
        return this.recipesService.getRecipeWithProducts(+id);
    }
    findOne(id) {
        return this.recipesService.findOne(+id);
    }
    update(id, updateRecipeDto) {
        return this.recipesService.update(+id, updateRecipeDto);
    }
    remove(id) {
        return this.recipesService.remove(+id);
    }
};
exports.RecipesController = RecipesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_Auth_guard_1.JwtAuthGuard, admin_Guard_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_Recipe_dto_1.CreateRecipeDto]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "getAvailableRecipes", null);
__decorate([
    (0, common_1.Post)('suggest-from-cart'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "suggestRecipesFromCart", null);
__decorate([
    (0, common_1.Get)(':id/with-products'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "getRecipeWithProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_Auth_guard_1.JwtAuthGuard, admin_Guard_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_Recipe_dto_1.CreateRecipeDto]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_Auth_guard_1.JwtAuthGuard, admin_Guard_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecipesController.prototype, "remove", null);
exports.RecipesController = RecipesController = __decorate([
    (0, common_1.Controller)('recipes'),
    __metadata("design:paramtypes", [recipes_Service_1.RecipesService])
], RecipesController);
//# sourceMappingURL=recipes_Controller.js.map