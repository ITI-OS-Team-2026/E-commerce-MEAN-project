export interface Order {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
}