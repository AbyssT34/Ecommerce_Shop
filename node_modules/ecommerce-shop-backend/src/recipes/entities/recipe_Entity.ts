import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json' })
  ingredients: {
    ingredient_id: number;
    ingredient_name: string;
    quantity?: string;
  }[];

  @Column({ type: 'json' })
  steps: string[];

  @Column({ name: 'prep_time', nullable: true })
  prepTime: number; // in minutes

  @Column({ name: 'cook_time', nullable: true })
  cookTime: number; // in minutes

  @Column({ default: 4 })
  servings: number;

  @Column({ nullable: true })
  difficulty: string; // 'Easy', 'Medium', 'Hard'

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
