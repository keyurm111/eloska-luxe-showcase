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
  data: T[];
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

// Static collections structure matching the frontend
export const STATIC_COLLECTIONS = {
  'Mirror Collection': {
    categories: [
      { name: 'Regular Silver Mirrors', subcategories: ['Standard', 'Premium', 'Custom'] },
      { name: 'Artistic Mirrors', subcategories: ['Decorative', 'Vintage', 'Modern'] },
      { name: 'Acrylic Mirror', subcategories: ['Clear', 'Tinted', 'Safety'] },
      { name: 'Catalogues', subcategories: ['Product Catalog', 'Price List', 'Brochure'] },
      { name: 'Mirrors Sheet', subcategories: ['Thin', 'Medium', 'Thick'] }
    ]
  },
  'Scarfs': {
    categories: [
      { name: 'Bandhani Scarf', subcategories: ['Cotton', 'Silk', 'Georgette'] },
      { name: 'White Scarf', subcategories: ['Plain', 'Embroidered', 'Printed'] },
      { name: 'Baby Scarf', subcategories: ['Soft Cotton', 'Organic', 'Hypoallergenic'] }
    ]
  },
  'Bag Fabric': {
    categories: [
      { name: 'Digital Print Fabric', subcategories: ['Cotton', 'Polyester', 'Blend'] },
      { name: 'Water Resistant Antifree Fabric', subcategories: ['PVC', 'PU', 'Coated'] },
      { name: 'School Bag Fabric', subcategories: ['Canvas', 'Nylon', 'Leather'] }
    ]
  }
} as const;

export type CollectionName = keyof typeof STATIC_COLLECTIONS;
export type CategoryName = typeof STATIC_COLLECTIONS[CollectionName]['categories'][number]['name'];
export type SubcategoryName = typeof STATIC_COLLECTIONS[CollectionName]['categories'][number]['subcategories'][number];
