import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Col,
  Image,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TablePaginationConfig,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { productsApi } from "../../lib/api/products";
import {
  MESSAGES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  TABLE_CONFIG,
} from "../../lib/constants";
import { formatCurrency } from "../../lib/utils/currency";
import { useProductsStore } from "../../stores/products";
import type {
  Product,
  ProductFilters,
  ProductStatus,
  ProductType,
} from "../../types";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { logger } from "../../lib/utils/logger";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    products,
    filters,
    pagination,
    isLoading,
    setProducts,
    setFilters,
    setPagination,
    setLoading,
    removeProduct,
  } = useProductsStore();
  const { message } = App.useApp();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productsApi.getProducts(filters);
      setProducts(response.data);
      setPagination({ ...response?.pagination });
    } catch (error: unknown) {
      message.error("Failed to fetch products");
      logger.error({ error, filters }, "Products fetch error");
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, setProducts, setPagination, message]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleFilterChange = (key: keyof ProductFilters, value: unknown) => {
    setFilters({ [key]: value, page: 1 });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: Record<string, FilterValue | null>,
    sorter: SorterResult<Product> | SorterResult<Product>[]
  ) => {
    const sortInfo = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilters({
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sortInfo.field as string,
      order: sortInfo.order === "ascend" ? "asc" : "desc",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await productsApi.deleteProduct(id);
      removeProduct(id);
      message.success(MESSAGES.SUCCESS.DELETE);
    } catch (error: unknown) {
      message.error("Failed to delete product");
      logger.error({ error, productId: id }, "Delete product error");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await productsApi.bulkDeleteProducts(selectedRowKeys as string[]);
      selectedRowKeys.forEach((id) => removeProduct(id as string));
      setSelectedRowKeys([]);
      message.success(
        `Deleted ${selectedRowKeys.length} products successfully`
      );
    } catch (error: unknown) {
      message.error("Failed to delete products");
      logger.error({ error, productIds: selectedRowKeys }, "Bulk delete products error");
    }
  };

  const columns = [
    {
      title: t("common.image") as string,
      dataIndex: "images",
      key: "images",
      width: 80,
      render: (images: string[]) => (
        <Image
          width={40}
          height={40}
          src={images[0]}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: t("common.name") as string,
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: t("products.category") as string,
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: t("products.brand") as string,
      dataIndex: ["brand", "name"],
      key: "brand",
    },
    {
      title: t("products.productType") as string,
      dataIndex: "productType",
      key: "productType",
      render: (type: ProductType) => (
        <Tag color="blue">{t(`productTypes.${type}`) as string}</Tag>
      ),
    },
    {
      title: t("common.price") as string,
      dataIndex: "basePrice",
      key: "basePrice",
      sorter: true,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: t("common.status") as string,
      dataIndex: "status",
      key: "status",
      render: (status: ProductStatus) => {
        const statusConfig = PRODUCT_STATUSES.find((s) => s.value === status);
        return (
          <Tag color={statusConfig?.color}>
            {t(`statuses.${status}`) as string}
          </Tag>
        );
      },
    },
    {
      title: t("common.featured") as string,
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (isFeatured: boolean) => (
        <Tag color={isFeatured ? "green" : "default"}>
          {isFeatured
            ? (t("common.yes") as string)
            : (t("common.no") as string)}
        </Tag>
      ),
    },
    {
      title: t("common.actions") as string,
      key: "actions",
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/products/${record._id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/products/${record._id}/edit`)}
          />
          <Popconfirm
            title={t("products.confirmDelete") as string}
            onConfirm={() => handleDelete(record._id)}
            okText={t("common.yes") as string}
            cancelText={t("common.no") as string}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2}>{t("products.title") as string}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/products/create")}
        >
          {t("products.addProduct") as string}
        </Button>
      </div>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder={t("products.searchProducts") as string}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder={t("products.filterByStatus") as string}
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("status", value)}
            >
              {PRODUCT_STATUSES.map((status) => (
                <Option key={status.value} value={status.value}>
                  {t(`statuses.${status.value}`) as string}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder={t("products.filterByType") as string}
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => handleFilterChange("productType", value)}
            >
              {PRODUCT_TYPES.map((type) => (
                <Option key={type.value} value={type.value}>
                  {t(`productTypes.${type.value}`) as string}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={t("products.confirmBulkDelete") as string}
                  onConfirm={handleBulkDelete}
                  okText={t("common.yes") as string}
                  cancelText={t("common.no") as string}
                >
                  <Button danger>
                    {t("products.deleteSelected") as string} (
                    {selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: TABLE_CONFIG.SHOW_SIZE_CHANGER,
            showQuickJumper: TABLE_CONFIG.SHOW_QUICK_JUMPER,
            showTotal: TABLE_CONFIG.SHOW_TOTAL,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Products;
