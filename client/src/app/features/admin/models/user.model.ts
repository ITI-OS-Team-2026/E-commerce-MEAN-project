// Exact shape from backend API response
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // Only in requests, not in responses
  role: 'customer' | 'seller' | 'admin';
  isVerified: boolean;
  verificationToken?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  wishlist?: string[]; // Product IDs
  storeName?: string; // For sellers
  isApproved: boolean; // For sellers
  isActive: boolean;
  isApproving?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// // Request body for updating user
// export interface UpdateUserRequest {
//   name?: string;
//   email?: string;
//   phone?: string;
//   role?: 'customer' | 'seller' | 'admin';
//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     country?: string;
//   };
//   storeName?: string;
// }

export interface UsersResponse {
  results: number;
  users: User[];
}
