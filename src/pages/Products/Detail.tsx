import {
  ArrowLeftOutlined,
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  StarOutlined,
  TagOutlined
} from '@ant-design/icons';
import {
  App,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { productsApi } from '../../lib/api/products';
import { PRODUCT_STATUSES } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils/currency';
import { useProductsStore } from '../../stores/products';

const { Title, Text, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { currentProduct, setCurrentProduct } = useProductsStore();
  
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const product = await productsApi.getProductById(id);
      setCurrentProduct(product.data);
    } catch (error: unknown) {
      message.error(t('products.failedToLoad') as string);
      console.error('Product fetch error:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, setCurrentProduct, message, t, navigate]);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id, fetchProductDetails]);

  const handleEdit = () => {
    if (currentProduct) {
      navigate(`/products/${currentProduct._id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!currentProduct) return;
    
    try {
      await productsApi.deleteProduct(currentProduct._id);
      message.success(t('products.productDeleted') as string);
      navigate('/products');
    } catch (error: unknown) {
      message.error(t('products.failedToDelete') as string);
      console.error('Delete product error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div>
        <Title level={2}>{t('products.productNotFound') as string}</Title>
        <Button onClick={() => navigate('/products')}>
          {t('common.back') as string}
        </Button>
      </div>
    );
  }

  const statusConfig = PRODUCT_STATUSES.find(s => s.value === currentProduct.status);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/products')}
          style={{ marginBottom: 16 }}
        >
          {t('common.back') as string}
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {currentProduct.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {currentProduct.slug}
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
        {/* Product Images */}
        <Col xs={24} lg={8}>
          <Card title={t('common.images') as string}>
            <div style={{ textAlign: 'center' }}>
              {currentProduct?.images?.length ? (
                <Image.PreviewGroup>
                  <Row gutter={[8, 8]}>
                    {currentProduct.images.map((image, index) => (
                      <Col xs={12} sm={8} key={index}>
                        <Image
                          src={image}
                          alt={`${currentProduct.name} ${index + 1}`}
                          style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
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

        {/* Product Information */}
        <Col xs={24} lg={16}>
          <Card title={t('products.productDetails') as string}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label={t('common.name') as string} span={2}>
                {currentProduct.name}
              </Descriptions.Item>
              
              <Descriptions.Item label={t('products.slug') as string} span={2}>
                <Text code>{currentProduct.slug}</Text>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('products.category') as string}>
                {currentProduct.category?.name || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label={t('products.brand') as string}>
                {currentProduct.brand?.name || '-'}
              </Descriptions.Item>
              
              <Descriptions.Item label={t('products.productType') as string}>
                <Tag color="blue">{t(`productTypes.${currentProduct.productType}`) as string}</Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('common.status') as string}>
                <Tag color={statusConfig?.color}>
                  {t(`statuses.${currentProduct.status}`) as string}
                </Tag>
              </Descriptions.Item>
              
              <Descriptions.Item label={t('products.basePrice') as string}>
                <Text strong style={{ color: '#1890ff' }}>
                  {formatCurrency(currentProduct.basePrice)}
                </Text>
              </Descriptions.Item>
              
              {currentProduct.originalBasePrice && (
                <Descriptions.Item label={t('products.originalPrice') as string}>
                  <Text delete style={{ color: '#999' }}>
                    {formatCurrency(currentProduct.originalBasePrice)}
                  </Text>
                </Descriptions.Item>
              )}
              
              <Descriptions.Item label={t('common.featured') as string}>
                <Badge 
                  status={currentProduct.isFeatured ? 'success' : 'default'} 
                  text={currentProduct.isFeatured ? t('common.yes') as string : t('common.no') as string}
                />
              </Descriptions.Item>
              
              <Descriptions.Item label={t('common.new') as string}>
                <Badge 
                  status={currentProduct.isNew ? 'success' : 'default'} 
                  text={currentProduct.isNew ? t('common.yes') as string : t('common.no') as string}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Description */}
      <Card title={t('common.description') as string} style={{ marginTop: 24 }}>
        <Paragraph>
          <span
            dangerouslySetInnerHTML={{
              __html: currentProduct.description || (t('common.noDescription') as string),
            }}
          />
        </Paragraph>
        
        {currentProduct.shortDescription && (
          <>
            <Divider />
            <Title level={5}>{t('products.shortDescription') as string}</Title>
            <Paragraph>
              {currentProduct.shortDescription}
            </Paragraph>
          </>
        )}
      </Card>

      {/* Features */}
      {currentProduct?.features?.length && (
        <Card title={t('products.features') as string} style={{ marginTop: 24 }}>
          <List
            dataSource={currentProduct?.features}
            renderItem={(feature) => (
              <List.Item>
                <Space>
                  <StarOutlined style={{ color: '#1890ff' }} />
                  <Text>{feature}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Tags */}
          {currentProduct?.tags?.length && (
        <Card title={t('products.tags') as string} style={{ marginTop: 24 }}>
          <Space wrap>
            {currentProduct?.tags?.map((tag, index) => (
              <Tag key={index} icon={<TagOutlined />} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* Variants */}
      {currentProduct?.variants?.length && (
        <Card title={t('products.variants') as string} style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {currentProduct.variants.map((variant, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card size="small" hoverable>
                  <div style={{ textAlign: 'center' }}>
                    {variant?.images?.length && (
                      <Image
                        src={variant.images[0]}
                        alt={variant.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                      />
                    )}
                    <div>
                      <Text strong>{variant.name}</Text>
                    </div>
                    <div>
                      <Tag color="blue">{variant.color}</Tag>
                      {variant.storage && <Tag>{variant.storage}</Tag>}
                      {variant.size && <Tag>{variant.size}</Tag>}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ color: '#1890ff' }}>
                        {formatCurrency(variant.price)}
                      </Text>
                      {variant.originalPrice && (
                        <Text delete style={{ color: '#999', marginLeft: 8 }}>
                          {formatCurrency(variant.originalPrice)}
                        </Text>
                      )}
                    </div>
                    <div>
                      <Text type="secondary">
                        {t('products.stock') as string}: {variant.stock}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Attributes */}
      {currentProduct?.attributes?.length && (
        <Card title={t('products.attributes') as string} style={{ marginTop: 24 }}>
          <Descriptions column={2} bordered>
            {currentProduct.attributes.map((attr, index) => (
              <Descriptions.Item key={index} label={attr.name}>
                {attr.value} {attr.unit && <Text type="secondary">({attr.unit})</Text>}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </Card>
      )}

      {/* SEO Information */}
      {(currentProduct?.metaTitle || currentProduct?.metaDescription) && (
        <Card title={t('common.seo') as string} style={{ marginTop: 24 }}>
          <Descriptions column={1} bordered>
            {currentProduct?.metaTitle && (
              <Descriptions.Item label={t('products.metaTitle') as string}>
                {currentProduct.metaTitle}
              </Descriptions.Item>
            )}
            {currentProduct?.metaDescription && (
              <Descriptions.Item label={t('products.metaDescription') as string}>
                {currentProduct.metaDescription}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      {/* Metadata */}
      <Card title={t('common.metadata') as string} style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <div>
                <Text strong>{t('common.createdAt') as string}:</Text>
                <br />
                <Text>{new Date(currentProduct?.createdAt).toLocaleString()}</Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined />
              <div>
                <Text strong>{t('common.updatedAt') as string}:</Text>
                <br />
                <Text>{new Date(currentProduct?.updatedAt).toLocaleString()}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetail;
