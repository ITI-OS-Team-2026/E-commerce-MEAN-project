export interface ProductCategory {
  _id: string;
  name: string;
}

export interface ProductSeller {
  _id: string;
  name: string;
  email?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory | string | null;
  images: string[];
  stock: number;
  seller?: ProductSeller | string;
  createdAt: string;
  updatedAt: string;
  isdeleted: string | null; // null = active, date string = soft deleted
}

export interface ProductsResponse {
  status: string;
  results: number;
  data: {
    products: Product[];
  };
}

export interface ProductDetailsResponse {
  status: string;
  data: Product;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
