import {
  ArrowLeftOutlined,
  EditOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  PrinterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { ordersApi } from "../../lib/api/orders";
import { formatCurrency } from "../../lib/utils/currency";
import { useOrdersStore } from "../../stores/orders";
import type { Order, OrderItem, OrderStatus, PaymentStatus } from "../../types";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OrderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const { currentOrder, setCurrentOrder, setLoading, updateOrder } =
    useOrdersStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Status and payment status options
  const statusOptions = [
    { value: "pending", label: t("orders.status.pending"), color: "orange" },
    { value: "confirmed", label: t("orders.status.confirmed"), color: "blue" },
    {
      value: "processing",
      label: t("orders.status.processing"),
      color: "purple",
    },
    { value: "shipped", label: t("orders.status.shipped"), color: "cyan" },
    { value: "delivered", label: t("orders.status.delivered"), color: "green" },
    { value: "cancelled", label: t("orders.status.cancelled"), color: "red" },
  ];

  const paymentStatusOptions = [
    {
      value: "pending",
      label: t("orders.paymentStatus.pending"),
      color: "orange",
    },
    { value: "paid", label: t("orders.paymentStatus.paid"), color: "green" },
    { value: "failed", label: t("orders.paymentStatus.failed"), color: "red" },
    {
      value: "refunded",
      label: t("orders.paymentStatus.refunded"),
      color: "blue",
    },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: t("orders.paymentMethods.cash") },
    { value: "bank_transfer", label: t("orders.paymentMethods.bank_transfer") },
    { value: "momo", label: t("orders.paymentMethods.momo") },
    { value: "zalopay", label: t("orders.paymentMethods.zalopay") },
  ];

  // Fetch order details
  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await ordersApi.getOrderById(id);
      console.log("response", response);

      setCurrentOrder(response.data);
    } catch (error: unknown) {
      message.error(
        (error as Error).message || "Failed to fetch order details"
      );
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  // Handle order update
  const handleUpdateOrder = async (values: Partial<Order>) => {
    if (!currentOrder) return;

    try {
      const response = await ordersApi.updateOrder(currentOrder._id, values);
      updateOrder(currentOrder._id, values);
      setCurrentOrder(response.data);
      setEditModalVisible(false);
      message.success(t("orders.messages.orderUpdated") as string);
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to update order");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!currentOrder) return;

    try {
      const response = await ordersApi.updateOrder(currentOrder._id, {
        status,
      });
      updateOrder(currentOrder._id, { status });
      setCurrentOrder(response.data);
      message.success(t("orders.messages.statusUpdated") as string);
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to update order status");
    }
  };

  // Handle payment status update
  const handlePaymentStatusUpdate = async (paymentStatus: PaymentStatus) => {
    if (!currentOrder) return;

    try {
      const response = await ordersApi.updateOrder(currentOrder._id, {
        paymentStatus,
      });
      updateOrder(currentOrder._id, { paymentStatus });
      setCurrentOrder(response.data);
      message.success(t("orders.messages.paymentStatusUpdated") as string);
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to update payment status");
    }
  };

  // Order items table columns
  const orderItemsColumns: ColumnsType<OrderItem> = [
    {
      title: t("orders.detail.product") as string,
      key: "product",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.product.images && record.product.images.length > 0 && (
            <Image
              src={record.product.images[0]}
              alt={record.product.name}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 4 }}
            />
          )}
          <div>
            <Link to={`/products/${record.product._id}`} style={{ fontWeight: 500 }}>{record.product.name}</Link>
            {record.variant && (
              <div style={{ fontSize: "12px", color: "#666" }}>
                {record.variant.color} •{" "}
                {record.variant.storage || record.variant.size}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t("orders.detail.quantity") as string,
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center",
    },
    {
      title: t("orders.detail.price") as string,
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: t("orders.detail.total") as string,
      key: "total",
      width: 120,
      render: (_, record) => formatCurrency(record.price * record.quantity),
    },
  ];

  // Initialize form when order is loaded
  useEffect(() => {
    if (currentOrder) {
      form.setFieldsValue({
        status: currentOrder.status,
        paymentStatus: currentOrder.paymentStatus,
        notes: currentOrder.notes,
        paymentMethod: currentOrder.paymentMethod,
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
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/orders")}
          >
            {t("common.back") as string}
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            {t("orders.detail.title") as string} #{currentOrder.orderNumber}
          </Title>
        </Space>
        <Space>
          <Button icon={<PrinterOutlined />}>
            {t("orders.detail.print") as string}
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/orders/${currentOrder._id}/edit`)}
          >
            {t("orders.detail.editOrder") as string}
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Order Information */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <>
                <FileTextOutlined />
                {t("orders.detail.orderInfo")}
              </>
            }
          >
            <Descriptions column={2} bordered>
              <Descriptions.Item
                label={t("orders.detail.orderNumber") as string}
              >
                <Text strong>#{currentOrder.orderNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("orders.detail.orderDate") as string}>
                {dayjs(currentOrder.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label={t("orders.detail.status") as string}>
                <Select
                  value={currentOrder.status}
                  style={{ width: 150 }}
                  onChange={handleStatusUpdate}
                >
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item
                label={t("orders.detail.paymentStatus") as string}
              >
                <Select
                  value={currentOrder.paymentStatus}
                  style={{ width: 150 }}
                  onChange={handlePaymentStatusUpdate}
                >
                  {paymentStatusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item
                label={t("orders.detail.paymentMethod") as string}
              >
                <Select
                  value={currentOrder.paymentMethod}
                  style={{ width: 200 }}
                  onChange={(value) =>
                    handleUpdateOrder({ paymentMethod: value })
                  }
                >
                  {paymentMethodOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label={t("orders.detail.total") as string}>
                <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
                  {formatCurrency(currentOrder.totalAmount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Order Items */}
          <Card
            title={t("orders.detail.orderItems") as string}
            style={{ marginTop: 24 }}
          >
            <Table
              columns={orderItemsColumns}
              dataSource={currentOrder.items}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Customer & Shipping Information */}
        <Col xs={24} lg={8}>
          {/* Customer Information */}
          <Card
            title={
              <>
                <UserOutlined />
                {t("orders.detail.customerInfo")}
              </>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={t("orders.detail.customerName") as string}
              >
                {currentOrder.customer.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("orders.detail.customerEmail") as string}
              >
                {currentOrder.customer.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={t("orders.detail.customerPhone") as string}
              >
                {currentOrder.customer.phone}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Shipping Address */}
          {currentOrder.shippingAddress && (
            <Card
              title={
                <>
                  <EnvironmentOutlined />
                  {t("orders.detail.shippingAddress")}
                </>
              }
              style={{ marginTop: 24 }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={t("orders.detail.recipientName") as string}
                >
                  {currentOrder.shippingAddress.fullName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("orders.detail.recipientPhone") as string}
                >
                  {currentOrder.shippingAddress.phone}
                </Descriptions.Item>
                <Descriptions.Item label={t("orders.detail.address") as string}>
                  {currentOrder.shippingAddress.address}
                </Descriptions.Item>
                <Descriptions.Item label={t("orders.detail.city") as string}>
                  {currentOrder.shippingAddress.city}
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("orders.detail.district") as string}
                >
                  {currentOrder.shippingAddress.district}
                </Descriptions.Item>
                <Descriptions.Item label={t("orders.detail.ward") as string}>
                  {currentOrder.shippingAddress.ward}
                </Descriptions.Item>
                {currentOrder.shippingAddress.postalCode && (
                  <Descriptions.Item
                    label={t("orders.detail.postalCode") as string}
                  >
                    {currentOrder.shippingAddress.postalCode}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          )}

          {/* Order Notes */}
          {currentOrder.notes && (
            <Card
              title={t("orders.detail.notes") as string}
              style={{ marginTop: 24 }}
            >
              <Text>{currentOrder.notes}</Text>
            </Card>
          )}
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal
        title={t("orders.detail.editOrder") as string}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateOrder}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label={t("orders.detail.status") as string}
              >
                <Select>
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentStatus"
                label={t("orders.detail.paymentStatus") as string}
              >
                <Select>
                  {paymentStatusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="paymentMethod"
            label={t("orders.detail.paymentMethod") as string}
          >
            <Select>
              {paymentMethodOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="notes" label={t("orders.detail.notes") as string}>
            <TextArea rows={4} />
          </Form.Item>

          {currentOrder.shippingAddress && (
            <>
              <Divider>{t("orders.detail.shippingAddress") as string}</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label={t("orders.detail.recipientName") as string}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label={t("orders.detail.recipientPhone") as string}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="address"
                label={t("orders.detail.address") as string}
              >
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="city"
                    label={t("orders.detail.city") as string}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="district"
                    label={t("orders.detail.district") as string}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="ward"
                    label={t("orders.detail.ward") as string}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="postalCode"
                label={t("orders.detail.postalCode") as string}
              >
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
