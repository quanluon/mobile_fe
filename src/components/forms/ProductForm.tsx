import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Typography,
  type FormInstance,
} from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import {
  ATTRIBUTE_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
} from "../../lib/constants";
import {
  ProductStatus,
  type ProductAttribute,
  type ProductType,
  type ProductVariant,
} from "../../types";
import RichTextEditor from "../ui/RichTextEditor";
import UploadFiles from "../ui/UploadFiles";
import { useBrandsStore } from "../../stores/brands";
import { useCategoriesStore } from "../../stores/categories";

const { TextArea } = Input;
const { Option } = Select;

export interface ProductFormData {
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

interface ProductFormProps {
  form: FormInstance;
  initialValues?: Partial<ProductFormData>;
  onSubmit: (values: ProductFormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  initialValues,
  onSubmit,
}) => {
  const { brands, fetchBrands } = useBrandsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    // Fetch brands and categories if not already loaded
    if (brands.length === 0) {
      fetchBrands();
    }
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [brands.length, categories.length, fetchBrands, fetchCategories]);

  const { t } = useTranslation();

  const addVariant = () => {
    const currentVariants = form.getFieldValue("variants") || [];
    const newVariant: Partial<ProductVariant> = {
      name: "",
      color: "",
      colorCode: "#000000",
      price: 0,
      stock: 0,
      images: [],
      attributes: [],
      isActive: true,
    };
    form.setFieldsValue({
      variants: [...currentVariants, newVariant],
    });
  };

  const removeVariant = (index: number) => {
    const currentVariants = form.getFieldValue("variants") || [];
    const updatedVariants = currentVariants.filter(
      (_: unknown, i: number) => i !== index
    );
    form.setFieldsValue({
      variants: updatedVariants,
    });
  };

  const addAttribute = () => {
    const currentAttributes = form.getFieldValue("attributes") || [];
    const newAttribute: Partial<ProductAttribute> = {
      name: "",
      value: "",
      unit: "",
      category: "",
    };
    form.setFieldsValue({
      attributes: [...currentAttributes, newAttribute],
    });
  };

  const addVariantAttribute = (variantIndex: number) => {
    const currentVariants = form.getFieldValue("variants") || [];
    const variant = currentVariants[variantIndex];
    if (variant) {
      const newAttribute: Partial<ProductAttribute> = {
        name: "",
        value: "",
        unit: "",
        category: "",
      };
      variant.attributes = [...(variant.attributes || []), newAttribute];
      form.setFieldsValue({
        variants: currentVariants,
      });
    }
  };

  const removeVariantAttribute = (
    variantIndex: number,
    attributeIndex: number
  ) => {
    const currentVariants = form.getFieldValue("variants") || [];
    const variant = currentVariants[variantIndex];
    if (variant && variant.attributes) {
      variant.attributes = variant.attributes.filter(
        (_: unknown, i: number) => i !== attributeIndex
      );
      form.setFieldsValue({
        variants: currentVariants,
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        features: [],
        tags: [],
        variants: [],
        attributes: [],
        images: [],
        isFeatured: false,
        isNew: false,
        status: ProductStatus.ACTIVE,
        ...initialValues,
      }}
    >
      {/* Basic Information */}
      <Card title={t("products.basicInfo") as string} className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={t("common.name") as string}
              rules={[
                {
                  required: true,
                  message: t("products.nameRequired") as string,
                },
                { min: 2, message: t("products.nameMinLength") as string },
                { max: 100, message: t("products.nameMaxLength") as string },
              ]}
            >
              <Input
                placeholder={t("products.enterName") as string}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="productType"
              label={t("products.productType") as string}
              rules={[
                {
                  required: true,
                  message: t("products.productTypeRequired") as string,
                },
              ]}
            >
              <Select
                placeholder={t("products.selectProductType") as string}
                size="large"
              >
                {PRODUCT_TYPES.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {t(`productTypes.${type.value}`) as string}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label={t("products.category") as string}
              rules={[
                {
                  required: true,
                  message: t("products.categoryRequired") as string,
                },
              ]}
            >
              <Select
                placeholder={t("products.selectCategory") as string}
                size="large"
              >
                {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="brand"
              label={t("products.brand") as string}
              rules={[
                {
                  required: true,
                  message: t("products.brandRequired") as string,
                },
              ]}
            >
              <Select
                placeholder={t("products.selectBrand") as string}
                size="large"
              >
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="basePrice"
              label={t("products.basePrice") as string}
              rules={[
                {
                  required: true,
                  message: t("products.basePriceRequired") as string,
                },
              ]}
            >
              <InputNumber
                prefix="đ"
                placeholder={t("products.enterBasePrice") as string}
                size="large"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="originalBasePrice"
              label={t("products.originalBasePrice") as string}
            >
              <InputNumber
                placeholder={t("products.enterOriginalPrice") as string}
                size="large"
                style={{ width: "100%" }}
                prefix="đ"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="status"
              label={t("common.status") as string}
              rules={[
                {
                  required: true,
                  message: t("products.statusRequired") as string,
                },
              ]}
            >
              <Select
                placeholder={t("products.selectStatus") as string}
                size="large"
              >
                {PRODUCT_STATUSES.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {t(`statuses.${status.value}`) as string}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="isFeatured"
              label={t("common.featured") as string}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("common.yes") as string}
                unCheckedChildren={t("common.no") as string}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="isNew"
              label={t("common.new") as string}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t("common.yes") as string}
                unCheckedChildren={t("common.no") as string}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Product Images */}
      <Card title={t("products.images") as string} className="mb-6">
        <Form.Item
          name="images"
          label={t("products.mainImages") as string}
          rules={[
            {
              required: true,
              message: t("products.imagesRequired") as string,
            },
          ]}
        >
          <UploadFiles
            value={form.getFieldValue("images") || []}
            onChange={(urls) => {
              form.setFieldsValue({ images: urls || [] });
            }}
            accept="image/*"
            maxSize={10 * 1024 * 1024} // 10MB
            maxCount={10}
            showPreview={true}
            previewWidth={120}
            previewHeight={120}
          />
        </Form.Item>
        <div className="p-3 bg-green-50 border border-green-300 rounded-md mt-2">
          <p className="m-0 text-xs text-green-600">
            💡 {t("products.imagesTip") as string}
          </p>
        </div>
      </Card>

      {/* Description */}
      <Card title={t("common.description") as string} className="mb-6">
        <Form.Item
          name="shortDescription"
          label={t("products.shortDescription") as string}
          rules={[
            {
              max: 200,
              message: t("products.shortDescriptionMaxLength") as string,
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder={t("products.enterShortDescription") as string}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("common.description") as string}
          rules={[
            {
              required: true,
              message: t("products.descriptionRequired") as string,
            },
            {
              min: 10,
              message: t("products.descriptionMinLength") as string,
            },
          ]}
        >
          <RichTextEditor
            placeholder={t("products.enterDescription") as string}
            height={200}
          />
        </Form.Item>
      </Card>

      {/* Features */}
      <Card title={t("products.features") as string} className="mb-6">
        <Form.List name="features">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div className="flex gap-2 items-center w-full mb-2">
                  <Form.Item
                    className="flex-1 mb-0"
                    key={key}
                    {...restField}
                    name={name}
                    rules={[
                      {
                        required: true,
                        message: t("products.featureRequired") as string,
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("products.enterFeature") as string}
                      size="small"
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                    className="min-w-8 h-6"
                  />
                </div>
              ))}
              <Form.Item className="mb-0">
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  size="small"
                  className="w-full"
                >
                  {t("products.addFeature") as string}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Product Attributes */}
      <Card
        title={t("products.attributes") as string}
        className="mb-6"
        extra={
          <Button type="dashed" icon={<PlusOutlined />} onClick={addAttribute}>
            {t("products.addAttribute") as string}
          </Button>
        }
      >
        <div className="p-6 text-center bg-gray-50 rounded-md mb-4 border border-dashed border-gray-300">
          <p className="text-gray-600 m-0">
            {t("products.noAttributesYet") as string}
          </p>
          <p className="text-gray-400 text-xs mt-2 mb-0">
            {t("products.attributesExample") as string}
          </p>
        </div>
        <Form.List name="attributes">
          {(fields, { remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} size="small" className="mb-4">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label={t("products.attributeName") as string}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "products.attributeNameRequired"
                            ) as string,
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            t("products.enterAttributeName") as string
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        label={t("products.attributeValue") as string}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "products.attributeValueRequired"
                            ) as string,
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            t("products.enterAttributeValue") as string
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item
                        {...restField}
                        name={[name, "unit"]}
                        label={t("products.attributeUnit") as string}
                      >
                        <Input
                          placeholder={t("products.enterUnit") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "category"]}
                        label={t("products.attributeCategory") as string}
                      >
                        <Select
                          placeholder={t("products.selectCategory") as string}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                        >
                          {ATTRIBUTE_CATEGORIES.map((category) => (
                            <Option key={category.value} value={category.value}>
                              {
                                t(
                                  `attributeCategories.${category.value}`
                                ) as string
                              }
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={2}>
                      <Form.Item label=" " style={{ marginBottom: 0 }}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Card>

      {/* Product Variants */}
      <Card
        title={
          <span>
            <span style={{ color: "#ff4d4f", marginRight: "4px" }}>*</span>
            {t("products.variants") as string}
          </span>
        }
        className="mb-6"
        extra={
          <Button type="dashed" icon={<PlusOutlined />} onClick={addVariant}>
            {t("products.addVariant") as string}
          </Button>
        }
      >
        <div className="p-6 text-center bg-gray-50 rounded-md mb-4 border border-dashed border-gray-300">
          <p className="text-gray-600 m-0">
            {t("products.noVariantsYet") as string}
          </p>
          <p className="text-gray-400 text-xs mt-2 mb-0">
            {t("products.variantsExample") as string}
          </p>
        </div>
        <Form.Item
          name="variants"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(
                    new Error(t("products.variantsRequired") as string)
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <input type="hidden" />
        </Form.Item>
        <Form.List name="variants">
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  className="mb-6 border border-gray-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <Typography.Title level={5} className="m-0">
                      {t("products.variant") as string} {name + 1}
                    </Typography.Title>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeVariant(name)}
                    >
                      {t("common.remove") as string}
                    </Button>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label={t("products.variantName") as string}
                        rules={[
                          {
                            required: true,
                            message: t(
                              "products.variantNameRequired"
                            ) as string,
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("products.enterVariantName") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        label={t("products.color") as string}
                        rules={[
                          {
                            required: true,
                            message: t("products.colorRequired") as string,
                          },
                        ]}
                      >
                        <Input
                          placeholder={t("products.enterColor") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        getValueFromEvent={(color) => {
                          return "#" + color.toHex();
                        }}
                        name={[name, "colorCode"]}
                        label={t("products.colorCode") as string}
                        rules={[
                          {
                            required: true,
                            message: t("products.colorCodeRequired") as string,
                          },
                        ]}
                      >
                        <ColorPicker
                          style={{ width: "100%" }}
                          showText
                          format="hex"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "storage"]}
                        label={t("products.storage") as string}
                      >
                        <Input
                          placeholder={t("products.enterStorage") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "size"]}
                        label={t("products.size") as string}
                      >
                        <Input
                          placeholder={t("products.enterSize") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "connectivity"]}
                        label={t("products.connectivity") as string}
                      >
                        <Input
                          placeholder={
                            t("products.enterConnectivity") as string
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "simType"]}
                        label={t("products.simType") as string}
                      >
                        <Input
                          placeholder={t("products.enterSimType") as string}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        label={t("products.price") as string}
                        rules={[
                          {
                            required: true,
                            message: t("products.priceRequired") as string,
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder={t("products.enterPrice") as string}
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/₫\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "originalPrice"]}
                        label={t("products.originalPrice") as string}
                      >
                        <InputNumber
                          placeholder={
                            t("products.enterOriginalPrice") as string
                          }
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value!.replace(/₫\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        label={t("products.stock") as string}
                        rules={[
                          {
                            required: true,
                            message: t("products.stockRequired") as string,
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder={t("products.enterStock") as string}
                          style={{ width: "100%" }}
                          min={0}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "isActive"]}
                        label={t("common.status") as string}
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren={t("common.active") as string}
                          unCheckedChildren={t("common.inactive") as string}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Variant Images */}
                  <div className="mt-4">
                    <Form.Item
                      {...restField}
                      name={[name, "images"]}
                      label={t("products.variantImages") as string}
                    >
                      <UploadFiles
                        value={
                          form.getFieldValue(["variants", name, "images"]) || []
                        }
                        onChange={(urls) => {
                          const currentVariants =
                            form.getFieldValue("variants") || [];
                          if (currentVariants[name]) {
                            currentVariants[name].images = urls || [];
                            form.setFieldsValue({
                              variants: currentVariants,
                            });
                          }
                        }}
                        accept="image/*"
                        maxSize={10 * 1024 * 1024}
                        maxCount={5}
                        showPreview={true}
                        previewWidth={80}
                        previewHeight={80}
                      />
                    </Form.Item>
                  </div>

                  {/* Variant Attributes */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <Typography.Title level={5} className="m-0">
                        {t("products.variantAttributes") as string}
                      </Typography.Title>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => addVariantAttribute(name)}
                      >
                        {t("products.addAttribute") as string}
                      </Button>
                    </div>

                    <Form.List name={[name, "attributes"]}>
                      {(attributeFields) => (
                        <>
                          {attributeFields.map(
                            ({
                              key: attrKey,
                              name: attrName,
                              ...attrRestField
                            }) => (
                              <Card
                                key={attrKey}
                                size="small"
                                className="mb-2 bg-gray-50"
                              >
                                <Row gutter={[8, 8]}>
                                  <Col xs={24} md={6}>
                                    <Form.Item
                                      {...attrRestField}
                                      name={[attrName, "name"]}
                                      label={
                                        t("products.attributeName") as string
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message: t(
                                            "products.attributeNameRequired"
                                          ) as string,
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="small"
                                        placeholder={
                                          t(
                                            "products.enterAttributeName"
                                          ) as string
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} md={6}>
                                    <Form.Item
                                      {...attrRestField}
                                      name={[attrName, "value"]}
                                      label={
                                        t("products.attributeValue") as string
                                      }
                                      rules={[
                                        {
                                          required: true,
                                          message: t(
                                            "products.attributeValueRequired"
                                          ) as string,
                                        },
                                      ]}
                                    >
                                      <Input
                                        size="small"
                                        placeholder={
                                          t(
                                            "products.enterAttributeValue"
                                          ) as string
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} md={4}>
                                    <Form.Item
                                      {...attrRestField}
                                      name={[attrName, "unit"]}
                                      label={
                                        t("products.attributeUnit") as string
                                      }
                                    >
                                      <Input
                                        size="small"
                                        placeholder={
                                          t("products.enterUnit") as string
                                        }
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} md={6}>
                                    <Form.Item
                                      {...attrRestField}
                                      name={[attrName, "category"]}
                                      label={
                                        t(
                                          "products.attributeCategory"
                                        ) as string
                                      }
                                    >
                                      <Select
                                        size="small"
                                        placeholder={
                                          t("products.selectCategory") as string
                                        }
                                        allowClear
                                        showSearch
                                        optionFilterProp="children"
                                      >
                                        {ATTRIBUTE_CATEGORIES.map(
                                          (category) => (
                                            <Option
                                              key={category.value}
                                              value={category.value}
                                            >
                                              {
                                                t(
                                                  `attributeCategories.${category.value}`
                                                ) as string
                                              }
                                            </Option>
                                          )
                                        )}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} md={2}>
                                    <Form.Item
                                      label=" "
                                      style={{ marginBottom: 0 }}
                                    >
                                      <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          removeVariantAttribute(name, attrName)
                                        }
                                        style={{ width: "100%" }}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Card>
                            )
                          )}
                        </>
                      )}
                    </Form.List>
                  </div>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Card>

      {/* Tags */}
      <Card title={t("products.tags") as string} className="mb-6">
        <Form.List name="tags">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div className="flex gap-2 items-center w-full mb-2">
                  <Form.Item
                    className="flex-1 mb-0"
                    key={key}
                    {...restField}
                    name={name}
                    rules={[
                      {
                        required: true,
                        message: t("products.tagRequired") as string,
                      },
                    ]}
                  >
                    <Input
                      placeholder={t("products.enterTag") as string}
                      size="small"
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                    className="min-w-8 h-6"
                  />
                </div>
              ))}
              <Form.Item className="mb-0">
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  size="small"
                  className="w-full"
                >
                  {t("products.addTag") as string}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* SEO */}
      <Card title={t("common.seo") as string} className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="metaTitle"
              label={t("products.metaTitle") as string}
              rules={[
                {
                  max: 60,
                  message: t("products.metaTitleMaxLength") as string,
                },
              ]}
            >
              <Input
                placeholder={t("products.enterMetaTitle") as string}
                showCount
                maxLength={60}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="metaDescription"
              label={t("products.metaDescription") as string}
              rules={[
                {
                  max: 160,
                  message: t("products.metaDescriptionMaxLength") as string,
                },
              ]}
            >
              <TextArea
                rows={3}
                placeholder={t("products.enterMetaDescription") as string}
                showCount
                maxLength={160}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default ProductForm;
