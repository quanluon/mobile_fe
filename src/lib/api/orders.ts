import type { Order, OrderFilters, OrderStats } from "../../types";
import { api } from "./config";

export const ordersApi = {
  // Get all orders with filters and pagination
  getOrders: async (filters?: OrderFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
    if (filters?.customerEmail) params.append("customerEmail", filters.customerEmail);
    if (filters?.customerPhone) params.append("customerPhone", filters.customerPhone);
    if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
    if (filters?.dateTo) params.append("dateTo", filters.dateTo);
    if (filters?.search) params.append("search", filters.search);

    return api.get<Order[]>(`/admin/orders?${params.toString()}`);
  },

  // Get order by ID
  getOrderById: async (id: string) => {
    return api.get<Order>(`/admin/orders/${id}`);
  },

  // Update order
  updateOrder: async (id: string, updateData: Partial<Order>) => {
    return api.put<Order>(`/admin/orders/${id}`, updateData);
  },

  // Delete order
  deleteOrder: async (id: string) => {
    await api.delete(`/admin/orders/${id}`);
  },

  // Bulk update orders
  bulkUpdateOrders: async (
    orderIds: string[],
    updateData: Partial<Order>
  ) => {
    return api.put<{
      results: Array<{
        id: string;
        success: boolean;
        order?: Order;
        error?: string;
      }>;
      summary: {
        total: number;
        success: number;
        failed: number;
      };
    }>("/admin/orders/bulk-update", {
      orderIds,
      updateData,
    });
  },

  // Get order statistics
  getOrderStats: async () => {
    return api.get<OrderStats>("/admin/orders/stats");
  },
};
