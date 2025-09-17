import type { Category, CategoryFormData } from "../../types";
import { api } from "./config";

export const categoriesApi = {
  // Get all categories
  getCategories: async (search?: string) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    return api.get<Category[]>(`/admin/categories?${params.toString()}`);
  },

  // Get category by ID
  getCategoryById: async (id: string) => {
    return api.get<Category>(`/admin/categories/${id}`)
  },

  // Create category
  createCategory: async (categoryData: CategoryFormData) => {
    return api.post<Category>("/admin/categories", categoryData);
  },

  // Update category
  updateCategory: async (
    id: string,
    categoryData: Partial<CategoryFormData>
  ) => {
    return api.put<Category>(`/admin/categories/${id}`, categoryData);
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
