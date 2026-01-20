import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products_Service';
import { ProductsController } from './products_Controller';
import { CategoriesService } from './categories_Service';
import { CategoriesController } from './categories_Controller';
import { Product } from './entities/product_Entity';
import { Category } from './entities/category_Entity';
import { Ingredient } from './entities/ingredient_Entity';
import { ProductIngredient } from './entities/product_Ingredient_Entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Ingredient,
      ProductIngredient,
    ]),
  ],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService],
  exports: [ProductsService, CategoriesService],
})
export class ProductsModule {}
