export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  price: number;
}

export interface CartBreakdown {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  itemsCount: number;
  breakdown: CartBreakdown[];
}

export interface CartResponse {
  status: string;
  data: Cart;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface UpdateQuantityPayload {
  quantity: number;
}
