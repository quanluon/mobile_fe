import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { useAuthStore } from './stores/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductCreate from './pages/Products/Create';
import ProductEdit from './pages/Products/Edit';
import ProductDetail from './pages/Products/Detail';
import Brands from './pages/Brands';
import BrandCreate from './pages/Brands/Create';
import BrandEdit from './pages/Brands/Edit';
import BrandDetail from './pages/Brands/Detail';
import Categories from './pages/Categories';
import CategoryCreate from './pages/Categories/Create';
import CategoryEdit from './pages/Categories/Edit';
import CategoryDetail from './pages/Categories/Detail';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/Orders/Detail';
import OrderEdit from './pages/Orders/Edit';
import './lib/i18n'; // Initialize i18n
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/create" element={<ProductCreate />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/products/:id/edit" element={<ProductEdit />} />
                      <Route path="/brands" element={<Brands />} />
                      <Route path="/brands/create" element={<BrandCreate />} />
                      <Route path="/brands/:id" element={<BrandDetail />} />
                      <Route path="/brands/:id/edit" element={<BrandEdit />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/categories/create" element={<CategoryCreate />} />
                      <Route path="/categories/:id" element={<CategoryDetail />} />
                      <Route path="/categories/:id/edit" element={<CategoryEdit />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/orders/:id" element={<OrderDetail />} />
                      <Route path="/orders/:id/edit" element={<OrderEdit />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
