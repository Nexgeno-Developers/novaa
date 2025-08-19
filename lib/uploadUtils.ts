// lib/uploadUtils.ts
export interface UploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  uploadDir: string;
}

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxSize: 40 * 1024 * 1024, // 40MB
  allowedTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/mov',
    'video/avi'
  ],
  uploadDir: 'uploads'
};

export function validateFile(file: File, config: UploadConfig = DEFAULT_UPLOAD_CONFIG) {
  const errors: string[] = [];

  // Check file size
  if (file.size > config.maxSize) {
    errors.push(`File size must be less than ${(config.maxSize / (1024 * 1024)).toFixed(1)}MB`);
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push('File name is too long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function generateFileName(originalName: string): string {
  // Remove special characters and spaces
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  return `${timestamp}_${randomString}_${cleanName}`;
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}
