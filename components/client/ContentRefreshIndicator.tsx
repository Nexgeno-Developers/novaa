'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Info, X } from 'lucide-react';

interface ContentRefreshIndicatorProps {
  type: 'project' | 'blog';
  slug: string;
  contentName: string;
  autoHide?: boolean;
  hideDelay?: number;
}

export default function ContentRefreshIndicator({ 
  type, 
  slug, 
  contentName,
  autoHide = true,
  hideDelay = 10000 // 10 seconds
}: ContentRefreshIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    // Auto-hide after delay
    if (autoHide) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);

      return () => clearTimeout(hideTimer);
    }
  }, [autoHide, hideDelay]);

  useEffect(() => {
    // Simulate checking for fresh content
    const refreshTimer = setTimeout(() => {
      setIsRefreshing(false);
    }, 3000);

    // Listen for cache refresh completion (you can emit this from your API)
    const handleCacheRefresh = () => {
      setIsRefreshing(false);
      setTimeout(() => setIsVisible(false), 1000);
    };

    // Custom event listener for cache refresh completion
    window.addEventListener(`cache-refreshed-${type}-${slug}`, handleCacheRefresh);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener(`cache-refreshed-${type}-${slug}`, handleCacheRefresh);
    };
  }, [type, slug]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-4 border border-blue-400">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {isRefreshing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">
                {isRefreshing ? 'Content Updating' : 'Content Updated'}
              </h4>
              <button
                onClick={handleDismiss}
                className="text-blue-100 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-blue-100 mb-2">
              {isRefreshing 
                ? `We're updating "${contentName}" with the latest changes...`
                : `"${contentName}" has been updated with the latest content.`
              }
            </p>
            
            {isRefreshing ? (
              <div className="flex items-center gap-2 text-xs text-blue-100">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span>Refreshing cache...</span>
              </div>
            ) : (
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 text-xs bg-blue-400 hover:bg-blue-300 text-blue-900 px-2 py-1 rounded transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Page
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}