// Cart types
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    imageUrl?: string;
    category?: {
      id: number;
      name: string;
    };
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  summary: {
    totalItems: number;
    totalPrice: string;
  };
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}
