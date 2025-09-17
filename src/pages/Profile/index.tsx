import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from '../../hooks/useTranslation';

const { Title } = Typography;

const Profile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Title level={2}>{t('profile.title') as string}</Title>
      <p>Profile management will be implemented here.</p>
    </div>
  );
};

export default Profile;
