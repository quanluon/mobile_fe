import React, { useEffect, useState } from 'react';
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
import { categoriesApi } from '../../lib/api/categories';
import { useCategoriesStore } from '../../stores/categories';
import type { Category, CategoryFormData } from '../../types';

const { Title } = Typography;
const { TextArea } = Input;

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
        isActive: categoryData.isActive,
      });
    } catch (error: unknown) {
      console.error('Failed to fetch category:', error);
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
      console.error('Failed to update category:', error);
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: category.name,
            description: category.description || '',
            isActive: category.isActive,
          }}
        >
          <Form.Item
            name="name"
            label={t('common.name') as string}
            rules={[
              { required: true, message: t('categories.nameRequired') as string },
              { min: 2, message: t('categories.nameMinLength') as string },
              { max: 100, message: t('categories.nameMaxLength') as string },
            ]}
          >
            <Input 
              placeholder={t('categories.enterName') as string}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('common.description') as string}
            rules={[
              { max: 500, message: t('categories.descriptionMaxLength') as string },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t('categories.enterDescription') as string}
              showCount
              maxLength={500}
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