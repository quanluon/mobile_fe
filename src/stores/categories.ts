import { create } from 'zustand';
import { categoriesApi } from '../lib/api/categories';
import type { Category } from '../types';

interface CategoriesState {
  categories: Category[];
  activeCategories: Category[];
  currentCategory: Category | null;
  filters: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

interface CategoriesActions {
  setCategories: (categories: Category[]) => void;
  setActiveCategories: (categories: Category[]) => void;
  setCurrentCategory: (category: Category | null) => void;
  setFilters: (filters: Partial<CategoriesState['filters']>) => void;
  setPagination: (pagination: Partial<CategoriesState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Category) => void;
  removeCategory: (id: string) => void;
  clearError: () => void;
  reset: () => void;
  fetchCategories: () => Promise<void>;
}

type CategoriesStore = CategoriesState & CategoriesActions;

const initialState: CategoriesState = {
  categories: [],
  activeCategories: [],
  currentCategory: null,
  filters: {
    page: 1,
    limit: 10,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  ...initialState,

  setCategories: (categories) => set({ categories }),
  
  setActiveCategories: (activeCategories) => set({ activeCategories }),
  
  setCurrentCategory: (currentCategory) => set({ currentCategory }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  addCategory: (category) => set((state) => ({
    categories: [category, ...state.categories],
    activeCategories: category.isActive ? [category, ...state.activeCategories] : state.activeCategories,
  })),
  
  updateCategory: (id, updatedCategory) => set((state) => ({
    categories: state.categories.map((category) =>
      category._id === id ? updatedCategory : category
    ),
    activeCategories: state.activeCategories.map((category) =>
      category._id === id ? updatedCategory : category
    ).filter((category) => category.isActive),
    currentCategory: state.currentCategory?._id === id ? updatedCategory : state.currentCategory,
  })),
  
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter((category) => category._id !== id),
    activeCategories: state.activeCategories.filter((category) => category._id !== id),
    currentCategory: state.currentCategory?._id === id ? null : state.currentCategory,
  })),
  
  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriesApi.getCategories();
      set({ 
        categories: response.data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false 
      });
    }
  }
}));
