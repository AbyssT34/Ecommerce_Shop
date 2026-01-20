"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const recipes_Service_1 = require("./recipes_Service");
const recipes_Controller_1 = require("./recipes_Controller");
const recipe_Entity_1 = require("./entities/recipe_Entity");
const product_Entity_1 = require("../products/entities/product_Entity");
const product_Ingredient_Entity_1 = require("../products/entities/product_Ingredient_Entity");
let RecipesModule = class RecipesModule {
};
exports.RecipesModule = RecipesModule;
exports.RecipesModule = RecipesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([recipe_Entity_1.Recipe, product_Entity_1.Product, product_Ingredient_Entity_1.ProductIngredient])],
        controllers: [recipes_Controller_1.RecipesController],
        providers: [recipes_Service_1.RecipesService],
        exports: [recipes_Service_1.RecipesService],
    })
], RecipesModule);
//# sourceMappingURL=recipes_Module.js.map