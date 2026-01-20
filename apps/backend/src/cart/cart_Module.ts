import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart_Service';
import { CartController } from './cart_Controller';
import { CartItem } from './entities/cart_Item.entity';
import { Product } from '../products/entities/product_Entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
