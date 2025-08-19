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
    resource_type: "image" | "video";
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

      // Upload to cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder || this.folder,
        resource_type: "auto",
        quality: "auto:good",
        fetch_format: "auto",
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
    resourceType: "image" | "video" | "raw" = "image"
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

  async searchFiles(
    query?: string,
    resourceType?: "image" | "video",
    maxResults: number = 20,
    nextCursor?: string
  ): Promise<CloudinarySearchResult> {
    try {
      console.log("Search params:", { query, resourceType, maxResults, nextCursor });
      
      // Start with base folder search
      let searchExpression = `folder:${this.folder}`;

      // Add resource type filter if specified
      if (resourceType) {
        searchExpression += ` AND resource_type:${resourceType}`;
      }

      // FIXED: Proper query search using filename pattern
      if (query && query.trim()) {
        // Search in the filename part of public_id (after the folder)
        // Use wildcard pattern for partial matches
        searchExpression += ` AND filename:*${query.trim()}*`;
      }

      console.log("Final search expression:", searchExpression);

      const searchParams: any = {
        expression: searchExpression,
        sort_by: [["created_at", "desc"]],
        max_results: maxResults,
      };

      // Add cursor for pagination
      if (nextCursor) {
        searchParams.next_cursor = nextCursor;
      }

      const searchResult = await cloudinary.search
        .expression(searchExpression)
        .sort_by("created_at", "desc")
        .max_results(maxResults)
        .next_cursor(nextCursor)
        .execute();
      
      console.log("Cloudinary search result:", {
        totalFound: searchResult.total_count,
        resourcesCount: searchResult.resources?.length,
        hasNextCursor: !!searchResult.next_cursor
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

  // Alternative search method if filename search doesn't work well
  async searchFilesAlternative(
    query?: string,
    resourceType?: "image" | "video",
    maxResults: number = 20,
    nextCursor?: string
  ): Promise<CloudinarySearchResult> {
    try {
      // Get all files first, then filter locally if query is provided
      let searchExpression = `folder:${this.folder}`;

      if (resourceType) {
        searchExpression += ` AND resource_type:${resourceType}`;
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
        filteredResources = filteredResources.filter(resource => {
          const filename = resource.public_id.split('/').pop() || '';
          return filename.toLowerCase().includes(queryLower);
        });
      }

      // Limit results if we filtered locally
      if (query) {
        filteredResources = filteredResources.slice(0, maxResults);
      }

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
    resourceType?: "image" | "video",
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