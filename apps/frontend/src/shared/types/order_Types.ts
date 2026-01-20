// Order types
export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

export interface Order {
  id: number;
  userId: number;
  user?: {
    id: number;
    email: string;
    fullName?: string;
  };
  orderItems: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  adminNotes?: string;
  approvedAt?: string;
  approvedBy?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
  productSku: string;
}

export interface CreateOrderDto {
  items: {
    productId: number;
    quantity: number;
  }[];
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  adminNotes?: string;
}
