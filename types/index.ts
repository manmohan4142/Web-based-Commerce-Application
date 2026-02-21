// Core domain types for the e-commerce app

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role?: 'user' | 'admin';
}

export interface Order {
  _id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Filter/sort types for shop page
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export interface ShopFilters {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: SortOption;
}
