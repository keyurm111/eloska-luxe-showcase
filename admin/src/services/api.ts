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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5004/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


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

// Auth API
export const authApi = {
  login: (email: string, password: string): Promise<ApiResponse<{ token: string; admin: any }>> =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  logout: (): Promise<ApiResponse<void>> =>
    api.post('/auth/logout').then(res => res.data),

  verifyToken: (): Promise<ApiResponse<any>> =>
    api.get('/auth/verify').then(res => res.data),
};

export default api;
