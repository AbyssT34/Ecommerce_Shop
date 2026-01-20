import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  ingredients: {
    ingredient_id: number;
    ingredient_name: string;
    quantity?: string;
  }[];

  @IsArray()
  steps: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  prepTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cookTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
