import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  secure_url?: string;
  format?: string;
  resource_type?: string;
  bytes?: number;
  width?: number;
  height?: number;
  created_at?: string;
  error?: string;
}

export interface CloudinarySearchResult {
  resources: Array<{
    public_id: string;
    format: string;
    version: number;
    resource_type: "image" | "video" | "raw" | "auto"; // Added "raw" and "auto"
    type: string;
    created_at: string;
    bytes: number;
    width?: number;
    height?: number;
    url: string;
    secure_url: string;
    folder?: string;
    tags?: string[];
  }>;
  total_count: number;
  time: number;
  next_cursor?: string;
}

export type SearchFilesParams = {
  query?: string;
  resourceType?: "image" | "video" | "raw" | "file"; // Added "raw" and "file"
  maxResults?: number;   // default 20
  nextCursor?: string;
};

export class CloudinaryService {
  private folder = "cms-media-novaa"; // Folder to organize uploads

  async uploadFile(
    file: File,
    folder?: string
  ): Promise<CloudinaryUploadResult> {
    try {
      // Convert File to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${base64}`;

      const timestamp = Date.now();
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const cleanName = originalName.replace(/[^a-zA-Z0-9-_]/g, "_");

      // UPDATED: Better resource type detection
      let resourceType: "image" | "video" | "raw" = "raw";
      if (file.type.startsWith('image/')) {
        resourceType = "image";
      } else if (file.type.startsWith('video/')) {
        resourceType = "video";
      } else {
        // Documents, PDFs, etc. should be uploaded as 'raw'
        resourceType = "raw";
      }

      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder || this.folder,
        resource_type: resourceType, // Use detected resource type instead of "auto"
        quality: resourceType === "image" ? "auto:good" : undefined,
        fetch_format: resourceType === "image" ? "auto" : undefined,
        public_id: `${cleanName}_${timestamp}`,
        overwrite: false,
      });

      return {
        success: true,
        url: result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  async deleteFile(
    publicId: string,
    resourceType: "image" | "video" | "raw" | "auto" = "auto" // Changed default to "auto"
  ): Promise<boolean> {
    try {
      console.log("Deleting:", publicId, resourceType);
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      console.log("Delete result:", result);
      return result.result === "ok";
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      return false;
    }
  }

  // UPDATED: Enhanced search with resource_type support
  async searchFiles(
    query?: string,
    resourceType?: "image" | "video" | "file" | "raw" | "auto",
    maxResults: number = 20,
    nextCursor?: string,
    resource_type?: "image" | "video" | "raw" | "auto" // New parameter
  ): Promise<CloudinarySearchResult> {
    try {
      console.log("Search params:", { query, resourceType, resource_type, maxResults, nextCursor });
      
      let searchExpression = `folder:${this.folder}`;

      // Use resource_type parameter if provided, otherwise fall back to resourceType
      const typeFilter = resource_type || resourceType;
      
      if (typeFilter) {
        if (typeFilter === 'file') {
          // For 'file' type, search for 'raw' resource type
          searchExpression += ` AND resource_type:raw`;
        } else {
          searchExpression += ` AND resource_type:${typeFilter}`;
        }
      } else {
        // If no type specified, include all types
        searchExpression += ` AND (resource_type:image OR resource_type:video OR resource_type:raw)`;
      }

      if (query && query.trim()) {
        // Search in both filename and public_id
        searchExpression += ` AND (filename:*${query.trim()}* OR public_id:*${query.trim()}*)`;
      }

      console.log("Final search expression:", searchExpression);

      const searchParams: {
        expression: string;
        sort_by: [string, "asc" | "desc"][];
        max_results: number;
        next_cursor?: string;
      } = {
        expression: searchExpression,
        sort_by: [["created_at", "desc"]],
        max_results: maxResults,
      };

      if (nextCursor) {
        searchParams.next_cursor = nextCursor;
      }

      const searchResult = await cloudinary.search
        .expression(searchExpression)
        .sort_by("created_at", "desc")
        .max_results(maxResults)
        .next_cursor(nextCursor)
        .execute();

      console.log("Search result:", {
        found: searchResult.resources?.length || 0,
        total: searchResult.total_count || 0,
        resourceTypes: [...new Set(searchResult.resources?.map((r: any) => r.resource_type) || [])],
        formats: [...new Set(searchResult.resources?.map((r: any) => r.format) || [])]
      });

      return {
        resources: searchResult.resources || [],
        total_count: searchResult.total_count || 0,
        time: searchResult.time || 0,
        next_cursor: searchResult.next_cursor,
      };
    } catch (error) {
      console.error("Cloudinary search error:", error);
      return {
        resources: [],
        total_count: 0,
        time: 0,
      };
    }
  }

  // UPDATED: Alternative search method with enhanced filtering
  async searchFilesAlternative(
    query?: string,
    resourceType?: "image" | "video" | "file" | "raw" | "auto",
    maxResults: number = 20,
    nextCursor?: string,
    resource_type?: "image" | "video" | "raw" | "auto"
  ): Promise<CloudinarySearchResult> {
    try {
      // Get all files first, then filter locally if query is provided
      let searchExpression = `folder:${this.folder}`;

      // Use resource_type parameter if provided, otherwise fall back to resourceType
      const typeFilter = resource_type || resourceType;
      
      if (typeFilter) {
        if (typeFilter === 'file') {
          searchExpression += ` AND resource_type:raw`;
        } else {
          searchExpression += ` AND resource_type:${typeFilter}`;
        }
      } else {
        // Include all types
        searchExpression += ` AND (resource_type:image OR resource_type:video OR resource_type:raw)`;
      }

      console.log("Alternative search expression:", searchExpression);

      const searchResult = await cloudinary.search
        .expression(searchExpression)
        .sort_by("created_at", "desc")
        .max_results(query ? 100 : maxResults) // Get more results if we need to filter
        .next_cursor(nextCursor)
        .execute();

      let filteredResources = searchResult.resources || [];

      // If query provided, filter results locally
      if (query && query.trim()) {
        const queryLower = query.trim().toLowerCase();
        filteredResources = filteredResources.filter((resource: { public_id: string; }) => {
          const filename = resource.public_id.split('/').pop() || '';
          return filename.toLowerCase().includes(queryLower);
        });
      }

      // Limit results if we filtered locally
      if (query) {
        filteredResources = filteredResources.slice(0, maxResults);
      }

      console.log("Alternative search result:", {
        found: filteredResources.length,
        total: query ? filteredResources.length : searchResult.total_count,
        resourceTypes: [...new Set(filteredResources.map((r: any) => r.resource_type))],
        formats: [...new Set(filteredResources.map((r: any) => r.format))]
      });

      return {
        resources: filteredResources,
        total_count: query ? filteredResources.length : searchResult.total_count,
        time: searchResult.time || 0,
        next_cursor: query ? undefined : searchResult.next_cursor, // Disable pagination for searches
      };
    } catch (error) {
      console.error("Cloudinary alternative search error:", error);
      return {
        resources: [],
        total_count: 0,
        time: 0,
      };
    }
  }

  async getAllFiles(
    resourceType?: "image" | "video" | "raw" | "file",
    maxResults: number = 20,
    nextCursor?: string
  ): Promise<CloudinarySearchResult> {
    return this.searchFiles(undefined, resourceType, maxResults, nextCursor);
  }

  // Get optimized URL for display
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      quality: options.quality || "auto:good",
      format: options.format || "auto",
      crop: "fill",
    });
  }
}