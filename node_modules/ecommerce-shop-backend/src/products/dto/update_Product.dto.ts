import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create_Product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
