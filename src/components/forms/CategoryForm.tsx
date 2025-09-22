import {
    Card,
    Col,
    Form,
    Input,
    Row,
    Switch,
    type FormInstance
} from 'antd';
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { type CategoryFormData } from '../../types';
import UploadFile from '../ui/UploadFile';

const { TextArea } = Input;

interface CategoryFormProps {
  form: FormInstance;
  initialValues?: Partial<CategoryFormData>;
  onSubmit: (values: CategoryFormData) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  form,
  initialValues,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{
        isActive: true,
        ...initialValues,
      }}
    >
      {/* Basic Information */}
      <Card
        title={t('categories.basicInfo') as string}
        className="mb-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label={t('common.name') as string}
              rules={[
                {
                  required: true,
                  message: t('categories.nameRequired') as string,
                },
                { min: 2, message: t('categories.nameMinLength') as string },
                { max: 100, message: t('categories.nameMaxLength') as string },
              ]}
            >
              <Input
                placeholder={t('categories.enterName') as string}
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="isActive"
              label={t('common.status') as string}
              valuePropName="checked"
            >
              <Switch
                checkedChildren={t('common.active') as string}
                unCheckedChildren={t('common.inactive') as string}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              name="description"
              label={t('common.description') as string}
              rules={[
                {
                  max: 500,
                  message: t('categories.descriptionMaxLength') as string,
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder={t('categories.enterDescription') as string}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Category Image */}
      <Card
        title={t('categories.image') as string}
        className="mb-6"
      >
        <Form.Item
          name="image"
          label={t('categories.categoryImage') as string}
        >
          <UploadFile
            value={form.getFieldValue('image')}
            onChange={(url) => {
              form.setFieldsValue({ image: url });
            }}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            showPreview={true}
            previewWidth={200}
            previewHeight={200}
          />
        </Form.Item>
        <div className="p-3 bg-blue-50 border border-blue-300 rounded-md mt-2">
          <p className="m-0 text-xs text-blue-600">
            💡 {t('categories.imageTip') as string}
          </p>
        </div>
      </Card>
    </Form>
  );
};

export default CategoryForm;
