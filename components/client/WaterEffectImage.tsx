import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface WaterEffectImageProps {
  backgroundSrc: string;
  logoSrc: string;
  alt?: string;
  width:number;
  height:number;
  className?: string;
}

export const WaterEffectImage: React.FC<WaterEffectImageProps> = ({
  backgroundSrc,
  logoSrc,
  width,
  height,
  alt = "water effect image",
  className = "",
}) => {

    console.log("Background image and logo image " , backgroundSrc , logoSrc)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const waterCache1Ref = useRef<number[][]>([]);
  const waterCache2Ref = useRef<number[][]>([]);
  const imageDataSourceRef = useRef<ImageData | null>(null);
  const imageDataTargetRef = useRef<ImageData | null>(null);
  const dropletCounterRef = useRef<number>(0);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const config = {
    framerate: 40,
    waterDamper: 0.99,
    displacementDamper: 0.15,
    luminanceDamper: 0.8,
  };

  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      console.log("Prev" , prev);``
      console.log(loadedCount);
      const newCount = prev + 1;
      if (newCount >= 2) {
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
    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;

    context.drawImage(backgroundImage, 0, 0, width, height);
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(0, 0, width, height);

    // Calculate logo dimensions to maintain aspect ratio
    const logoAspectRatio = logoImage.naturalWidth / logoImage.naturalHeight;
    const maxLogoSize = Math.min(width, height) * 0.5;

    let logoWidth, logoHeight;
    if (logoAspectRatio > 1) {
      // Logo is wider than it is tall
      logoWidth = maxLogoSize;
      logoHeight = maxLogoSize / logoAspectRatio;
    } else {
      // Logo is taller than it is wide or square
      logoHeight = maxLogoSize;
      logoWidth = maxLogoSize * logoAspectRatio;
    }

    const logoX = (width - logoWidth) / 2;
    const logoY = (height - logoHeight) / 2;
    context.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

    imageDataSourceRef.current = context.getImageData(0, 0, width, height);
    imageDataTargetRef.current = context.getImageData(0, 0, width, height);

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

    startAnimation();
  };

  const setDroplet = (x: number, y: number, intensity = 255) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const adjustedX = Math.floor(x) + 2;
    const adjustedY = Math.floor(y) + 2;
    const width = canvas.width;
    const height = canvas.height;

    if (
      adjustedX > 2 &&
      adjustedY > 2 &&
      adjustedX < width + 1 &&
      adjustedY < height + 1
    ) {
      const cache1 = waterCache1Ref.current;

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

  const manipulatePixel = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const cache1 = waterCache1Ref.current;
    const cache2 = waterCache2Ref.current;
    const imageDataSource = imageDataSourceRef.current;
    const imageDataTarget = imageDataTargetRef.current;
    if (!imageDataSource || !imageDataTarget) return;

    cache2[x][y] =
      ((cache1[x - 1][y] +
        cache1[x + 1][y] +
        cache1[x][y + 1] +
        cache1[x][y - 1] +
        cache1[x - 1][y - 1] +
        cache1[x + 1][y + 1] +
        cache1[x - 1][y + 1] +
        cache1[x + 1][y - 1] +
        cache1[x - 2][y] +
        cache1[x + 2][y] +
        cache1[x][y + 2] +
        cache1[x][y - 2]) /
        6 -
        cache2[x][y]) *
      config.waterDamper;

    const posTargetX = x - 2;
    const posTargetY = y - 2;

    let posSourceX = Math.floor(cache2[x][y] * config.displacementDamper);
    if (posSourceX < 0) posSourceX += 1;
    let posSourceY = posTargetY + posSourceX;
    posSourceX += posTargetX;

    posSourceX = Math.max(0, Math.min(width - 1, posSourceX));
    posSourceY = Math.max(0, Math.min(height - 1, posSourceY));

    const posTarget = (posTargetX + posTargetY * width) * 4;
    const posSource = (posSourceX + posSourceY * width) * 4;

    const luminance = Math.floor(cache2[x][y] * config.luminanceDamper);

    imageDataTarget.data[posTarget] = Math.max(
      0,
      Math.min(255, imageDataSource.data[posSource] + luminance)
    );
    imageDataTarget.data[posTarget + 1] = Math.max(
      0,
      Math.min(255, imageDataSource.data[posSource + 1] + luminance)
    );
    imageDataTarget.data[posTarget + 2] = Math.max(
      0,
      Math.min(255, imageDataSource.data[posSource + 2] + luminance)
    );
  };

  const tick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;

    // if (config.randomDroplets) {
    //   dropletCounterRef.current++;
    //   if (dropletCounterRef.current >= config.randomDroplets) {
    //     setDroplet(Math.random() * width, Math.random() * height, 127);
    //     dropletCounterRef.current = 0;
    //   }
    // }

    for (let x = 2; x < width + 2; x++) {
      for (let y = 2; y < height + 2; y++) {
        manipulatePixel(x, y);
      }
    }

    const temp = waterCache1Ref.current;
    waterCache1Ref.current = waterCache2Ref.current;
    waterCache2Ref.current = temp;

    context.putImageData(imageDataTargetRef.current!, 0, 0);
  };

  const startAnimation = () => {
    if (animationRef.current) clearInterval(animationRef.current);
    animationRef.current = setInterval(
      tick,
      Math.floor(1000 / config.framerate)
    );
  };

  const handleCanvasInteraction = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    setDroplet(x, y, 400);
  };

  const handleMouseEnter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

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

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full rounded-full cursor-pointer shadow-2xl"
        onMouseMove={handleCanvasInteraction}
        onClick={handleCanvasInteraction}
        onMouseEnter={handleMouseEnter}
        style={{ display: imagesLoaded ? "block" : "none" }}
      />

      {!imagesLoaded && (
        <div className="w-full h-full rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}

      <div className="absolute inset-[-12px] rounded-full border border-[#01292B] pointer-events-none"></div>
    </div>
  );
};