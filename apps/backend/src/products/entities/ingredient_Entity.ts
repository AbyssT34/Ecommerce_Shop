import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductIngredient } from './product_Ingredient_Entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => ProductIngredient, (pi) => pi.ingredient)
  productIngredients: ProductIngredient[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
