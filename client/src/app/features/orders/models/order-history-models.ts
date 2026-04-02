export interface OrderHistoryResponse {
  results: number;
  orders: Order[];
}

export interface Order {
  shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zip: string;
  };
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  trackingHistory: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  product: {
      _id: string;
      name: string;
      price: number;
      id: string;
  };
  quantity: number;
  price: number;
}