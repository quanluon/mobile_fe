import { useEffect } from 'react';
import { useBrandsStore } from '../stores/brands';
import { useCategoriesStore } from '../stores/categories';

/**
 * Hook to initialize store data when the app starts
 * This ensures brands and categories are available across the app
 */
export const useInitializeStores = () => {
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    // Only fetch if data is not already loaded
    if (brands.length === 0) {
      fetchBrands();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [brands.length, categories.length, fetchBrands, fetchCategories]);
};
