import { create } from 'zustand';
import { brandsApi } from '../lib/api/brands';
import type { Brand } from '../types';

interface BrandsState {
  brands: Brand[];
  activeBrands: Brand[];
  currentBrand: Brand | null;
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

interface BrandsActions {
  setBrands: (brands: Brand[]) => void;
  setActiveBrands: (brands: Brand[]) => void;
  setCurrentBrand: (brand: Brand | null) => void;
  setFilters: (filters: Partial<BrandsState['filters']>) => void;
  setPagination: (pagination: Partial<BrandsState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, brand: Brand) => void;
  removeBrand: (id: string) => void;
  clearError: () => void;
  reset: () => void;
  fetchBrands: () => Promise<void>;
}

type BrandsStore = BrandsState & BrandsActions;

const initialState: BrandsState = {
  brands: [],
  activeBrands: [],
  currentBrand: null,
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

export const useBrandsStore = create<BrandsStore>((set) => ({
  ...initialState,

  setBrands: (brands) => set({ brands }),
  
  setActiveBrands: (activeBrands) => set({ activeBrands }),
  
  setCurrentBrand: (currentBrand) => set({ currentBrand }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  addBrand: (brand) => set((state) => ({
    brands: [brand, ...state.brands],
    activeBrands: brand.isActive ? [brand, ...state.activeBrands] : state.activeBrands,
  })),
  
  updateBrand: (id, updatedBrand) => set((state) => ({
    brands: state.brands.map((brand) =>
      brand._id === id ? updatedBrand : brand
    ),
    activeBrands: state.activeBrands.map((brand) =>
      brand._id === id ? updatedBrand : brand
    ).filter((brand) => brand.isActive),
    currentBrand: state.currentBrand?._id === id ? updatedBrand : state.currentBrand,
  })),
  
  removeBrand: (id) => set((state) => ({
    brands: state.brands.filter((brand) => brand._id !== id),
    activeBrands: state.activeBrands.filter((brand) => brand._id !== id),
    currentBrand: state.currentBrand?._id === id ? null : state.currentBrand,
  })),
  
  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),

  fetchBrands: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await brandsApi.getBrands();
      set({ 
        brands: response.data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch brands',
        isLoading: false 
      });
    }
  }
  }));
