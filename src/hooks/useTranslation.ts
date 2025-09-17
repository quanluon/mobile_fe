import { useTranslation as useI18nTranslation } from 'react-i18next';

// Custom hook that provides type-safe translations
export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
    isReady: i18n.isInitialized,
  };
};

export default useTranslation;
