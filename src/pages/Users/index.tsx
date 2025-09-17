import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from '../../hooks/useTranslation';

const { Title } = Typography;

const Users: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('users.title') as string}</Title>
      <p>Users management will be implemented here.</p>
    </div>
  );
};

export default Users;
