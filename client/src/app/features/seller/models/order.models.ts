export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface TrackingHistory {
  status: OrderStatus;
  comment: string;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'cash_on_delivery' | 'credit_card';
  trackingHistory: TrackingHistory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListResponse {
  results: number;
  orders: Order[];
}

export interface OrderDetailResponse {
  order: Order;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface UpdateOrderStatusResponse {
  order: Order;
}
