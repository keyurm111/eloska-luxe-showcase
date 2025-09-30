import axios from 'axios';
import { 
  ProductInquiry, 
  NormalInquiry, 
  NewsletterEmail, 
  ApiResponse, 
  PaginatedResponse, 
  FilterOptions, 
  SortOptions 
} from '@/types';

// Product interface for admin panel
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  collection: 'Mirror Collection' | 'Scarfs' | 'Bag Fabric';
  category: string;
  subcategory?: string;
  images: string[];
  features: string[];
  minimumQuantity: number;
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
}

// Category interfaces
export interface ProductCategory {
  _id: string;
  collection: 'Mirror Collection' | 'Scarfs' | 'Bag Fabric';
  category: string;
  subcategory?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (no authentication needed)
api.interceptors.request.use(
  (config) => {
    // No authentication headers needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No authentication error handling needed
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: (page = 1, limit = 12, filters?: any): Promise<ApiResponse<PaginatedResponse<Product>>> =>
    api.get('/products', {
      params: { page, limit, ...filters }
    }).then(res => res.data),

  getById: (id: string): Promise<ApiResponse<Product>> =>
    api.get(`/products/${id}`).then(res => res.data),

  create: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> =>
    api.post('/products', product).then(res => res.data),

  update: (id: string, product: Partial<Product>): Promise<ApiResponse<Product>> =>
    api.put(`/products/${id}`, product).then(res => res.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/products/${id}`).then(res => res.data),

  updateStatus: (id: string, status: 'active' | 'inactive' | 'draft'): Promise<ApiResponse<Product>> =>
    api.patch(`/products/${id}/status`, { status }).then(res => res.data),

  getCategories: (): Promise<ApiResponse<{ categories: string[]; subcategories: string[] }>> =>
    api.get('/products/categories').then(res => res.data),
};

// Categories API
export const categoriesApi = {
  getAll: (): Promise<ApiResponse<OrganizedCategories>> =>
    api.get('/categories').then(res => res.data),

  getCollections: (): Promise<ApiResponse<string[]>> =>
    api.get('/categories/collections').then(res => res.data),

  getByCollection: (collection: string): Promise<ApiResponse<{ [key: string]: string[] }>> =>
    api.get(`/categories/${collection}`).then(res => res.data),

  create: (category: Omit<ProductCategory, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProductCategory>> =>
    api.post('/categories', category).then(res => res.data),

  update: (id: string, category: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> =>
    api.put(`/categories/${id}`, category).then(res => res.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/categories/${id}`).then(res => res.data),

  getSubcategorySuggestions: (collection: string, category: string): Promise<ApiResponse<string[]>> =>
    api.get('/categories/subcategories/suggestions', {
      params: { collection, category }
    }).then(res => res.data),
};

// Product Inquiries API
export const productInquiryApi = {
  getAll: (page = 1, limit = 10, filters?: FilterOptions, sort?: SortOptions): Promise<ApiResponse<PaginatedResponse<ProductInquiry>>> =>
    api.get('/product-inquiries', {
      params: { page, limit, ...filters, ...sort }
    })
    .then(res => res.data),

  getById: (id: string): Promise<ApiResponse<ProductInquiry>> =>
    api.get(`/product-inquiries/${id}`)
    .then(res => res.data),

  updateStatus: (id: string, status: string, adminNotes?: string): Promise<ApiResponse<ProductInquiry>> =>
    api.patch(`/product-inquiries/${id}/status`, { status, adminNotes })
    .then(res => res.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/product-inquiries/${id}`)
    .then(res => res.data),

  export: (filters?: FilterOptions): Promise<Blob> =>
    api.get('/product-inquiries/export', {
      params: filters,
      responseType: 'blob'
    }).then(res => res.data),
};

// Normal Inquiries API
export const normalInquiryApi = {
  getAll: (page = 1, limit = 10, filters?: FilterOptions, sort?: SortOptions): Promise<ApiResponse<PaginatedResponse<NormalInquiry>>> =>
    api.get('/normal-inquiries', {
      params: { page, limit, ...filters, ...sort }
    }).then(res => res.data),

  getById: (id: string): Promise<ApiResponse<NormalInquiry>> =>
    api.get(`/normal-inquiries/${id}`).then(res => res.data),

  updateStatus: (id: string, status: string, adminNotes?: string): Promise<ApiResponse<NormalInquiry>> =>
    api.patch(`/normal-inquiries/${id}/status`, { status, adminNotes }).then(res => res.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/normal-inquiries/${id}`).then(res => res.data),

  export: (filters?: FilterOptions): Promise<Blob> =>
    api.get('/normal-inquiries/export', {
      params: filters,
      responseType: 'blob'
    }).then(res => res.data),
};

// Newsletter API
export const newsletterApi = {
  getAll: (page = 1, limit = 10, filters?: FilterOptions, sort?: SortOptions): Promise<ApiResponse<PaginatedResponse<NewsletterEmail>>> =>
    api.get('/newsletter', {
      params: { page, limit, ...filters, ...sort }
    }).then(res => res.data),

  getById: (id: string): Promise<ApiResponse<NewsletterEmail>> =>
    api.get(`/newsletter/${id}`).then(res => res.data),

  updateStatus: (id: string, status: string): Promise<ApiResponse<NewsletterEmail>> =>
    api.patch(`/newsletter/${id}/status`, { status }).then(res => res.data),

  delete: (id: string): Promise<ApiResponse<void>> =>
    api.delete(`/newsletter/${id}`).then(res => res.data),

  bulkUpdate: (ids: string[], status: string): Promise<ApiResponse<void>> =>
    api.patch('/newsletter/bulk-update', { ids, status }).then(res => res.data),

  export: (filters?: FilterOptions): Promise<Blob> =>
    api.get('/newsletter/export', {
      params: filters,
      responseType: 'blob'
    }).then(res => res.data),

  sendNewsletter: (subject: string, content: string, recipients: string[]): Promise<ApiResponse<void>> =>
    api.post('/newsletter/send', { subject, content, recipients }).then(res => res.data),
};

// Auth API removed - no authentication needed

export default api;
