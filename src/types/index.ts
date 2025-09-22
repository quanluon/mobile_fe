// User Types
export const UserType = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface User {
  _id: string;
  cognitoId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  type: UserType;
  status: UserStatus;
  profileImage?: string;
  lastLoginAt?: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export const ProductStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];

export const ProductType = {
  IPHONE: 'iphone',
  IPAD: 'ipad',
  IMAC: 'imac',
  MACBOOK: 'macbook',
  WATCH: 'watch',
  AIRPODS: 'airpods',
  ACCESSORIES: 'accessories',
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

export interface ProductAttribute {
  name: string;
  value: string;
  unit?: string;
  category?: string;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  color: string;
  colorCode: string;
  storage?: string;
  size?: string;
  connectivity?: string;
  simType?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  attributes: ProductAttribute[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  brand: Brand;
  productType: ProductType;
  variants: ProductVariant[];
  basePrice: number;
  originalBasePrice?: number;
  images: string[];
  features: string[];
  attributes: ProductAttribute[];
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Brand Types
export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errorCode?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: UserType;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  user: User;
  tokens: AuthTokens;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  productType: ProductType;
  variants: Omit<ProductVariant, '_id' | 'createdAt' | 'updatedAt'>[];
  images: string[];
  features: string[];
  attributes: ProductAttribute[];
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface BrandFormData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

// Filter Types
export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  brand?: string;
  productType?: ProductType;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  search?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  userType?: UserType;
  status?: UserStatus;
  search?: string;
}

// Statistics Types
export interface ProductStats {
  overview: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    draftProducts: number;
    featuredProducts: number;
    newProducts: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
  };
  byType: Array<{
    _id: ProductType;
    count: number;
  }>;
  byCategory: Array<{
    _id: string;
    count: number;
  }>;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  key: string;
  publicUrl: string;
}

export interface UploadedFile {
  file: File;
  url: string;
  key: string;
  publicUrl: string;
}

// Order Types
export const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface OrderItem {
  _id?: string;
  product: Product;
  variant?:Partial<ProductVariant>;
  quantity: number;
  price: number;
  originalPrice?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name?: string;
    email?: string;
    phone: string;
    userId?: string;
  };
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    postalCode?: string;
  };
  notes?: string;
  paymentMethod?: string;
  totalAmount: number;
  originalTotalAmount?: number;
  discountAmount?: number;
  shippingFee?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerEmail?: string;
  customerPhone?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  pendingPaymentOrders: number;
}
