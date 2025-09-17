import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  // const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
    >
      {languages.map((language) => (
        <Option key={language.code} value={language.code}>
          <Space>
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </Space>
        </Option>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
