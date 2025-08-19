
// lib/fileUpload.ts
import { writeFile, mkdir, unlink, access } from 'fs/promises';
import path from 'path';
import { generateFileName, validateFile, UploadConfig, DEFAULT_UPLOAD_CONFIG } from './uploadUtils';

export interface UploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  type?: string;
  error?: string;
}

export class FileUploadService {
  private config: UploadConfig;
  private uploadPath: string;

  constructor(config: UploadConfig = DEFAULT_UPLOAD_CONFIG) {
    this.config = config;
    this.uploadPath = path.join(process.cwd(), 'public', config.uploadDir);
  }

  async ensureUploadDirectory(): Promise<void> {
    try {
      await access(this.uploadPath);
    } catch {
      await mkdir(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<UploadResult> {
    try {
      // Validate file
      const validation = validateFile(file, this.config);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Ensure upload directory exists
      await this.ensureUploadDirectory();

      // Generate unique filename
      const filename = generateFileName(file.name);
      const filepath = path.join(this.uploadPath, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Return success response
      const publicUrl = `/${this.config.uploadDir}/${filename}`;
      
      return {
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type
      };

    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(this.uploadPath, filename);
      await unlink(filepath);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(this.uploadPath, filename);
      await access(filepath);
      return true;
    } catch {
      return false;
    }
  }
}