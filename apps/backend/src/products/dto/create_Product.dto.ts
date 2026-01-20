import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  ingredientIds?: number[]; // Array of ingredient IDs to associate
}
