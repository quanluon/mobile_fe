import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Input,
  Row,
  Col,
  Tag,
  Popconfirm,
  App,
  type TableProps,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCategoriesStore } from '../../stores/categories';
import { categoriesApi } from '../../lib/api/categories';
import type { Category } from '../../types';
import { MESSAGES, TABLE_CONFIG } from '../../lib/constants';
import { useTranslation } from '../../hooks/useTranslation';

type TableChangeHandler = NonNullable<TableProps<Category>['onChange']>;

const { Title } = Typography;
const { Search } = Input;

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    categories,
    filters,
    isLoading,
    setCategories,
    setFilters,
    setPagination,
    setLoading,
    removeCategory,
  } = useCategoriesStore();
  const { message } = App.useApp();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getCategories(filters.search);
      setCategories(response.data);
      // setPagination(response.pagination);
    } catch (error: unknown) {
      message.error('Failed to fetch categories');
      console.error('Categories fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, setCategories, setPagination, message]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleTableChange: TableChangeHandler = (pagination, _filters, sorter) => {
    const sortInfo = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilters({
      page: pagination.current,
      limit: pagination.pageSize,
      sort: sortInfo?.field as string,
      order: sortInfo?.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.deleteCategory(id);
      removeCategory(id);
      message.success(MESSAGES.SUCCESS.DELETE);
    } catch (error: unknown) {
      message.error('Failed to delete category');
      console.error('Delete category error:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map(id => categoriesApi.deleteCategory(id as string)));
      selectedRowKeys.forEach(id => removeCategory(id as string));
      setSelectedRowKeys([]);
      message.success(`Deleted ${selectedRowKeys.length} categories successfully`);
    } catch (error: unknown) {
      message.error('Failed to delete categories');
      console.error('Bulk delete categories error:', error);
    }
  };

  const columns = [
    {
      title: t('common.name') as string,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Category) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: t('common.description') as string,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('common.status') as string,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.active') as string : t('common.inactive') as string}
        </Tag>
      ),
    },
    {
      title: t('common.createdAt') as string,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('common.actions') as string,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/categories/${record._id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/categories/${record._id}/edit`)}
          />
          <Popconfirm
            title={t('categories.confirmDelete') as string}
            onConfirm={() => handleDelete(record._id)}
            okText={t('common.yes') as string}
            cancelText={t('common.no') as string}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>{t('categories.title') as string}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/categories/create')}
        >
          {t('categories.addCategory') as string}
        </Button>
      </div>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder={t('categories.searchCategories') as string}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={t('categories.confirmBulkDelete') as string}
                  onConfirm={handleBulkDelete}
                  okText={t('common.yes') as string}
                  cancelText={t('common.no') as string}
                >
                  <Button danger>
                    {t('categories.deleteSelected') as string} ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
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

export default Categories;
