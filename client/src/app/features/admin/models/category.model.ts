// Exact shape from backend API response
export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Request body for create/update
export interface CreateCategoryRequest {
  name: string;
  slug: string;
}
