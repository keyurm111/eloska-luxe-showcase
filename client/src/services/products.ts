import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  collection: 'Mirror Collection' | 'Scarfs' | 'Bag Fabric';
  category: string;
  subcategory?: string;
  productCode?: string;
  minimumQuantity: number;
  images: string[];
  features: string[];
  specifications?: {
    size?: string;
    quantity?: string;
    finish?: string;
    material?: string;
    color?: string;
    weight?: string;
    dimensions?: string;
  };
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  formattedPrice?: string;
  discountPercentage?: number;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: string[];
    subcategories: string[];
  };
}

export interface OrganizedCategories {
  'Mirror Collection': {
    categories: Array<{
      name: string;
      subcategories: string[];
    }>;
  };
  'Scarfs': {
    categories: Array<{
      name: string;
      subcategories: string[];
    }>;
  };
  'Bag Fabric': {
    categories: Array<{
      name: string;
      subcategories: string[];
    }>;
  };
}

export interface OrganizedCategoriesResponse {
  success: boolean;
  data: OrganizedCategories;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  collection?: string;
  category?: string;
  subcategory?: string;
  status?: 'active' | 'inactive' | 'draft';
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Get all products with optional filters
export const getProducts = async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const response = await axios.get(`${API_BASE_URL}/products?${params}`);
  return response.data;
};

// Get single product by ID
export const getProduct = async (id: string): Promise<{ success: boolean; data: Product }> => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

// Get product categories (legacy)
export const getCategories = async (): Promise<CategoriesResponse> => {
  const response = await axios.get(`${API_BASE_URL}/products/categories`);
  return response.data;
};

// Get organized categories by collection
export const getOrganizedCategories = async (): Promise<OrganizedCategoriesResponse> => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

// Get collections
export const getCollections = async (): Promise<{ success: boolean; data: string[] }> => {
  const response = await axios.get(`${API_BASE_URL}/categories/collections`);
  return response.data;
};

// Get categories by collection
export const getCategoriesByCollection = async (collection: string): Promise<{ success: boolean; data: { [key: string]: string[] } }> => {
  const response = await axios.get(`${API_BASE_URL}/categories/${collection}`);
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 8): Promise<ProductsResponse> => {
  return getProducts({ featured: true, limit, status: 'active' });
};

// Get products by category
export const getProductsByCategory = async (category: string, limit: number = 12): Promise<ProductsResponse> => {
  return getProducts({ category, limit, status: 'active' });
};

// Search products
export const searchProducts = async (query: string, limit: number = 12): Promise<ProductsResponse> => {
  return getProducts({ search: query, limit, status: 'active' });
};
