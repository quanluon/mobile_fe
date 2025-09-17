import { api } from './config';

export interface UploadUrlResponse {
  url: string;
  key: string;
  publicUrl: string;
}

export interface MultipleUploadUrlsResponse {
  uploadUrls: Array<{
    fileName: string;
    fileType: string;
    fileSize?: number;
    url: string;
    key: string;
    publicUrl: string;
  }>;
}

export interface FileInfoResponse {
  fileKey: string;
  publicUrl: string;
}

export interface MoveToPermanentResponse {
  key: string;
  publicUrl: string;
}

export interface MoveMultipleToPermanentResponse {
  results: MoveToPermanentResponse[];
}

export interface UploadFileParams {
  fileName: string;
  fileType: string;
  fileSize?: number;
  folder?: string;
}

export interface UploadMultipleFilesParams {
  files: UploadFileParams[];
  folder?: string;
}

export interface DeleteFileParams {
  fileKey: string;
}

export interface MoveToPermanentParams {
  fileKey: string;
  folder?: string;
}

export interface MoveMultipleToPermanentParams {
  fileKeys: string[];
  folder?: string;
}

export const uploadApi = {
  // Get presigned URL for single file upload
  getPresignedUrl: async (params: UploadFileParams): Promise<UploadUrlResponse> => {
    const response = await api.post<UploadUrlResponse>('files/upload-url', params);
    return response.data;
  },

  // Get presigned URLs for multiple files
  getMultiplePresignedUrls: async (params: UploadMultipleFilesParams): Promise<MultipleUploadUrlsResponse> => {
    const response = await api.post<MultipleUploadUrlsResponse>('files/upload-urls', params);
    return response.data;
  },

  // Delete file from S3
  deleteFile: async (params: DeleteFileParams): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('files/delete', { data: params });
    return response.data;
  },

  // Get file info (public URL)
  getFileInfo: async (fileKey: string): Promise<FileInfoResponse> => {
    const response = await api.get<FileInfoResponse>(`files/info/${fileKey}`);
    return response.data;
  },

  // Move file from upload folder to permanent folder
  moveToPermanent: async (params: MoveToPermanentParams): Promise<MoveToPermanentResponse> => {
    const response = await api.post<MoveToPermanentResponse>('files/move-permanent', params);
    return response.data;
  },

  // Move multiple files from upload folder to permanent folder
  moveMultipleToPermanent: async (params: MoveMultipleToPermanentParams): Promise<MoveMultipleToPermanentResponse> => {
    const response = await api.post<MoveMultipleToPermanentResponse>('files/move-multiple-permanent', params);
    return response.data;
  },

  // Upload file directly to S3 using presigned URL
  uploadFileToS3: async (file: File, presignedUrl: string): Promise<void> => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  },

  // Complete upload process: get presigned URL and upload file
  uploadFile: async (file: File): Promise<UploadUrlResponse> => {
    // Get presigned URL
    const presignedData = await uploadApi.getPresignedUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    // Upload file to S3
    await uploadApi.uploadFileToS3(file, presignedData.url);

    return presignedData;
  },

  // Complete upload process for multiple files
  uploadMultipleFiles: async (files: File[], folder: string = 'uploads'): Promise<MultipleUploadUrlsResponse> => {
    // Prepare file data
    const fileData = files.map(file => ({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }));

    // Get presigned URLs
    const presignedData = await uploadApi.getMultiplePresignedUrls({
      files: fileData,
      folder,
    });

    // Upload all files to S3
    await Promise.all(
      presignedData.uploadUrls.map((urlData, index) =>
        uploadApi.uploadFileToS3(files[index], urlData.url)
      )
    );

    return presignedData;
  },

  // Complete upload and move to permanent folder
  uploadAndMoveToPermanent: async (file: File, permanentFolder: string = 'products'): Promise<MoveToPermanentResponse> => {
    // Upload to temporary folder
    const uploadResult = await uploadApi.uploadFile(file);
    
    // Move to permanent folder
    const permanentResult = await uploadApi.moveToPermanent({
      fileKey: uploadResult.key,
      folder: permanentFolder,
    });

    return permanentResult;
  },

  // Complete upload and move multiple files to permanent folder
  uploadMultipleAndMoveToPermanent: async (files: File[], permanentFolder: string = 'products'): Promise<MoveMultipleToPermanentResponse> => {
    // Upload to temporary folder
    const uploadResult = await uploadApi.uploadMultipleFiles(files, 'uploads');
    
    // Move to permanent folder
    const permanentResult = await uploadApi.moveMultipleToPermanent({
      fileKeys: uploadResult.uploadUrls.map(url => url.key),
      folder: permanentFolder,
    });

    return permanentResult;
  },
};
