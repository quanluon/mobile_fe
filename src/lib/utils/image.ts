export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'webp' | 'jpeg' | 'png';
  maintainAspectRatio?: boolean;
}

export interface ProcessedImage {
  file: File;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
}

/**
 * Process image: resize and convert to WebP for better performance
 */
export const processImage = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp',
    maintainAspectRatio = true,
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight,
          maintainAspectRatio
        );

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to desired format
        const mimeType = `image/${format}`;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to process image'));
              return;
            }

            // Create new file with processed image
            const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, `.${format}`), {
              type: mimeType,
              lastModified: Date.now(),
            });

            const originalSize = file.size;
            const processedSize = blob.size;
            const compressionRatio = Math.round(((originalSize - processedSize) / originalSize) * 100);

            resolve({
              file: processedFile,
              originalSize,
              processedSize,
              compressionRatio,
            });
          },
          mimeType,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } => {
  if (!maintainAspectRatio) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxHeight),
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Scale down if image is larger than max dimensions
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create thumbnail from image
 */
export const createThumbnail = async (
  file: File,
  size: number = 150,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate thumbnail dimensions
        const aspectRatio = img.width / img.height;
        let width = size;
        let height = size;

        if (aspectRatio > 1) {
          height = size / aspectRatio;
        } else {
          width = size * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw thumbnail
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to data URL
        const thumbnailUrl = canvas.toDataURL('image/webp', quality);
        resolve(thumbnailUrl);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to create thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Batch process multiple images
 */
export const processImages = async (
  files: File[],
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage[]> => {
  const results = await Promise.allSettled(
    files.map(file => processImage(file, options))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<ProcessedImage> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
