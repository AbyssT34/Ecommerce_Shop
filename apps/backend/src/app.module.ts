import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth_Module';
import { ProductsModule } from './products/products_Module';
import { CartModule } from './cart/cart_Module';
import { OrdersModule } from './orders/orders_Module';
import { RecipesModule } from './recipes/recipes_Module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    DatabaseModule,

    // Feature modules
    AuthModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    RecipesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
