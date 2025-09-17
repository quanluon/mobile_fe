import React, { useState } from 'react';
import { Upload, Button, Image, App, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined, CompressOutlined } from '@ant-design/icons';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useTranslation } from '../../hooks/useTranslation';
import { uploadApi } from '../../lib/api/upload';
import { processImage, isImageFile, formatFileSize, type ImageProcessingOptions } from '../../lib/utils/image';

export interface UploadFileProps {
  value?: string;
  onChange?: (url: string | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  showPreview?: boolean;
  previewWidth?: number;
  previewHeight?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Image processing options
  enableImageProcessing?: boolean;
  imageProcessingOptions?: ImageProcessingOptions;
  showCompressionInfo?: boolean;
}

const UploadFileComponent: React.FC<UploadFileProps> = ({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  showPreview = true,
  previewWidth = 100,
  previewHeight = 100,
  disabled = false,
  className,
  style,
  enableImageProcessing = true,
  imageProcessingOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    format: 'webp',
    maintainAspectRatio: true,
  },
  showCompressionInfo = true,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
  } | null>(null);

  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const { fileList } = info;

    if (fileList[0]?.originFileObj) {
      const actualFile = fileList[0].originFileObj;
      // Validate file type
      if (accept && accept !== '*') {
        const allowedTypes = accept.split(',').map(type => type.trim());
        const isValidType = allowedTypes.some(type => {
          if (type.endsWith('/*')) {
            const baseType = type.replace('/*', '');
            return actualFile.type.startsWith(baseType);
          }
          return actualFile.type === type;
        });
        
        if (!isValidType) {
          messageApi.error(t('upload.invalidFileType') as string);
          return;
        }
      }

      // Validate file size
      if (actualFile.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        messageApi.error(t('upload.fileSizeExceeded', { maxSize: maxSizeMB }) as string);
        return;
      }

      setUploading(true);
      setProcessing(false);
      setCompressionInfo(null);
      
      try {
        let fileToUpload = actualFile;
        
        // Process image if it's an image file and processing is enabled
        if (enableImageProcessing && isImageFile(actualFile)) {
          setProcessing(true);
          
          try {
            const processedResult = await processImage(actualFile, imageProcessingOptions);
            fileToUpload = processedResult.file as RcFile;
            
            // Store compression info
            setCompressionInfo({
              originalSize: processedResult.originalSize,
              processedSize: processedResult.processedSize,
              compressionRatio: processedResult.compressionRatio,
            });
            
            messageApi.success(
              t('upload.imageProcessed', { 
                compression: processedResult.compressionRatio,
                originalSize: formatFileSize(processedResult.originalSize),
                processedSize: formatFileSize(processedResult.processedSize)
              }) as string
            );
          } catch (processError) {
            console.warn('Image processing failed, using original file:', processError);
            // Continue with original file if processing fails
          } finally {
            setProcessing(false);
          }
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(fileToUpload);

        // Upload file
        const uploadResult = await uploadApi.uploadFile(fileToUpload);
        
        // Call onChange with the public URL
        onChange?.(uploadResult.publicUrl);
        
        messageApi.success(t('upload.uploadSuccess') as string);
      } catch (error) {
        console.error('Upload failed:', error);
        messageApi.error(t('upload.uploadFailed') as string);
        setPreviewUrl('');
        setCompressionInfo(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setCompressionInfo(null);
    onChange?.(null);
  };

  const displayUrl = previewUrl || value;

  return (
    <div className={className} style={style}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Upload
          accept={accept}
          showUploadList={false}
          beforeUpload={() => false} // Prevent auto upload
          onChange={handleUpload}
          disabled={disabled || uploading || processing}
        >
          <Button 
            icon={processing ? <CompressOutlined /> : <UploadOutlined />} 
            loading={uploading || processing}
            disabled={disabled}
          >
            {processing 
              ? t('upload.processing') as string 
              : uploading 
                ? t('upload.uploading') as string 
                : t('upload.selectFile') as string
            }
          </Button>
        </Upload>
        
        {displayUrl && showPreview && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Image
              src={displayUrl}
              alt="Preview"
              width={previewWidth}
              height={previewHeight}
              style={{ objectFit: 'contain', borderRadius: 4 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleRemove}
                disabled={disabled}
              >
                {t('common.remove') as string}
              </Button>
              {showCompressionInfo && compressionInfo && (
                <Tooltip title={`${formatFileSize(compressionInfo.originalSize)} → ${formatFileSize(compressionInfo.processedSize)} (${compressionInfo.compressionRatio}% smaller)`}>
                  <div style={{ 
                    fontSize: 10, 
                    color: '#52c41a', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2 
                  }}>
                    <CompressOutlined />
                    -{compressionInfo.compressionRatio}%
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!displayUrl && value && showPreview && (
        <div style={{ marginTop: 8 }}>
          <span style={{ color: '#666' }}>{t('upload.currentFile') as string}:</span>
          <br />
          <Image
            src={value}
            alt="Current file"
            width={previewWidth}
            height={previewHeight}
            style={{ objectFit: 'contain', borderRadius: 4, marginTop: 4 }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadFileComponent;
