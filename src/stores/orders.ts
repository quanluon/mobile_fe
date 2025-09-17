import { create } from 'zustand';
import type { Order, OrderFilters, OrderStats } from '../types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  stats: OrderStats | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface OrdersActions {
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setStats: (stats: OrderStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPagination: (pagination: Partial<OrdersState['pagination']>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const useOrdersStore = create<OrdersState & OrdersActions>((set) => ({
  ...initialState,

  setOrders: (orders) => set({ orders }),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  setStats: (stats) => set({ stats }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),

  updateOrder: (orderId, updates) => set((state) => ({
    orders: state.orders.map((order) =>
      order._id === orderId ? { ...order, ...updates } : order
    ),
    currentOrder: state.currentOrder?._id === orderId
      ? { ...state.currentOrder, ...updates }
      : state.currentOrder,
  })),

  removeOrder: (orderId) => set((state) => ({
    orders: state.orders.filter((order) => order._id !== orderId),
    currentOrder: state.currentOrder?._id === orderId ? null : state.currentOrder,
  })),

  clearError: () => set({ error: null }),

  reset: () => set(initialState),
}));
