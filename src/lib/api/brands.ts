import type { Brand, BrandFormData } from "../../types";
import { api } from "./config";

export const brandsApi = {
  // Get all brands
  getBrands: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    return api.get<Brand[]>(`/admin/brands?${params.toString()}`);
  },

  // Get brand by ID
  getBrandById: async (id: string) => {
    return api.get<Brand>(`/admin/brands/${id}`).then(res=>res.data);
  },

  // Create brand
  createBrand: async (brandData: BrandFormData) => {
    return api.post<Brand>("/admin/brands", brandData);
  },

  // Update brand
  updateBrand: async (id: string, brandData: Partial<BrandFormData>) => {
    return api.put<Brand>(`/admin/brands/${id}`, brandData);
  },

  // Delete brand
  deleteBrand: async (id: string): Promise<void> => {
    await api.delete(`/admin/brands/${id}`);
  },
};
