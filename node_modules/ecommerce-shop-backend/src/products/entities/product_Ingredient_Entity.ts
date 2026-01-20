import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product_Entity';
import { Ingredient } from './ingredient_Entity';

@Entity('product_ingredients')
export class ProductIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'ingredient_id' })
  ingredientId: number;

  @ManyToOne(() => Product, (product) => product.productIngredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'is_primary', default: true })
  isPrimary: boolean;

  @Column({ default: 0 })
  priority: number;
}
