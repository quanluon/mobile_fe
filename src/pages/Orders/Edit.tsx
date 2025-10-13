import {
  ArrowLeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { ordersApi } from '../../lib/api/orders';
import { useOrdersStore } from '../../stores/orders';
import { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } from '../../lib/constants';
import type { Order } from '../../types';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const EditOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { message } = App.useApp();
  
  const {
    currentOrder,
    setCurrentOrder,
    setLoading,
    updateOrder,
  } = useOrdersStore();

  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Status and payment status options from constants
  const statusOptions = ORDER_STATUSES.map(status => ({
    value: status.value,
    label: t(status.label),
    color: status.color
  }));

  const paymentStatusOptions = PAYMENT_STATUSES.map(status => ({
    value: status.value,
    label: t(status.label),
    color: status.color
  }));

  const paymentMethodOptions = PAYMENT_METHODS.map(method => ({
    value: method.value,
    label: t(method.label)
  }));

  // Fetch order details
  const fetchOrderDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await ordersApi.getOrderById(id);
      setCurrentOrder(response.data);
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to fetch order details");
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }

  // Handle form submission
  const handleSubmit = async (values: Partial<Order>) => {
    if (!currentOrder) return;

    try {
      setSaving(true);
      const response = await ordersApi.updateOrder(currentOrder._id, values);
      updateOrder(currentOrder._id, values);
      setCurrentOrder(response.data);
      message.success(t("orders.messages.orderUpdated") as string);
      navigate(`/orders/${currentOrder._id}`);
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  // Initialize form when order is loaded
  useEffect(() => {
    if (currentOrder) {
      form.setFieldsValue({
        status: currentOrder.status,
        paymentStatus: currentOrder.paymentStatus,
        paymentMethod: currentOrder.paymentMethod,
        notes: currentOrder.notes,
        ...currentOrder.shippingAddress,
      });
    }
  }, [currentOrder, form]);

  // Fetch order details on mount
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (!currentOrder) {
    return <div>{t("common.loading") as string}</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/orders/${currentOrder._id}`)}>
            {t('common.back') as string}
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            {t('orders.detail.editOrder') as string} #{currentOrder.orderNumber}
          </Title>
        </Space>
        <Button 
          type="primary" 
          icon={<SaveOutlined />} 
          loading={saving}
          onClick={() => form.submit()}
        >
          {t('common.save') as string}
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            {/* Order Status */}
            <Card title={t('orders.detail.orderInfo') as string} style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label={t('orders.detail.status') as string}
                    rules={[{ required: true, message: t('validation.required') as string }]}
                  >
                    <Select>
                      {statusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="paymentStatus"
                    label={t('orders.detail.paymentStatus') as string}
                    rules={[{ required: true, message: t('validation.required') as string }]}
                  >
                    <Select>
                      {paymentStatusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="paymentMethod"
                label={t('orders.detail.paymentMethod') as string}
              >
                <Select>
                  {paymentMethodOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="notes"
                label={t('orders.detail.notes') as string}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Card>

            {/* Shipping Address */}
            {currentOrder.shippingAddress && (
              <Card title={t('orders.detail.shippingAddress') as string}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="fullName"
                      label={t('orders.detail.recipientName') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label={t('orders.detail.recipientPhone') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="address"
                  label={t('orders.detail.address') as string}
                  rules={[{ required: true, message: t('validation.required') as string }]}
                >
                  <Input />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="city"
                      label={t('orders.detail.city') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="district"
                      label={t('orders.detail.district') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="ward"
                      label={t('orders.detail.ward') as string}
                      rules={[{ required: true, message: t('validation.required') as string }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="postalCode"
                  label={t('orders.detail.postalCode') as string}
                >
                  <Input />
                </Form.Item>
              </Card>
            )}
          </Form>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title={t('orders.detail.orderSummary') as string}>
            <div style={{ marginBottom: 16 }}>
              <strong>{t('orders.detail.orderNumber') as string}:</strong> #{currentOrder.orderNumber}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>{t('orders.detail.customer') as string}:</strong> {currentOrder.customer.name || 'N/A'}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>{t('orders.detail.total') as string}:</strong> {currentOrder.totalAmount.toLocaleString()} ₫
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>{t('orders.detail.items') as string}:</strong> {currentOrder.items.length}
            </div>
            <Divider />
            <div>
              <strong>{t('orders.detail.orderDate') as string}:</strong><br />
              {new Date(currentOrder.createdAt).toLocaleDateString()}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditOrderPage;
