import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category_Entity';
import { ProductIngredient } from './product_Ingredient_Entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => ProductIngredient, (pi) => pi.product)
  productIngredients: ProductIngredient[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
