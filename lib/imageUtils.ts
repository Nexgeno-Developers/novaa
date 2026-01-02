/**
 * Image optimization utilities for better performance
 */

/**
 * Optimize Cloudinary URL with better compression settings
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | string;
    format?: "auto" | "webp" | "avif";
  } = {}
): string {
  if (!url || !url.includes("cloudinary.com")) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const cloudNameIndex = pathParts.findIndex((part) =>
      part.includes("cloudinary")
    );
    
    if (cloudNameIndex === -1) return url;

    // Extract public_id from URL
    const publicId = pathParts.slice(cloudNameIndex + 2).join("/");
    
    // Build optimized URL with Cloudinary transformations
    const transformations: string[] = [];
    
    if (options.width || options.height) {
      transformations.push(`w_${options.width || "auto"}`);
      transformations.push(`h_${options.height || "auto"}`);
      transformations.push("c_fill");
    }
    
    // Quality optimization (75 is good balance)
    const quality = options.quality || "auto:good";
    transformations.push(`q_${quality}`);
    
    // Format optimization
    if (options.format === "auto") {
      transformations.push("f_auto"); // Auto WebP/AVIF
    } else if (options.format) {
      transformations.push(`f_${options.format}`);
    } else {
      transformations.push("f_auto");
    }
    
    // Progressive loading for JPEG
    transformations.push("fl_progressive");
    
    // Build new URL
    const transformString = transformations.join(",");
    const newPath = `/image/upload/${transformString}/${publicId}`;
    
    urlObj.pathname = newPath;
    return urlObj.toString();
  } catch (error) {
    console.error("Error optimizing Cloudinary URL:", error);
    return url;
  }
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    priority?: boolean;
  } = {}
) {
  // If it's a Cloudinary URL, optimize it
  if (src.includes("cloudinary.com")) {
    const optimizedSrc = optimizeCloudinaryUrl(src, {
      width: options.width,
      height: options.height,
      quality: options.quality || 75,
      format: "auto",
    });
    
    return {
      src: optimizedSrc,
      quality: options.quality || 75,
      priority: options.priority || false,
    };
  }
  
  return {
    src,
    quality: options.quality || 75,
    priority: options.priority || false,
  };
}

