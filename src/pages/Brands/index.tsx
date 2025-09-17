import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Image,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { brandsApi } from '../../lib/api/brands';
import { MESSAGES, TABLE_CONFIG } from '../../lib/constants';
import { useBrandsStore } from '../../stores/brands';
import type { Brand } from '../../types';

type TableChangeHandler = NonNullable<TableProps<Brand>['onChange']>;

const { Title } = Typography;
const { Search } = Input;

const Brands: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    brands,
    filters,
    isLoading,
    setBrands,
    setFilters,
    setLoading,
    removeBrand,
  } = useBrandsStore();
  const { message } = App.useApp();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await brandsApi.getBrands(filters.search);
      setBrands(response.data);
    } catch (error: unknown) {
      message.error('Failed to fetch brands');
      console.error('Brands fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, setBrands, message]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSearch = (value: string) => {
    setFilters({ search: value });
  };

  const handleTableChange: TableChangeHandler = (_pagination, _filters, sorter) => {
    const sortInfo = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilters({
      sort: sortInfo?.field as string,
      order: sortInfo?.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await brandsApi.deleteBrand(id);
      removeBrand(id);
      message.success(MESSAGES.SUCCESS.DELETE);
    } catch (error: unknown) {
      message.error('Failed to delete brand');
      console.error('Delete brand error:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map(id => brandsApi.deleteBrand(id as string)));
      selectedRowKeys.forEach(id => removeBrand(id as string));
      setSelectedRowKeys([]);
      message.success(`Deleted ${selectedRowKeys.length} brands successfully`);
    } catch (error: unknown) {
      message.error('Failed to delete brands');
      console.error('Bulk delete brands error:', error);
    }
  };

  const columns = [
    {
      title: t('brands.logo') as string,
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string) => (
        <Image
          width={40}
          height={40}
          src={logo}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: t('common.name') as string,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text: string, record: Brand) => (
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
      title: t('brands.website') as string,
      dataIndex: 'website',
      key: 'website',
      render: (website: string) => (
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        ) : '-'
      ),
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
      title: t('common.actions') as string,
      key: 'actions',
      width: 120,
      render: (_: unknown, record: Brand) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/brands/${record._id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/brands/${record._id}/edit`)}
          />
          <Popconfirm
            title={t('brands.confirmDelete') as string}
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
        <Title level={2}>{t('brands.title') as string}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/brands/create')}
        >
          {t('brands.addBrand') as string}
        </Button>
      </div>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder={t('brands.searchBrands') as string}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={t('brands.confirmBulkDelete') as string}
                  onConfirm={handleBulkDelete}
                  okText={t('common.yes') as string}
                  cancelText={t('common.no') as string}
                >
                  <Button danger>
                    {t('brands.deleteSelected') as string} ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={brands}
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

export default Brands;
