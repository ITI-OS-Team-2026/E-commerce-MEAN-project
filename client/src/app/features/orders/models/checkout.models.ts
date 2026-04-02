export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
}

export interface CheckoutPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash_on_delivery' | 'credit_card';
  paymentIntentId?: string;
}

export interface CheckoutResponse {
  status: string;
  data: {
    _id: string;
    user: string;
    items: any[];
    shippingAddress: ShippingAddress;
    totalAmount: number;
    status: string;
    paymentMethod: string;
  };
}
