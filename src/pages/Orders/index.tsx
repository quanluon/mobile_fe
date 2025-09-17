import { EyeOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { ordersApi } from "../../lib/api/orders";
import { formatCurrency } from "../../lib/utils/currency";
import { useOrdersStore } from "../../stores/orders";
import type {
  Order,
  OrderFilters,
  OrderStatus,
  PaymentStatus,
} from "../../types";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const {
    orders,
    loading,
    filters,
    pagination,
    setOrders,
    setLoading,
    setError,
    setFilters,
    setPagination,
    updateOrder,
    clearError,
  } = useOrdersStore();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const response = await ordersApi.getOrders(filters);
      setOrders(response.data);
      setPagination(response.pagination!);
    } catch (error: unknown) {
      setError((error as Error).message || "Failed to fetch orders");
      message.error(t("messages.error.serverError") as string);
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    setLoading,
    clearError,
    setOrders,
    setPagination,
    setError,
    message,
    t,
  ]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof OrderFilters,
    value: string | undefined
  ) => {
    setFilters({ [key]: value, page: 1 });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  // Handle date range change
  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      setFilters({
        dateFrom: dates[0].format("YYYY-MM-DD"),
        dateTo: dates[1].format("YYYY-MM-DD"),
        page: 1,
      });
    } else {
      setFilters({ dateFrom: undefined, dateTo: undefined, page: 1 });
    }
  };

  // Handle table change (pagination, sorting)
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _tableFilters: Record<string, any>,
    sorter: any
  ) => {
    const newFilters: Partial<OrderFilters> = {
      page: pagination.current,
      limit: pagination.pageSize,
    };

    if (sorter && sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    setFilters(newFilters);
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await ordersApi.updateOrder(orderId, { status });
      updateOrder(orderId, { status });
      message.success(t("orders.messages.statusUpdated") as string);
    } catch (error: unknown) {
      message.error(
        (error as Error).message || "Failed to update order status"
      );
    }
  };

  // Handle payment status update
  const handlePaymentStatusUpdate = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ) => {
    try {
      await ordersApi.updateOrder(orderId, { paymentStatus });
      updateOrder(orderId, { paymentStatus });
      message.success(t("orders.messages.paymentStatusUpdated") as string);
    } catch (error: unknown) {
      message.error(
        (error as Error).message || "Failed to update payment status"
      );
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: OrderStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning(t("orders.messages.selectOrders") as string);
      return;
    }

    try {
      const response = await ordersApi.bulkUpdateOrders(
        selectedRowKeys as string[],
        { status }
      );
      message.success(
        t("orders.messages.bulkStatusUpdated", {
          success: response.data.summary.success,
          total: response.data.summary.total,
        }) as string
      );
      setSelectedRowKeys([]);
      fetchOrders();
    } catch (error: unknown) {
      message.error((error as Error).message || "Failed to update orders");
    }
  };

  // Handle order deletion
  // const handleDeleteOrder = async (orderId: string) => {
  //   try {
  //     await ordersApi.deleteOrder(orderId);
  //     removeOrder(orderId);
  //     message.success(t('orders.messages.orderDeleted') as string);
  //   } catch (error: unknown) {
  //     message.error((error as Error).message || 'Failed to delete order');
  //   }
  // };

  // Table columns
  const columns: ColumnsType<Order> = [
    {
      title: t("orders.table.orderNumber") as string,
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 120,
      render: (text: string, record: Order) => (
        <Button type="link" onClick={() => navigate(`/orders/${record._id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: t("orders.table.customer") as string,
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.customer.name || "N/A"}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.customer.email || record.customer.phone}
          </div>
        </div>
      ),
    },
    {
      title: t("orders.table.items") as string,
      key: "items",
      width: 100,
      render: (_, record) => (
        <span>
          {record.items.length} {t("orders.table.itemsCount") as string}
        </span>
      ),
    },
    {
      title: t("orders.table.total") as string,
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount: number) => formatCurrency(amount),
      sorter: true,
    },
    {
      title: t("orders.table.status") as string,
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: OrderStatus, record: Order) => {
        return (
          <Select
            value={status}
            size="small"
            style={{ width: "100%" }}
            onChange={(value) => handleStatusUpdate(record._id, value)}
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                <Tag color={opt.color}>{opt.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      },
      filters: statusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
    },
    {
      title: t("orders.table.paymentStatus") as string,
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 140,
      render: (paymentStatus: PaymentStatus, record: Order) => {
        return (
          <Select
            value={paymentStatus}
            size="small"
            style={{ width: "100%" }}
            onChange={(value) => handlePaymentStatusUpdate(record._id, value)}
          >
            {paymentStatusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                <Tag color={opt.color}>{opt.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      },
      filters: paymentStatusOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
    },
    {
      title: t("orders.table.paymentMethod") as string,
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
      render: (paymentMethod: string) => {
        const method = paymentMethodOptions.find(
          (opt) => opt.value === paymentMethod
        );
        return method ? method.label : paymentMethod || "N/A";
      },
      filters: paymentMethodOptions.map((opt) => ({
        text: opt.label,
        value: opt.value,
      })),
    },
    {
      title: t("orders.table.date") as string,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      sorter: true,
    },
    {
      title: t("common.actions") as string,
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title={t("common.view") as string}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/orders/${record._id}`)}
            />
          </Tooltip>
          {/* <Tooltip title={t('common.edit') as string}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/orders/${record._id}/edit`)}
            />
          </Tooltip> */}
          {/* <Popconfirm
            title={t('orders.messages.confirmDelete') as string}
            onConfirm={() => handleDeleteOrder(record._id)}
            okText={t('common.yes') as string}
            cancelText={t('common.no') as string}
          >
            <Tooltip title={t('common.delete') as string}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [filters, fetchOrders]);

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>{t("orders.title") as string}</Title>
        <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
          {t("common.refresh") as string}
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder={t("orders.filters.search") as string}
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={t("orders.filters.status") as string}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              allowClear
              style={{ width: "100%" }}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder={t("orders.filters.paymentStatus") as string}
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              allowClear
              style={{ width: "100%" }}
            >
              {paymentStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <Tag color={option.color}>{option.label}</Tag>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              placeholder={[
                t("orders.filters.dateFrom") as string,
                t("orders.filters.dateTo") as string,
              ]}
              onChange={handleDateRangeChange}
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      </Card>

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <Space>
            <span>
              {selectedRowKeys.length} {t("orders.messages.selected") as string}
            </span>
            <Select
              placeholder={t("orders.bulkActions.updateStatus") as string}
              onChange={handleBulkStatusUpdate}
              style={{ width: 200 }}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
            <Button onClick={() => setSelectedRowKeys([])}>
              {t("common.clear") as string}
            </Button>
          </Space>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("common.of") as string} ${total} ${
                t("orders.table.items") as string
              }`,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default OrdersPage;
