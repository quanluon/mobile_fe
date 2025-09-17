import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from '../../hooks/useTranslation';

const { Title } = Typography;

const BrandCreate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('brands.addBrand') as string}</Title>
      <p>Brand creation form will be implemented here.</p>
    </div>
  );
};

export default BrandCreate;
