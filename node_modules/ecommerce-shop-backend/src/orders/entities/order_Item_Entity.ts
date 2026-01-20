import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order_Entity';
import { Product } from '../../products/entities/product_Entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'product_name' })
  productName: string; // Snapshot in case product details change

  @Column({ name: 'product_sku' })
  productSku: string; // Snapshot
}
