import { FormInstance } from 'antd';

/**
 * Handles API validation errors and sets them on the form
 * @param error - The error object from the API
 * @param form - Ant Design form instance
 * @returns Error message string or null
 */
export const handleApiValidationError = (error: any, form: FormInstance): string | null => {
  // Check if it's a validation error with field-level errors
  if (error?.response?.data?.data && Array.isArray(error.response.data.data)) {
    const validationErrors = error.response.data.data;
    
    // Set form field errors
    const fieldErrors = validationErrors.map((err: any) => ({
      name: err.field,
      errors: [err.message],
    }));
    form.setFields(fieldErrors);
    
    // Return the general error message
    return error.response.data.message || 'Validation error';
  }
  
  return null;
};

/**
 * Cleans optional string fields by removing empty values
 * @param data - The data object to clean
 * @param fields - Array of field names to clean
 */
export const cleanOptionalFields = <T extends Record<string, any>>(
  data: T,
  values: Record<string, any>,
  fields: string[]
): void => {
  fields.forEach((field) => {
    if (values[field]?.trim()) {
      (data as any)[field] = values[field].trim();
    }
  });
};

/**
 * Cleans variant and attribute structures for API submission
 */
export const cleanVariantsAndAttributes = (values: any) => {
  const cleanVariants = (values.variants || []).map((variant: any) => ({
    ...variant,
    // Remove _id from variant attributes if they exist
    attributes: (variant.attributes || []).map((attr: any) => ({
      name: attr.name,
      value: attr.value,
      unit: attr.unit || "",
      category: attr.category || "",
    })),
  }));

  const cleanAttributes = (values.attributes || []).map((attr: any) => ({
    name: attr.name,
    value: attr.value,
    unit: attr.unit || "",
    category: attr.category || "",
  }));

  return { cleanVariants, cleanAttributes };
};

