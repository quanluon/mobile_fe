import type {
  AuthUser,
  LoginCredentials,
  RegisterData,
  User,
  UserFilters,
} from "../../types";
import { api } from "./config";

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials) => {
    return api.post<AuthUser>("/auth/login", credentials);
  },

  // Register
  register: async (userData: RegisterData) => {
    return api.post<User>("/auth/register", userData);
  },

  // Get current user profile
  getProfile: async () => {
    return api.get<User>("/auth/profile");
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    return api.put<User>("/auth/profile", data);
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.put("/auth/change-password", { currentPassword, newPassword });
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  // Confirm forgot password
  confirmForgotPassword: async (
    email: string,
    confirmationCode: string,
    newPassword: string
  ): Promise<void> => {
    await api.post("/auth/confirm-forgot-password", {
      email,
      confirmationCode,
      newPassword,
    });
  },

  // Get all users (admin only)
  getAllUsers: async (filters?: UserFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.userType) params.append("userType", filters.userType);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    return api.get<User[]>(`/auth/users?${params.toString()}`);
  },

  // Get user by ID (admin only)
  getUserById: async (id: string) => {
    return api.get<User>(`/auth/users/${id}`);
  },

  // Deactivate user (admin only)
  deactivateUser: async (email: string): Promise<void> => {
    await api.put(`/auth/users/${email}/deactivate`);
  },
};
