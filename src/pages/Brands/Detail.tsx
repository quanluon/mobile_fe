import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Image,
  Row,
  Space,
  Spin,
  Tag,
  Typography
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { brandsApi } from '../../lib/api/brands';
import { useBrandsStore } from '../../stores/brands';
import { logger } from '../../lib/utils/logger';

const { Title, Text, Paragraph } = Typography;

const BrandDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { currentBrand, setCurrentBrand } = useBrandsStore();
  
  const [loading, setLoading] = useState(true);

  const fetchBrandDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const brand = await brandsApi.getBrandById(id);
      setCurrentBrand(brand);
    } catch (error: unknown) {
      message.error(t('brands.failedToLoad') as string);
      logger.error({ error, brandId: id }, 'Brand fetch error');
      navigate('/brands');
    } finally {
      setLoading(false);
    }
  }, [id, setCurrentBrand, message, t, navigate]);

  useEffect(() => {
    if (id) {
      fetchBrandDetails();
    }
  }, [id, fetchBrandDetails]);

  const handleEdit = () => {
    if (currentBrand) {
      navigate(`/brands/${currentBrand._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentBrand) return;
    
    try {
      await brandsApi.deleteBrand(currentBrand._id);
      message.success(t('brands.brandDeleted') as string);
      navigate('/brands');
    } catch (error: unknown) {
      message.error(t('brands.failedToDelete') as string);
      logger.error({ error, brandId: currentBrand._id }, 'Delete brand error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentBrand) {
    return (
      <div>
        <Title level={2}>{t('brands.brandNotFound') as string}</Title>
        <Button onClick={() => navigate('/brands')}>
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
          onClick={() => navigate('/brands')}
          style={{ marginBottom: 16 }}
        >
          {t('common.back') as string}
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentBrand.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {currentBrand.slug}
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
        {/* Brand Information */}
        <Col xs={24} lg={16}>
          <Card title={t('brands.brandDetails') as string}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('common.name') as string}:</Text>
                  <br />
                  <Text>{currentBrand.name}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('brands.slug') as string}:</Text>
                  <br />
                  <Text code>{currentBrand.slug}</Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div>
                  <Text strong>{t('common.status') as string}:</Text>
                  <br />
                  <Tag color={currentBrand.isActive ? 'green' : 'red'}>
                    {currentBrand.isActive ? t('common.active') as string : t('common.inactive') as string}
                  </Tag>
                </div>
              </Col>
              
              {currentBrand.website && (
                <Col xs={24} sm={12}>
                  <div>
                    <Text strong>{t('brands.website') as string}:</Text>
                    <br />
                    <a 
                      href={currentBrand.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <GlobalOutlined />
                      {currentBrand.website}
                    </a>
                  </div>
                </Col>
              )}
              
              <Col xs={24}>
                <div>
                  <Text strong>{t('common.description') as string}:</Text>
                  <br />
                  <Paragraph style={{ marginTop: 8 }}>
                    {currentBrand.description || t('common.noDescription') as string}
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Brand Logo */}
        <Col xs={24} lg={8}>
          <Card title={t('brands.logo') as string}>
            <div style={{ textAlign: 'center' }}>
              {currentBrand.logo ? (
                <Image
                  src={currentBrand.logo}
                  alt={currentBrand.name}
                  style={{ maxWidth: '100%', maxHeight: 200 }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              ) : (
                <div style={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 8
                }}>
                  <Text type="secondary">{t('common.noImage') as string}</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Metadata */}
      <Card title={t('common.metadata') as string} style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <div>
                <Text strong>{t('common.createdAt') as string}:</Text>
                <br />
                <Text>{new Date(currentBrand.createdAt).toLocaleString()}</Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <div>
                <Text strong>{t('common.updatedAt') as string}:</Text>
                <br />
                <Text>{new Date(currentBrand.updatedAt).toLocaleString()}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default BrandDetail;
