// hooks/useHeroData.ts
import { useState, useEffect } from 'react';

interface HighlightedWord {
  word: string;
  style: {
    color?: string;
    fontWeight?: string;
    textDecoration?: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
  };
}

interface HeroData {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle?: string;
  highlightedWords?: HighlightedWord[];
  ctaButton?: {
    text: string;
    href: string;
    isActive: boolean;
  };
  overlayOpacity?: number;
  overlayColor?: string;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
}

interface UseHeroDataReturn {
  heroData: HeroData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHeroData = (): UseHeroDataReturn => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cms/home', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHeroData(data.heroSection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hero data');
      console.error('Failed to fetch hero data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  return {
    heroData,
    loading,
    error,
    refetch: fetchHeroData,
  };
};

// Utility function to render styled title
export const renderStyledTitle = (title: string, highlightedWords?: HighlightedWord[]) => {
  if (!title) return title;

  let styledTitle = title;
  highlightedWords?.forEach(({ word, style }) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const backgroundStyle = style.background 
      ? `background: ${style.background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
      : '';
    
    styledTitle = styledTitle.replace(
      regex,
      `<span class="${style.fontFamily || 'font-cinzel'}" style="color: ${style.background ? 'transparent' : style.color}; font-weight: ${style.fontWeight}; font-size: ${style.fontSize}; font-style: ${style.fontStyle}; ${backgroundStyle} ${
        style.textDecoration ? `text-decoration: ${style.textDecoration};` : ""
      }">${word}</span>`
    );
  });

  return styledTitle;
};