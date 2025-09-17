import { create } from 'zustand';
import type { Product, ProductFilters, ProductStats } from '../types';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  stats: ProductStats | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

interface ProductsActions {
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setStats: (stats: ProductStats) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setPagination: (pagination: Partial<ProductsState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  removeProduct: (id: string) => void;
  clearError: () => void;
  reset: () => void;
}

type ProductsStore = ProductsState & ProductsActions;

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  stats: null,
  filters: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
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

export const useProductsStore = create<ProductsStore>((set) => ({
  ...initialState,

  setProducts: (products) => set({ products }),
  
  setCurrentProduct: (currentProduct) => set({ currentProduct }),
  
  setStats: (stats) => set({ stats }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products],
  })),
  
  updateProduct: (id, updatedProduct) => set((state) => ({
    products: state.products.map((product) =>
      product._id === id ? updatedProduct : product
    ),
    currentProduct: state.currentProduct?._id === id ? updatedProduct : state.currentProduct,
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter((product) => product._id !== id),
    currentProduct: state.currentProduct?._id === id ? null : state.currentProduct,
  })),
  
  clearError: () => set({ error: null }),
  
  reset: () => set(initialState),
}));
