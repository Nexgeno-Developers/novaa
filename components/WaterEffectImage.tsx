import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WaterEffectImageProps {
  backgroundSrc: string;
  logoSrc: string;
  alt? : string;
  className? : string;
}

export const WaterEffectImage = ({ 
  backgroundSrc, 
  logoSrc, 
  alt = "water effect image",
  className = "" 
} : WaterEffectImageProps) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const animationRef = useRef(null);
  const waterCache1Ref = useRef([]);
  const waterCache2Ref = useRef([]);
  const imageDataSourceRef = useRef(null);
  const imageDataTargetRef = useRef(null);
  const dropletCounterRef = useRef(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Water effect configuration
  const config = {
    framerate: 40,
    waterDamper: 0.99,
    displacementDamper: 0.1, // Increased for more visible effect
    luminanceDamper: 0.2, // Increased for more visible waves
    randomDroplets: 8 // Reduced for more frequent droplets
  };

  const handleImageLoad = () => {
    setLoadedCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 2) { // Both background and logo loaded
        setImagesLoaded(true);
      }
      return newCount;
    });
  };

  const initializeWaterEffect = () => {
    const canvas = canvasRef.current;
    const backgroundImage = imageRef.current;
    const logoImage = logoRef.current;
    
    if (!canvas || !backgroundImage || !logoImage) return;

    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw background image
    context.drawImage(backgroundImage, 0, 0, width, height);
    
    // Draw overlay
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, width, height);
    
    // Draw logo in center
    const logoSize = Math.min(width, height) * 0.3;
    const logoX = (width - logoSize) / 2;
    const logoY = (height - logoSize) / 2;
    context.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // Initialize image data
    imageDataSourceRef.current = context.getImageData(0, 0, width, height);
    imageDataTargetRef.current = context.getImageData(0, 0, width, height);

    // Initialize water caches
    waterCache1Ref.current = [];
    waterCache2Ref.current = [];
    
    for (let x = 0; x < width + 4; x++) {
      waterCache1Ref.current[x] = [];
      waterCache2Ref.current[x] = [];
      for (let y = 0; y < height + 4; y++) {
        waterCache1Ref.current[x][y] = 0;
        waterCache2Ref.current[x][y] = 0;
      }
    }

    // Start animation
    startAnimation();
  };

  const setDroplet = (x, y, intensity = 255) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const adjustedX = Math.floor(x) + 2;
    const adjustedY = Math.floor(y) + 2;
    const width = canvas.width;
    const height = canvas.height;

    if (adjustedX > 2 && adjustedY > 2 && adjustedX < width + 1 && adjustedY < height + 1) {
      const cache1 = waterCache1Ref.current;
      
      // Create larger ripple for more visible effect
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= 2) {
            const rippleIntensity = intensity * (1 - distance / 2);
            cache1[adjustedX + dx][adjustedY + dy] = rippleIntensity;
          }
        }
      }
    }
  };

  const manipulatePixel = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const cache1 = waterCache1Ref.current;
    const cache2 = waterCache2Ref.current;
    const imageDataSource = imageDataSourceRef.current;
    const imageDataTarget = imageDataTargetRef.current;

    // Calculate water effect
    cache2[x][y] = ((cache1[x - 1][y] + cache1[x + 1][y] + cache1[x][y + 1] + cache1[x][y - 1] +
                     cache1[x - 1][y - 1] + cache1[x + 1][y + 1] + cache1[x - 1][y + 1] + cache1[x + 1][y - 1] +
                     cache1[x - 2][y] + cache1[x + 2][y] + cache1[x][y + 2] + cache1[x][y - 2]) / 6 - cache2[x][y]) * config.waterDamper;

    // Calculate positions
    const posTargetX = x - 2;
    const posTargetY = y - 2;

    let posSourceX = Math.floor(cache2[x][y] * config.displacementDamper);
    if (posSourceX < 0) posSourceX += 1;
    let posSourceY = posTargetY + posSourceX;
    posSourceX += posTargetX;

    // Keep in bounds
    posSourceX = Math.max(0, Math.min(width - 1, posSourceX));
    posSourceY = Math.max(0, Math.min(height - 1, posSourceY));

    // Calculate positions in imageData
    const posTarget = (posTargetX + posTargetY * width) * 4;
    const posSource = (posSourceX + posSourceY * width) * 4;

    // Calculate luminance
    const luminance = Math.floor(cache2[x][y] * config.luminanceDamper);

    // Apply effect
    imageDataTarget.data[posTarget] = Math.max(0, Math.min(255, imageDataSource.data[posSource] + luminance));
    imageDataTarget.data[posTarget + 1] = Math.max(0, Math.min(255, imageDataSource.data[posSource + 1] + luminance));
    imageDataTarget.data[posTarget + 2] = Math.max(0, Math.min(255, imageDataSource.data[posSource + 2] + luminance));
  };

  const tick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Random droplets
    if (config.randomDroplets) {
      dropletCounterRef.current++;
      if (dropletCounterRef.current >= config.randomDroplets) {
        setDroplet(Math.random() * width, Math.random() * height, 127);
        dropletCounterRef.current = 0;
      }
    }

    // Main water animation
    for (let x = 2; x < width + 2; x++) {
      for (let y = 2; y < height + 2; y++) {
        manipulatePixel(x, y);
      }
    }

    // Switch caches
    const temp = waterCache1Ref.current;
    waterCache1Ref.current = waterCache2Ref.current;
    waterCache2Ref.current = temp;

    // Draw to canvas
    context.putImageData(imageDataTargetRef.current, 0, 0);
  };

  const startAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    animationRef.current = setInterval(tick, Math.floor(1000 / config.framerate));
  };

  const handleCanvasInteraction = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    // Create stronger ripple on interaction
    setDroplet(x, y, 400);
  };

  const handleMouseEnter = () => {
    // Create multiple ripples when mouse enters
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Create ripples at multiple points for dramatic effect
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setDroplet(Math.random() * width, Math.random() * height, 300);
      }, i * 100);
    }
  };

  useEffect(() => {
    if (imagesLoaded) {
      initializeWaterEffect();
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [imagesLoaded]);

  return (
    <div className={`relative ${className}`}>
      {/* Hidden images for loading */}
      <img
        ref={imageRef}
        src={backgroundSrc}
        alt=""
        onLoad={handleImageLoad}
        className="hidden"
        crossOrigin="anonymous"
      />
      <img
        ref={logoRef}
        src={logoSrc}
        alt=""
        onLoad={handleImageLoad}
        className="hidden"
        crossOrigin="anonymous"
      />
      
      {/* Canvas for water effect */}
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full rounded-full cursor-pointer shadow-2xl"
        onMouseMove={handleCanvasInteraction}
        onClick={handleCanvasInteraction}
        onMouseEnter={handleMouseEnter}
        style={{ display: imagesLoaded ? 'block' : 'none' }}
      />
      
      {/* Loading placeholder */}
      {!imagesLoaded && (
        <div className="w-full h-full rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
      
      {/* Outer border ring */}
      <div className="absolute inset-[-12px] rounded-full border border-[#01292B] pointer-events-none"></div>
    </div>
  );
};