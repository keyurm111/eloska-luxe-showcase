export interface ProductInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  productName: string;
  productCode: string;
  category: string;
  subcategory?: string;
  quantity: number;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface NormalInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface NewsletterEmail {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  source: 'website' | 'admin' | 'import';
  tags?: string[];
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface DashboardStats {
  totalProductInquiries: number;
  totalNormalInquiries: number;
  totalNewsletterSubscribers: number;
  pendingInquiries: number;
  completedInquiries: number;
  recentInquiries: ProductInquiry[];
}
