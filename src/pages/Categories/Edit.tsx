import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Button,
  Typography,
  Space,
  App,
  Spin,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { categoriesApi } from '../../lib/api/categories';
import { useCategoriesStore } from '../../stores/categories';
import type { Category, CategoryFormData } from '../../types';
import CategoryForm from '../../components/forms/CategoryForm';
import { logger } from '../../lib/utils/logger';

const { Title } = Typography;

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const { setCurrentCategory } = useCategoriesStore();
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const category = await categoriesApi.getCategoryById(id);
      const categoryData = category.data
      setCategory(categoryData);
      setCurrentCategory(categoryData);
      
      // Populate form with existing data
      form.setFieldsValue({
        name: categoryData.name,
        description: categoryData.description || '',
        image: categoryData.image || '',
        isActive: categoryData.isActive,
      });
    } catch (error: unknown) {
      logger.error({ error, categoryId: id }, 'Failed to fetch category');
      messageApi.error(t('categories.failedToLoad') as string);
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: CategoryFormData) => {
    if (!id) return;
    
    try {
      setSubmitting(true);
      await categoriesApi.updateCategory(id, values);
      
      messageApi.success(t('categories.categoryUpdated') as string);
      navigate('/categories');
    } catch (error: unknown) {
      logger.error({ error, categoryId: id, values }, 'Failed to update category');
      messageApi.error(t('categories.failedToUpdate') as string);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/categories');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!category) {
    return (
      <div>
        <Title level={2}>{t('categories.categoryNotFound') as string}</Title>
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
        
        <Title level={2}>{t('categories.editCategory') as string}</Title>
      </div>

      <Card>
        <CategoryForm
          form={form}
          initialValues={{
            name: category.name,
            description: category.description || '',
            image: category.image || '',
            isActive: category.isActive,
          }}
          onSubmit={handleSubmit}
        />
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
              onClick={() => form.submit()}
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
        </div>
      </Card>

      {/* Category Information */}
      <Card title={t('common.categoryInfo') as string} style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <strong>{t('categories.slug') as string}:</strong>
            <br />
            <code>{category.slug}</code>
          </div>
          
          <div>
            <strong>{t('common.createdAt') as string}:</strong>
            <br />
            {new Date(category.createdAt).toLocaleString()}
          </div>
          
          <div>
            <strong>{t('common.updatedAt') as string}:</strong>
            <br />
            {new Date(category.updatedAt).toLocaleString()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CategoryEdit;