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
  Typography,
} from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/forms/ProductForm";
import { useTranslation } from "../../hooks/useTranslation";
import { productsApi } from "../../lib/api/products";
import { 
  handleApiValidationError, 
  cleanVariantsAndAttributes 
} from "../../lib/utils/formHelpers";
import type {
  ProductAttribute,
  ProductFormData,
  ProductStatus,
  ProductType,
  ProductVariant,
} from "../../types";

const { Title } = Typography;

interface ProductCreateFormData{
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

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: ProductCreateFormData) => {
    try {
      setSubmitting(true);

      // Clean up variants and attributes
      const { cleanVariants, cleanAttributes } = cleanVariantsAndAttributes(values);

      const createData: ProductFormData = {
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
        createData.shortDescription = values.shortDescription.trim();
      }
      if (values.originalBasePrice) {
        createData.originalBasePrice = values.originalBasePrice;
      }
      if (values.metaTitle?.trim()) {
        createData.metaTitle = values.metaTitle.trim();
      }
      if (values.metaDescription?.trim()) {
        createData.metaDescription = values.metaDescription.trim();
      }

      const newProduct = await productsApi.createProduct(createData);

      messageApi.success(t("products.productCreated") as string);
      navigate(`/products/${newProduct.data._id}`);
    } catch (error: unknown) {
      console.error("Failed to create product:", error);
      
      // Handle validation errors from backend
      const validationMessage = handleApiValidationError(error, form);
      if (validationMessage) {
        messageApi.error(t("products.failedToCreate") as string + ": " + validationMessage);
      } else {
        messageApi.error(t("products.failedToCreate") as string);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

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

        <Title level={2}>{t("products.addProduct") as string}</Title>
      </div>

      <ProductForm
        form={form}
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
            {t("common.create") as string}
          </Button>

          <Button onClick={handleBack} size="large">
            {t("common.cancel") as string}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProductCreate;
