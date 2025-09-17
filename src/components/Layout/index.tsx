import React, { useState } from 'react';
import { Layout as AntdLayout, Menu, Avatar, Dropdown, Button, theme, Space } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TagsOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { useTranslation } from '../../hooks/useTranslation';
import { useInitializeStores } from '../../hooks/useInitializeStores';
import LanguageSwitcher from '../LanguageSwitcher';
import { ROUTES } from '../../lib/constants';

const { Header, Sider, Content } = AntdLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  // Initialize store data when the app starts
  useInitializeStores();
  const { t } = useTranslation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: t('navigation.dashboard') as string,
    },
    {
      key: ROUTES.ORDERS,
      icon: <ShoppingCartOutlined />,
      label: t('navigation.orders') as string,
    },
    {
      key: ROUTES.PRODUCTS,
      icon: <ShoppingOutlined />,
      label: t('navigation.products') as string,
    },
    {
      key: ROUTES.BRANDS,
      icon: <TagsOutlined />,
      label: t('navigation.brands') as string,
    },
    {
      key: ROUTES.CATEGORIES,
      icon: <AppstoreOutlined />,
      label: t('navigation.categories') as string,
    },
    {
      key: ROUTES.USERS,
      icon: <UserOutlined />,
      label: t('navigation.users') as string,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('navigation.profile') as string,
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t('navigation.settings') as string,
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('navigation.logout') as string,
      onClick: handleLogout,
    },
  ];

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
        }}
      >
        <div className="demo-logo-vertical" style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#1890ff',
          fontWeight: 'bold',
          fontSize: collapsed ? 14 : 16,
        }}>
          {collapsed ? 'CP' : 'Cong Phone Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntdLayout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
            <LanguageSwitcher />
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: 6,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  src={user?.profileImage}
                />
                <span style={{ fontWeight: 500 }}>
                  {user?.firstName || user?.email}
                </span>
              </div>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};

export default Layout;
