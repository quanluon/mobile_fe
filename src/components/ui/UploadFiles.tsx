import { DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { App, Button, Card, Image, List, Upload } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import React, { useCallback, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { uploadApi } from '../../lib/api/upload';

export interface UploadFilesProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  folder?: string;
  accept?: string;
  maxSize?: number; // in bytes
  maxCount?: number;
  showPreview?: boolean;
  previewWidth?: number;
  previewHeight?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface FileItem {
  url: string;
  name: string;
  isNew?: boolean;
}

const UploadFiles: React.FC<UploadFilesProps> = React.memo(({
  value = [],
  onChange,
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxCount = 10,
  showPreview = true,
  previewWidth = 80,
  previewHeight = 80,
  disabled = false,
  className,
  style,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);

  // Convert value URLs to file items
  React.useEffect(() => {
    const items: FileItem[] = value.map(url => ({
      url,
      name: url.split('/').pop() || 'Unknown',
      isNew: false,
    }));
    
    // Only update if the file list has actually changed
    setFileList(prevFileList => {
      if (prevFileList.length !== items.length) {
        return items;
      }
      
      // Check if any URLs have changed
      const hasChanged = prevFileList.some((prevItem, index) => 
        prevItem.url !== items[index]?.url
      );
      
      return hasChanged ? items : prevFileList;
    });
  }, [value]);

  const handleUpload = useCallback(async (info: UploadChangeParam<UploadFile>) => {
    const { fileList: newFileList } = info;
    
    const newFiles = newFileList.filter(file => file.originFileObj);
    if (newFiles.length === 0) return;

    // Check max count
    if (fileList.length + newFiles.length > maxCount) {
      messageApi.error(t('upload.maxFilesExceeded', { maxCount }) as string);
      return;
    }

    setUploading(true);
    
    try {
      const filesToUpload = newFiles.map(file => file.originFileObj as File);
      
      // Validate files
      for (const file of filesToUpload) {
        // Validate file type
        if (accept && accept !== '*') {
          const allowedTypes = accept.split(',').map(type => type.trim());
          const isValidType = allowedTypes.some(type => {
            if (type.endsWith('/*')) {
              const baseType = type.replace('/*', '');
              return file.type.startsWith(baseType);
            }
            return file.type === type;
          });
          
          if (!isValidType) {
            messageApi.error(t('upload.invalidFileType') as string);
            return;
          }
        }

        // Validate file size
        if (file.size > maxSize) {
          const maxSizeMB = Math.round(maxSize / (1024 * 1024));
          messageApi.error(t('upload.fileSizeExceeded', { maxSize: maxSizeMB }) as string);
          return;
        }
      }

      // Upload files
      const uploadResult = await uploadApi.uploadMultipleFiles(filesToUpload, folder);
      
      // Add new files to the list
      const newFileItems: FileItem[] = uploadResult.uploadUrls.map((urlData, index) => ({
        url: urlData.publicUrl,
        name: filesToUpload[index].name,
        isNew: true,
      }));
      
      const updatedFileList = [...fileList, ...newFileItems];
      setFileList(updatedFileList);
      
      // Call onChange with all URLs
      onChange?.(updatedFileList.map(item => item.url));
      
      messageApi.success(t('upload.uploadSuccess') as string);
    } catch (error) {
      console.error('Upload failed:', error);
      messageApi.error(t('upload.uploadFailed') as string);
    } finally {
      setUploading(false);
    }
  }, [fileList, maxCount, maxSize, accept, folder, messageApi, t, onChange]);

  const handleRemove = useCallback((index: number) => {
    const updatedFileList = fileList.filter((_, i) => i !== index);
    setFileList(updatedFileList);
    onChange?.(updatedFileList.map(item => item.url));
  }, [fileList, onChange]);

  const handlePreview = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  return (
    <div className={className} style={style}>
      <Upload
        accept={accept}
        multiple
        showUploadList={false}
        beforeUpload={() => false} // Prevent auto upload
        onChange={handleUpload}
        disabled={disabled || uploading}
        fileList={[]}
      >
        <Button 
          icon={<UploadOutlined />} 
          loading={uploading}
          disabled={disabled || fileList.length >= maxCount}
        >
          {uploading ? t('upload.uploading') as string : t('upload.selectFiles') as string}
        </Button>
      </Upload>
      
      {fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
            {t('upload.selectedFiles') as string} ({fileList.length}/{maxCount})
          </div>
          
          {showPreview ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
              {fileList.map((item, index) => (
                <Card
                  key={index}
                  size="small"
                  hoverable
                  style={{ position: 'relative' }}
                  cover={
                    <Image
                      src={item.url}
                      alt={item.name}
                      width={previewWidth}
                      height={previewHeight}
                      style={{ objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => handlePreview(item.url)}
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    />,
                  ]}
                >
                  <div style={{ 
                    fontSize: 12, 
                    color: '#666', 
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </div>
                  {item.isNew && (
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: '#52c41a',
                      color: 'white',
                      fontSize: 10,
                      padding: '2px 4px',
                      borderRadius: 2
                    }}>
                      {t('upload.new') as string}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <List
              size="small"
              dataSource={fileList}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => handlePreview(item.url)}
                    />,
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemove(index)}
                      disabled={disabled}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={item.isNew ? t('upload.new') as string : ''}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
});

export default UploadFiles;
