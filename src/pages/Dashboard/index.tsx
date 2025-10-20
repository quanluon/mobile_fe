import {
  AppstoreOutlined,
  DollarOutlined,
  RiseOutlined,
  ShoppingOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Spin, Statistic, Typography, App } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { brandsApi } from '../../lib/api/brands';
import { categoriesApi } from '../../lib/api/categories';
import { productsApi } from '../../lib/api/products';
import { ordersApi } from '../../lib/api/orders';
import { useBrandsStore } from '../../stores/brands';
import { useCategoriesStore } from '../../stores/categories';
import { useProductsStore } from '../../stores/products';
import { useOrdersStore } from '../../stores/orders';
import { formatCurrency } from '../../lib/utils/currency';
import { logger } from '../../lib/utils/logger';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { stats, setStats } = useProductsStore();
  const { brands } = useBrandsStore();
  const { categories } = useCategoriesStore();
  const { stats: orderStats, setStats: setOrderStats } = useOrdersStore();
  const { t } = useTranslation();
  const { message } = App.useApp();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [productStats, brandsData, categoriesData, orderStatsData] = await Promise.all([
          productsApi.getProductStats(),
          brandsApi.getBrands(), // Get all brands for count
          categoriesApi.getCategories(), // Get all categories for count
          ordersApi.getOrderStats(),
        ]);

        setStats(productStats.data);
        setOrderStats(orderStatsData.data);
        useBrandsStore.getState().setBrands(brandsData.data);
        useCategoriesStore.getState().setCategories(categoriesData.data);
      } catch (error: unknown) {
        message.error(t('messages.error.serverError') as string);
        logger.error({ error }, 'Dashboard data fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setStats, setOrderStats, t, message]);

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const activeBrands = brands.filter(brand => brand.isActive).length;
  const activeCategories = categories.filter(category => category.isActive).length;

  return (
    <div>
      <Title level={2}>{t('dashboard.title') as string}</Title>
      
      <Row gutter={[16, 16]}>
        {/* Products Statistics */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalProducts') as string}
              value={stats?.overview.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeProducts') as string}
              value={stats?.overview.activeProducts || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.featuredProducts') as string}
              value={stats?.overview.featuredProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.newProducts') as string}
              value={stats?.overview.newProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        {/* Price Statistics */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.averagePrice') as string}
              value={formatCurrency(stats?.overview.averagePrice || 0, { showSymbol: false })}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.minPrice') as string}
              value={formatCurrency(stats?.overview.minPrice || 0, { showSymbol: false })}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.maxPrice') as string}
              value={formatCurrency(stats?.overview.maxPrice || 0, { showSymbol: false })}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>

        {/* Brands and Categories */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeBrands') as string}
              value={activeBrands}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.activeCategories') as string}
              value={activeCategories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        {/* Order Statistics */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalOrders') as string}
              value={orderStats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.totalRevenue') as string}
              value={formatCurrency(orderStats?.totalRevenue || 0, { showSymbol: false })}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.pendingOrders') as string}
              value={orderStats?.pendingOrders || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('dashboard.deliveredOrders') as string}
              value={orderStats?.deliveredOrders || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Product Types Distribution */}
      {stats?.byType && stats.byType.length > 0 && (
        <Card title={t('dashboard.productsByType') as string} style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {stats.byType.map((type) => (
              <Col xs={24} sm={12} md={8} lg={6} key={type._id}>
                <Card size="small">
                  <Statistic
                    title={t(`productTypes.${type._id}`) as string}
                    value={type.count}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Categories Distribution */}
      {stats?.byCategory && stats.byCategory.length > 0 && (
        <Card title={t('dashboard.productsByCategory') as string} style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {stats.byCategory.map((category) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
                <Card size="small">
                  <Statistic
                    title={category._id}
                    value={category.count}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Order Status Distribution */}
      {orderStats && (
        <Card title={t('dashboard.ordersByStatus') as string} style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.pending') as string}
                  value={orderStats.pendingOrders}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.confirmed') as string}
                  value={orderStats.confirmedOrders}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.processing') as string}
                  value={orderStats.processingOrders}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.shipped') as string}
                  value={orderStats.shippedOrders}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.delivered') as string}
                  value={orderStats.deliveredOrders}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card size="small">
                <Statistic
                  title={t('orders.status.cancelled') as string}
                  value={orderStats.cancelledOrders}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
