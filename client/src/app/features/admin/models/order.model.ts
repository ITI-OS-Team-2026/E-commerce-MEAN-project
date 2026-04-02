// Order model based on API response
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  id: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  country: string;
  zip?: string;
}

export interface TrackingHistoryItem {
  status: string;
  comment: string;
  _id: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  trackingHistory: TrackingHistoryItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Response wrapper
export interface OrdersResponse {
  results: number;
  orders: Order[];
}
