import {
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Form,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/forms/ProductForm";
import { useTranslation } from "../../hooks/useTranslation";
import { productsApi } from "../../lib/api/products";
import { useProductsStore } from "../../stores/products";
import { 
  handleApiValidationError, 
  cleanVariantsAndAttributes 
} from "../../lib/utils/formHelpers";
import { logger } from "../../lib/utils/logger";
import type {
  Product,
  ProductAttribute,
  ProductFormData,
  ProductStatus,
  ProductType,
  ProductVariant,
} from "../../types";

const { Title } = Typography;

interface ProductEditFormData {
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  productType: ProductType;
  basePrice: number;
  originalBasePrice?: number;
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  features: string[];
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  images: string[];
}

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const { setCurrentProduct } = useProductsStore();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const product = await productsApi.getProductById(id);
      const productData = product.data
      setProduct(productData);
      setCurrentProduct(productData);

      // Clean up the data structure for form
      const cleanVariants = (productData.variants || []).map((variant) => ({
        ...variant,
        // Remove _id from variant attributes for form editing
        attributes: (variant.attributes || []).map((attr) => ({
          name: attr.name,
          value: attr.value,
          unit: attr.unit || "",
          category: attr.category || "",
        })),
      }));

      const cleanAttributes = (productData.attributes || []).map((attr) => ({
        name: attr.name,
        value: attr.value,
        unit: attr.unit || "",
        category: attr.category || "",
      }));

      // Populate form with existing data
      const formData = {
        name: productData.name,
        description: productData.description,
        shortDescription: productData.shortDescription || "",
        category: productData.category._id,
        brand: productData.brand._id,
        productType: productData.productType,
        basePrice: productData.basePrice,
        originalBasePrice: productData.originalBasePrice,
        status: productData.status,
        isFeatured: productData.isFeatured,
        isNew: productData.isNew,
        features: productData.features || [],
        tags: productData.tags || [],
        metaTitle: productData.metaTitle || "",
        metaDescription: productData.metaDescription || "",
        variants: cleanVariants,
        attributes: cleanAttributes,
      };

      // Reset form first to clear any existing data
      form.resetFields();

      // Set the form values
      form.setFieldsValue(formData);
    } catch (error: unknown) {
      logger.error({ error, productId: id }, "Failed to fetch product");
      messageApi.error(t("products.failedToLoad") as string);
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, form, setCurrentProduct, messageApi, t, navigate]);

  useEffect(() => {
    if (id) {
      // Reset form when component mounts or id changes
      form.resetFields();
      fetchProduct();
    }
  }, [
    id,
    fetchProduct,
    form,
  ]);

  const handleSubmit = async (values: ProductEditFormData) => {
    if (!id) return;

    try {
      setSubmitting(true);

      // Clean up variants and attributes
      const { cleanVariants, cleanAttributes } = cleanVariantsAndAttributes(values);

      const updateData: Partial<ProductFormData> = {
        name: values.name,
        description: values.description,
        category: values.category,
        brand: values.brand,
        productType: values.productType,
        basePrice: values.basePrice,
        variants: cleanVariants,
        images: values.images || [],
        features: values.features || [],
        attributes: cleanAttributes,
        status: values.status,
        isFeatured: values.isFeatured,
        isNew: values.isNew,
        tags: values.tags || [],
      };

      // Only add optional fields if they have values
      if (values.shortDescription?.trim()) {
        updateData.shortDescription = values.shortDescription.trim();
      }
      if (values.originalBasePrice) {
        updateData.originalBasePrice = values.originalBasePrice;
      }
      if (values.metaTitle?.trim()) {
        updateData.metaTitle = values.metaTitle.trim();
      }
      if (values.metaDescription?.trim()) {
        updateData.metaDescription = values.metaDescription.trim();
      }

      await productsApi.updateProduct(id, updateData);

      messageApi.success(t("products.productUpdated") as string);
      navigate("/products");
    } catch (error: unknown) {
      logger.error({ error, productId: id, updateData }, "Failed to update product");
      
      // Handle validation errors from backend
      const validationMessage = handleApiValidationError(error, form);
      if (validationMessage) {
        messageApi.error(t("products.failedToUpdate") as string + ": " + validationMessage);
      } else {
        messageApi.error(t("products.failedToUpdate") as string);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    // Clear any pending form state and navigate
    form.resetFields();
    navigate(-1);
  };


  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Title level={2}>{t("products.productNotFound") as string}</Title>
        <Button onClick={handleBack}>{t("common.back") as string}</Button>
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
          {t("common.back") as string}
        </Button>

        <Title level={2}>{t("products.editProduct") as string}</Title>
      </div>

      <ProductForm
        form={form}
        initialValues={{
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || "",
          category: product.category._id,
          brand: product.brand._id,
          productType: product.productType,
          basePrice: product.basePrice,
          originalBasePrice: product.originalBasePrice,
          status: product.status,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          features: product.features || [],
          tags: product.tags || [],
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          variants: (product.variants || []).map((variant) => ({
            ...variant,
            attributes: (variant.attributes || []).map((attr) => ({
              name: attr.name,
              value: attr.value,
              unit: attr.unit || "",
              category: attr.category || "",
            })),
          })),
          attributes: (product.attributes || []).map((attr) => ({
            name: attr.name,
            value: attr.value,
            unit: attr.unit || "",
            category: attr.category || "",
          })),
          images: product.images || [],
        }}
        onSubmit={handleSubmit}
      />
      {/* Actions */}
      <Card>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={submitting}
            size="large"
            onClick={() => form.submit()}
          >
            {t("common.update") as string}
          </Button>

          <Button onClick={handleBack} size="large">
            {t("common.cancel") as string}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProductEdit;
