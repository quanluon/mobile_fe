import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Tag,
  Row,
  Col,
  Spin,
  App,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { categoriesApi } from '../../lib/api/categories';
import { useCategoriesStore } from '../../stores/categories';
import { useTranslation } from '../../hooks/useTranslation';

const { Title, Text, Paragraph } = Typography;

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { currentCategory, setCurrentCategory } = useCategoriesStore();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCategoryDetails();
    }
  }, [id]);

  const fetchCategoryDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const category = await categoriesApi.getCategoryById(id);
      setCurrentCategory(category.data);
    } catch (error: unknown) {
      message.error(t('categories.failedToLoad') as string);
      console.error('Category fetch error:', error);
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (currentCategory) {
      navigate(`/categories/${currentCategory._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentCategory) return;
    
    try {
      await categoriesApi.deleteCategory(currentCategory._id);
      message.success(t('categories.categoryDeleted') as string);
      navigate('/categories');
    } catch (error: unknown) {
      message.error(t('categories.failedToDelete') as string);
      console.error('Delete category error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div>
        <Title level={2}>{t('categories.categoryNotFound') as string}</Title>
        <Button onClick={() => navigate('/categories')}>
          {t('common.back') as string}
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/categories')}
          style={{ marginBottom: 16 }}
        >
          {t('common.back') as string}
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentCategory.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {currentCategory.slug}
            </Text>
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              {t('common.edit') as string}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              {t('common.delete') as string}
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Category Information */}
        <Col xs={24} lg={16}>
          <Card title={t('categories.categoryDetails') as string}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('common.name') as string}:</Text>
                  <br />
                  <Text>{currentCategory.name}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('categories.slug') as string}:</Text>
                  <br />
                  <Text code>{currentCategory.slug}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('common.status') as string}:</Text>
                  <br />
                  <Tag color={currentCategory.isActive ? 'green' : 'red'}>
                    {currentCategory.isActive ? t('common.active') as string : t('common.inactive') as string}
                  </Tag>
                </div>
              </Col>
              
              <Col xs={24}>
                <div>
                  <Text strong>{t('common.description') as string}:</Text>
                  <br />
                  <Paragraph style={{ marginTop: 8 }}>
                    {currentCategory.description || t('common.noDescription') as string}
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Category Image */}
        <Col xs={24} lg={8}>
          <Card title={t('categories.categoryImage') as string}>
            {currentCategory.image ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={currentCategory.image}
                  alt={currentCategory.name}
                  style={{
                    width: '100%',
                    maxWidth: 300,
                    height: 'auto',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 8,
                  color: '#999',
                }}
              >
                <Text type="secondary">{t('categories.noImage') as string}</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Metadata */}
        <Col xs={24} lg={8}>
          <Card title={t('common.metadata') as string}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined />
                  <div>
                    <Text strong>{t('common.createdAt') as string}:</Text>
                    <br />
                    <Text>{new Date(currentCategory.createdAt).toLocaleString()}</Text>
                  </div>
                </div>
              </Col>
              
              <Col xs={24}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarOutlined />
                  <div>
                    <Text strong>{t('common.updatedAt') as string}:</Text>
                    <br />
                    <Text>{new Date(currentCategory.updatedAt).toLocaleString()}</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CategoryDetail;
