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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_Entity_1 = require("./entities/product_Entity");
const category_Entity_1 = require("./entities/category_Entity");
const ingredient_Entity_1 = require("./entities/ingredient_Entity");
const product_Ingredient_Entity_1 = require("./entities/product_Ingredient_Entity");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository, ingredientsRepository, productIngredientsRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.ingredientsRepository = ingredientsRepository;
        this.productIngredientsRepository = productIngredientsRepository;
    }
    async create(createProductDto) {
        const { name, sku, description, price, stockQuantity, categoryId, imageUrl, ingredientIds, } = createProductDto;
        const product = this.productsRepository.create({
            name,
            sku,
            description,
            price,
            stockQuantity,
            imageUrl,
            category: categoryId ? { id: categoryId } : null,
        });
        await this.productsRepository.save(product);
        if (ingredientIds && ingredientIds.length > 0) {
            const productIngredients = ingredientIds.map((ingredientId, index) => {
                return this.productIngredientsRepository.create({
                    productId: product.id,
                    ingredientId,
                    isPrimary: index === 0,
                    priority: ingredientIds.length - index,
                });
            });
            await this.productIngredientsRepository.save(productIngredients);
        }
        return this.findOne(product.id);
    }
    async findAll() {
        return await this.productsRepository.find({
            relations: ['category', 'productIngredients', 'productIngredients.ingredient'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category', 'productIngredients', 'productIngredients.ingredient'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findByCategory(categoryId) {
        return await this.productsRepository.find({
            where: { category: { id: categoryId } },
            relations: ['category', 'productIngredients', 'productIngredients.ingredient'],
        });
    }
    async findInStock() {
        return await this.productsRepository
            .createQueryBuilder('product')
            .where('product.stock_quantity > 0')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.productIngredients', 'productIngredients')
            .leftJoinAndSelect('productIngredients.ingredient', 'ingredient')
            .orderBy('product.created_at', 'DESC')
            .getMany();
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        const { ingredientIds, categoryId, ...updateData } = updateProductDto;
        Object.assign(product, updateData);
        if (categoryId !== undefined) {
            product.category = categoryId ? { id: categoryId } : null;
        }
        await this.productsRepository.save(product);
        if (ingredientIds !== undefined) {
            await this.productIngredientsRepository.delete({ productId: id });
            if (ingredientIds.length > 0) {
                const productIngredients = ingredientIds.map((ingredientId, index) => {
                    return this.productIngredientsRepository.create({
                        productId: id,
                        ingredientId,
                        isPrimary: index === 0,
                        priority: ingredientIds.length - index,
                    });
                });
                await this.productIngredientsRepository.save(productIngredients);
            }
        }
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepository.remove(product);
        return { message: 'Product deleted successfully' };
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        product.stockQuantity = quantity;
        return await this.productsRepository.save(product);
    }
    async decrementStock(id, quantity) {
        const product = await this.findOne(id);
        if (product.stockQuantity < quantity) {
            throw new common_1.NotFoundException(`Insufficient stock for product ${product.name}`);
        }
        product.stockQuantity -= quantity;
        return await this.productsRepository.save(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_Entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_Entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(ingredient_Entity_1.Ingredient)),
    __param(3, (0, typeorm_1.InjectRepository)(product_Ingredient_Entity_1.ProductIngredient)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products_Service.js.map