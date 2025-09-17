import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Space,
  App,
  Spin,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { brandsApi } from '../../lib/api/brands';
import { useBrandsStore } from '../../stores/brands';
import type { Brand, BrandFormData } from '../../types';
import UploadFile from '../../components/ui/UploadFile';

const { Title } = Typography;
const { TextArea } = Input;

const BrandEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const { setCurrentBrand } = useBrandsStore();
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const fetchBrand = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const brandData = await brandsApi.getBrandById(id);
      setBrand(brandData);
      setCurrentBrand(brandData);
      
      // Populate form with existing data
      form.setFieldsValue({
        name: brandData.name,
        description: brandData.description || '',
        website: brandData.website || '',
        isActive: brandData.isActive,
      });

      // Set logo URL if exists
      if (brandData.logo) {
        setLogoUrl(brandData.logo);
      }
    } catch (error: unknown) {
      console.error('Failed to fetch brand:', error);
      messageApi.error(t('brands.failedToLoad') as string);
      navigate('/brands');
    } finally {
      setLoading(false);
    }
  }, [id, form, setCurrentBrand, messageApi, t, navigate]);

  useEffect(() => {
    if (id) {
      fetchBrand();
    }
  }, [id, fetchBrand]);

  const handleLogoChange = (url: string | null) => {
    setLogoUrl(url || '');
  };

  const handleSubmit = async (values: BrandFormData) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      
      // Update brand with new data
      const updateData: BrandFormData = {
        name: values.name,
        description: values.description,
        website: values.website,
        isActive: values.isActive,
        logo: logoUrl || brand?.logo,
      };
      
      await brandsApi.updateBrand(id, updateData);
      
      messageApi.success(t('brands.brandUpdated') as string);
      navigate('/brands');
    } catch (error: unknown) {
      console.error('Failed to update brand:', error);
      messageApi.error(t('brands.failedToUpdate') as string);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/brands');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div>
        <Title level={2}>{t('brands.brandNotFound') as string}</Title>
        <Button onClick={handleBack}>
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
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          {t('common.back') as string}
        </Button>
        
        <Title level={2}>{t('brands.editBrand') as string}</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: brand.name,
            description: brand.description || '',
            website: brand.website || '',
            isActive: brand.isActive,
          }}
        >
          <Form.Item
            name="name"
            label={t('common.name') as string}
            rules={[
              { required: true, message: t('brands.nameRequired') as string },
              { min: 2, message: t('brands.nameMinLength') as string },
              { max: 100, message: t('brands.nameMaxLength') as string },
            ]}
          >
            <Input 
              placeholder={t('brands.enterName') as string}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('common.description') as string}
            rules={[
              { max: 500, message: t('brands.descriptionMaxLength') as string },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t('brands.enterDescription') as string}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="website"
            label={t('brands.website') as string}
            rules={[
              { type: 'url', message: t('brands.invalidWebsite') as string },
            ]}
          >
            <Input 
              placeholder={t('brands.enterWebsite') as string}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={t('brands.logo') as string}
          >
            <UploadFile
              value={logoUrl}
              onChange={handleLogoChange}
              accept="image/*"
              maxSize={10 * 1024 * 1024} // 10MB
              showPreview={true}
              previewWidth={100}
              previewHeight={100}
              enableImageProcessing={true}
              imageProcessingOptions={{
                maxWidth: 800,
                maxHeight: 600,
                quality: 0.8,
                format: 'webp',
                maintainAspectRatio: true,
              }}
              showCompressionInfo={true}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label={t('common.status') as string}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={t('common.active') as string}
              unCheckedChildren={t('common.inactive') as string}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={submitting}
                size="large"
              >
                {t('common.save') as string}
              </Button>
              
              <Button
                onClick={handleBack}
                size="large"
              >
                {t('common.cancel') as string}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Brand Information */}
      <Card title={t('common.brandInfo') as string} style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <strong>{t('brands.slug') as string}:</strong>
            <br />
            <code>{brand.slug}</code>
          </div>
          
          <div>
            <strong>{t('common.createdAt') as string}:</strong>
            <br />
            {new Date(brand.createdAt).toLocaleString()}
          </div>
          
          <div>
            <strong>{t('common.updatedAt') as string}:</strong>
            <br />
            {new Date(brand.updatedAt).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandEdit;