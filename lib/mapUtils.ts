// Coordinate conversion utilities for responsive map display

export interface PixelCoords {
  x: number;
  y: number;
}

export interface PercentageCoords {
  top: string;
  left: string;
}

export interface MapDimensions {
  width: number;
  height: number;
}

/**
 * Convert pixel coordinates to percentage coordinates for responsive display
 * @param pixelCoords - Pixel coordinates relative to map canvas
 * @param mapDimensions - Original map dimensions
 * @returns Percentage coordinates as CSS values
 */
export function pixelToPercentage(
  pixelCoords: PixelCoords,
  mapDimensions: MapDimensions
): PercentageCoords {
  const leftPercent = (pixelCoords.x / mapDimensions.width) * 100;
  const topPercent = (pixelCoords.y / mapDimensions.height) * 100;

  return {
    left: `${leftPercent.toFixed(2)}%`,
    top: `${topPercent.toFixed(2)}%`,
  };
}

/**
 * Convert percentage coordinates back to pixel coordinates
 * @param percentageCoords - Percentage coordinates as CSS values
 * @param mapDimensions - Original map dimensions
 * @returns Pixel coordinates
 */
export function percentageToPixel(
  percentageCoords: PercentageCoords,
  mapDimensions: MapDimensions
): PixelCoords {
  const leftPercent = parseFloat(percentageCoords.left.replace("%", ""));
  const topPercent = parseFloat(percentageCoords.top.replace("%", ""));

  return {
    x: (leftPercent / 100) * mapDimensions.width,
    y: (topPercent / 100) * mapDimensions.height,
  };
}

/**
 * Convert SVG path coordinates to responsive viewBox coordinates
 * @param svgPath - Original SVG path string
 * @param originalDimensions - Original map dimensions
 * @param targetDimensions - Target responsive dimensions
 * @returns Updated SVG path with responsive coordinates
 */
export function makeSvgPathResponsive(
  svgPath: string,
  originalDimensions: MapDimensions,
  targetDimensions: MapDimensions
): string {
  const scaleX = targetDimensions.width / originalDimensions.width;
  const scaleY = targetDimensions.height / originalDimensions.height;

  // Parse SVG path and scale coordinates
  return svgPath.replace(/(\d+\.?\d*)/g, (match) => {
    const num = parseFloat(match);
    // Determine if this is an x or y coordinate based on position
    // This is a simplified approach - in production, you might want more sophisticated parsing
    return (num * scaleX).toFixed(2);
  });
}

/**
 * Get responsive map dimensions based on container size
 * @param containerWidth - Container width in pixels
 * @param containerHeight - Container height in pixels
 * @param aspectRatio - Original map aspect ratio (width/height)
 * @returns Responsive dimensions that maintain aspect ratio
 */
export function getResponsiveMapDimensions(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number
): MapDimensions {
  const containerAspectRatio = containerWidth / containerHeight;

  if (containerAspectRatio > aspectRatio) {
    // Container is wider than map aspect ratio
    return {
      width: containerHeight * aspectRatio,
      height: containerHeight,
    };
  } else {
    // Container is taller than map aspect ratio
    return {
      width: containerWidth,
      height: containerWidth / aspectRatio,
    };
  }
}

/**
 * Calculate SVG viewBox for responsive display
 * @param mapDimensions - Map dimensions
 * @returns SVG viewBox string
 */
export function getSvgViewBox(mapDimensions: MapDimensions): string {
  return `0 0 ${mapDimensions.width} ${mapDimensions.height}`;
}

/**
 * Convert coordinates for different screen sizes
 * @param coords - Coordinates to convert
 * @param fromDimensions - Source dimensions
 * @param toDimensions - Target dimensions
 * @returns Converted coordinates
 */
export function convertCoordinates(
  coords: PixelCoords,
  fromDimensions: MapDimensions,
  toDimensions: MapDimensions
): PixelCoords {
  const scaleX = toDimensions.width / fromDimensions.width;
  const scaleY = toDimensions.height / fromDimensions.height;

  return {
    x: coords.x * scaleX,
    y: coords.y * scaleY,
  };
}
