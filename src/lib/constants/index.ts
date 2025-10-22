import { ProductType, ProductStatus, UserType, UserStatus } from "../../types";

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  TIMEOUT: 30000,
} as const;

// Currency Configuration
export const CURRENCY = {
  CODE: "VND",
  SYMBOL: "₫",
  LOCALE: "vi-VN",
  DECIMAL_PLACES: 0,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: ["10", "20", "50", "100"],
} as const;

// Product Types
export const PRODUCT_TYPES = [
  { value: ProductType.IPHONE, label: "iPhone" },
  { value: ProductType.IPAD, label: "iPad" },
  { value: ProductType.IMAC, label: "iMac" },
  { value: ProductType.MACBOOK, label: "MacBook" },
  { value: ProductType.WATCH, label: "Watch" },
  { value: ProductType.AIRPODS, label: "AirPods" },
  { value: ProductType.ACCESSORIES, label: "Accessories" },
] as const;

// Product Status
export const PRODUCT_STATUSES = [
  { value: ProductStatus.ACTIVE, label: "Active", color: "green" },
  { value: ProductStatus.INACTIVE, label: "Inactive", color: "red" },
  { value: ProductStatus.DRAFT, label: "Draft", color: "orange" },
] as const;

// Attribute Categories
export const ATTRIBUTE_CATEGORIES = [
  { value: "display", label: "Display" },
  { value: "performance", label: "Performance" },
  { value: "camera", label: "Camera" },
  { value: "storage", label: "Storage" },
  { value: "battery", label: "Battery" },
  { value: "connectivity", label: "Connectivity" },
  { value: "design", label: "Design" },
  { value: "audio", label: "Audio" },
  { value: "sensors", label: "Sensors" },
  { value: "software", label: "Software" },
  { value: "accessories", label: "Accessories" },
  { value: "warranty", label: "Warranty" },
] as const;

// Guarantee/Warranty Attributes
export const GUARANTEE_ATTRIBUTES = [
  {
    name: "hardware_warranty",
    category: "warranty",
    label: "Bảo hành phần cứng",
    defaultValue: "9",
    unit: "months",
    description: {
      en: "Hardware warranty period",
      vi: "Thời gian bảo hành phần cứng",
    },
  },
  {
    name: "exchange_policy",
    category: "warranty",
    label: "1-to-1 Exchange",
    defaultValue: "46",
    unit: "days",
    description: {
      en: "1-to-1 exchange period for defects",
      vi: "Thời gian đổi 1-1 khi có lỗi",
    },
  },
  {
    name: "buyback_rate",
    category: "warranty",
    label: "Thu lại",
    defaultValue: "95",
    unit: "%",
    description: {
      en: "Buyback rate when no replacement available",
      vi: "Tỷ lệ thu lại khi không có máy đổi",
    },
  },
  {
    name: "battery_health",
    category: "quality",
    label: "Pin cao",
    defaultValue: "91",
    unit: "%",
    description: "Độ khỏe pin tối thiểu",
  },
  {
    name: "free_delivery",
    category: "service",
    label: "Giao hàng miễn phí",
    defaultValue: "Ho Chi Minh City",
    unit: "",
    description: "Khu vực giao hàng miễn phí",
  },
  {
    name: "origin_guarantee",
    category: "quality",
    label: "Nguồn gốc rõ ràng",
    defaultValue: "Yes",
    unit: "",
    description: "Cam kết nguồn gốc sản phẩm",
  },
  {
    name: "quality_check",
    category: "quality",
    label: "Kiểm tra chất lượng",
    defaultValue: "Thoroughly inspected",
    unit: "",
    description: "Cam kết kiểm tra chất lượng kỹ lưỡng",
  },
  {
    name: "no_hidden_fees",
    category: "service",
    label: "Không phí ẩn",
    defaultValue: "Transparent pricing",
    unit: "",
    description: "Cam kết bán đúng giá - Không phí ẩn",
  },
] as const;

// User Types
export const USER_TYPES = [
  { value: UserType.CUSTOMER, label: "Customer" },
  { value: UserType.ADMIN, label: "Admin" },
] as const;

// User Status
export const USER_STATUSES = [
  { value: UserStatus.ACTIVE, label: "Active", color: "green" },
  { value: UserStatus.INACTIVE, label: "Inactive", color: "red" },
  { value: UserStatus.SUSPENDED, label: "Suspended", color: "orange" },
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "name", label: "Name" },
  { value: "basePrice", label: "Price" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
} as const;

// Routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
  PRODUCTS: "/products",
  PRODUCTS_CREATE: "/products/create",
  PRODUCTS_EDIT: "/products/:id/edit",
  BRANDS: "/brands",
  BRANDS_CREATE: "/brands/create",
  BRANDS_EDIT: "/brands/:id/edit",
  CATEGORIES: "/categories",
  CATEGORIES_CREATE: "/categories/create",
  CATEGORIES_EDIT: "/categories/:id/edit",
  ORDERS: "/orders",
  ORDERS_DETAIL: "/orders/:id",
  USERS: "/users",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    CREATE: "Created successfully",
    UPDATE: "Updated successfully",
    DELETE: "Deleted successfully",
    SAVE: "Saved successfully",
  },
  ERROR: {
    LOGIN_FAILED: "Login failed",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    SERVER_ERROR: "Server error occurred",
    NETWORK_ERROR: "Network error occurred",
    VALIDATION_ERROR: "Validation error",
  },
  CONFIRM: {
    DELETE: "Are you sure you want to delete this item?",
    BULK_DELETE: "Are you sure you want to delete selected items?",
    LOGOUT: "Are you sure you want to logout?",
  },
} as const;

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
  SHOW_TOTAL: (total: number, range: [number, number]) =>
    `${range[0]}-${range[1]} of ${total} items`,
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9][\d]{0,15}$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// Order-related enums and constants
export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  MOMO = "momo",
  ZALOPAY = "zalopay",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export const PAYMENT_METHODS = [
  { value: PaymentMethod.CASH, label: "orders.paymentMethods.cash" },
  {
    value: PaymentMethod.BANK_TRANSFER,
    label: "orders.paymentMethods.bank_transfer",
  },
  {
    value: PaymentMethod.CREDIT_CARD,
    label: "orders.paymentMethods.credit_card",
  },
  { value: PaymentMethod.MOMO, label: "orders.paymentMethods.momo" },
  { value: PaymentMethod.ZALOPAY, label: "orders.paymentMethods.zalopay" },
] as const;

export const ORDER_STATUSES = [
  {
    value: OrderStatus.PENDING,
    label: "orders.status.pending",
    color: "orange",
  },
  {
    value: OrderStatus.CONFIRMED,
    label: "orders.status.confirmed",
    color: "blue",
  },
  {
    value: OrderStatus.PROCESSING,
    label: "orders.status.processing",
    color: "purple",
  },
  { value: OrderStatus.SHIPPED, label: "orders.status.shipped", color: "cyan" },
  {
    value: OrderStatus.DELIVERED,
    label: "orders.status.delivered",
    color: "green",
  },
  {
    value: OrderStatus.CANCELLED,
    label: "orders.status.cancelled",
    color: "red",
  },
] as const;

export const PAYMENT_STATUSES = [
  {
    value: PaymentStatus.PENDING,
    label: "orders.paymentStatus.pending",
    color: "orange",
  },
  {
    value: PaymentStatus.PAID,
    label: "orders.paymentStatus.paid",
    color: "green",
  },
  {
    value: PaymentStatus.FAILED,
    label: "orders.paymentStatus.failed",
    color: "red",
  },
  {
    value: PaymentStatus.REFUNDED,
    label: "orders.paymentStatus.refunded",
    color: "blue",
  },
] as const;
