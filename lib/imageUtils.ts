/**
 * Image optimization utilities for better performance
 */

/**
 * Ensure URL uses HTTPS protocol (for Cloudinary and other URLs)
 */
export function ensureHttps(url: string): string {
  if (!url) return url;
  return url.replace(/^http:\/\//, "https://");
}

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
    // Force HTTPS protocol
    const httpsUrl = url.replace(/^http:\/\//, "https://");
    const urlObj = new URL(httpsUrl);
    const pathParts = urlObj.pathname.split("/");
    const cloudNameIndex = pathParts.findIndex((part) =>
      part.includes("cloudinary")
    );
    
    if (cloudNameIndex === -1) return httpsUrl;

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
    
    // Build new URL - ensure HTTPS
    const transformString = transformations.join(",");
    const newPath = `/image/upload/${transformString}/${publicId}`;
    
    urlObj.protocol = "https:";
    urlObj.pathname = newPath;
    return urlObj.toString();
  } catch (error) {
    console.error("Error optimizing Cloudinary URL:", error);
    // Return original URL with HTTPS forced
    return url.replace(/^http:\/\//, "https://");
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
  // Ensure HTTPS first
  const httpsSrc = ensureHttps(src);
  
  // If it's a Cloudinary URL, optimize it
  if (httpsSrc.includes("cloudinary.com")) {
    const optimizedSrc = optimizeCloudinaryUrl(httpsSrc, {
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
    src: httpsSrc,
    quality: options.quality || 75,
    priority: options.priority || false,
  };
}

