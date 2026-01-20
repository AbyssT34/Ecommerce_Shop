import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders_Service';
import { OrdersController } from './orders_Controller';
import { Order } from './entities/order_Entity';
import { OrderItem } from './entities/order_Item_Entity';
import { Product } from '../products/entities/product_Entity';
import { CartModule } from '../cart/cart_Module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
