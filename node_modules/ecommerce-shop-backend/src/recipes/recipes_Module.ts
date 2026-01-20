import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesService } from './recipes_Service';
import { RecipesController } from './recipes_Controller';
import { Recipe } from './entities/recipe_Entity';
import { Product } from '../products/entities/product_Entity';
import { ProductIngredient } from '../products/entities/product_Ingredient_Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Product, ProductIngredient])],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
