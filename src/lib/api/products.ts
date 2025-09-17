import type {
  Product,
  ProductFilters,
  ProductFormData,
  ProductStats,
  ProductVariant,
} from "../../types";
import { api } from "./config";

export const productsApi = {
  // Get all products
  getProducts: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.order) params.append("order", filters.order);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.brand) params.append("brand", filters.brand);
    if (filters?.productType) params.append("productType", filters.productType);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.isFeatured !== undefined)
      params.append("isFeatured", filters.isFeatured.toString());
    if (filters?.isNew !== undefined)
      params.append("isNew", filters.isNew.toString());
    if (filters?.search) params.append("search", filters.search);

    return api.get<Product[]>(`/admin/products?${params.toString()}`);
  },

  // Get product by ID
  getProductById: async (id: string) => {
    return api.get<Product>(`/admin/products/${id}`);
  },

  // Create product
  createProduct: async (productData: ProductFormData) => {
    return api.post<Product>("/admin/products", productData);
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<ProductFormData>) => {
    return api.put<Product>(`/admin/products/${id}`, productData);
  },

  // Delete product (soft delete)
  deleteProduct: async (id: string) => {
    await api.delete(`/admin/products/${id}`);
  },

  // Hard delete product
  hardDeleteProduct: async (id: string) => {
    await api.delete(`/admin/products/${id}/hard`);
  },

  // Bulk update products
  bulkUpdateProducts: async (
    productIds: string[],
    updateData: Partial<ProductFormData>
  ) => {
    return api.put("/admin/products/bulk-update", {
      productIds,
      updateData,
    });
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds: string[]) => {
    return api.put("/admin/products/bulk-delete", {
      productIds,
    });
  },

  // Get product statistics
  getProductStats: async () => {
    return api.get<ProductStats>("/admin/products/stats");
  },

  // Update product status
  updateProductStatus: async (id: string, status: string) => {
    return api.put<Product>(`/admin/products/${id}/status`, { status });
  },

  // Toggle product featured status
  toggleFeatured: async (id: string) => {
    return api.put<Product>(`/admin/products/${id}/toggle-featured`);
  },

  // Toggle product new status
  toggleNew: async (id: string) => {
    return api.put<Product>(`/admin/products/${id}/toggle-new`);
  },

  // Get product variants
  getProductVariants: async (id: string) => {
    return api.get<ProductVariant[]>(`/admin/products/${id}/variants`);
  },

  // Update product variants
  updateProductVariants: async (id: string, variants: ProductVariant[]) => {
    return api.put<Product>(`/admin/products/${id}/variants`, { variants });
  },
};
