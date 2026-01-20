import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product_Entity';
import { Category } from './entities/category_Entity';
import { Ingredient } from './entities/ingredient_Entity';
import { ProductIngredient } from './entities/product_Ingredient_Entity';
import { CreateProductDto } from './dto/create_Product.dto';
import { UpdateProductDto } from './dto/update_Product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
    @InjectRepository(ProductIngredient)
    private productIngredientsRepository: Repository<ProductIngredient>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const {
      name,
      sku,
      description,
      price,
      stockQuantity,
      categoryId,
      imageUrl,
      ingredientIds,
    } = createProductDto;

    // Create product
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

    // Associate ingredients if provided
    if (ingredientIds && ingredientIds.length > 0) {
      const productIngredients = ingredientIds.map((ingredientId, index) => {
        return this.productIngredientsRepository.create({
          productId: product.id,
          ingredientId,
          isPrimary: index === 0, // First ingredient is primary
          priority: ingredientIds.length - index, // Higher priority for earlier ingredients
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

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'productIngredients', 'productIngredients.ingredient'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: number) {
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    const { ingredientIds, categoryId, ...updateData } = updateProductDto;

    // Update basic product info
    Object.assign(product, updateData);

    if (categoryId !== undefined) {
      product.category = categoryId ? { id: categoryId } as Category : null;
    }

    await this.productsRepository.save(product);

    // Update ingredients if provided
    if (ingredientIds !== undefined) {
      // Remove existing associations
      await this.productIngredientsRepository.delete({ productId: id });

      // Add new associations
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

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async updateStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    product.stockQuantity = quantity;
    return await this.productsRepository.save(product);
  }

  async decrementStock(id: number, quantity: number) {
    const product = await this.findOne(id);

    if (product.stockQuantity < quantity) {
      throw new NotFoundException(`Insufficient stock for product ${product.name}`);
    }

    product.stockQuantity -= quantity;
    return await this.productsRepository.save(product);
  }
}
