import React from 'react';
import { Button, Card, Form, Typography, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { categoriesApi } from '../../lib/api/categories';
import { type CategoryFormData } from '../../types';
import CategoryForm from '../../components/forms/CategoryForm';

const { Title } = Typography;

const CategoryCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async (values: CategoryFormData) => {
    try {
      await categoriesApi.createCategory(values);
      message.success(t('categories.createSuccess') as string);
      navigate('/categories');
    } catch (error: unknown) {
      message.error(t('categories.createError') as string);
      console.error('Create category error:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>{t('categories.addCategory') as string}</Title>
        <Button onClick={() => navigate('/categories')}>
          {t('common.back') as string}
        </Button>
      </div>

      <Card>
        <CategoryForm
          form={form}
          onSubmit={handleSubmit}
        />
        
        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            onClick={() => form.submit()}
          >
            {t('categories.createCategory') as string}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CategoryCreate;
