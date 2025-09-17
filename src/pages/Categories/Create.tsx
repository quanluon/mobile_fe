import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from '../../hooks/useTranslation';

const { Title } = Typography;

const CategoryCreate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('categories.addCategory') as string}</Title>
      <p>Category creation form will be implemented here.</p>
    </div>
  );
};

export default CategoryCreate;
