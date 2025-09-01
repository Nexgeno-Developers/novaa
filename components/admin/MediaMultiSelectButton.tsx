"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Search, ImageIcon, Video, X, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

interface MediaFile {
  asset_id: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: "image" | "video";
  bytes?: number;
}

interface MediaMultiSelectButtonProps {
  onImagesSelect: (urls: string[]) => void; // Changed to match ProjectsManager
  selectedImages: string[]; // Changed to match ProjectsManager
  multiple?: boolean;
  label?: string;
  mediaType?: "image" | "video" | "all";
}

const MediaMultiSelectButton: React.FC<MediaMultiSelectButtonProps> = ({
  onImagesSelect,
  selectedImages = [],
  multiple = true,
  label = "Select Media",
  mediaType = "all",
}) => {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(selectedImages);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});

  // Fetch media
  const fetchMedia = async (cursor?: string, reset = false) => {
    try {
      setLoading(true);
      const res = await axios.get("/api/cms/media", {
        params: {
          query,
          type: mediaType,
          limit: 20,
          cursor,
        },
      });

      if (res.data.success) {
        const { resources, next_cursor } = res.data.data;
        setMedia((prev) => (reset ? resources : [...prev, ...resources]));
        setNextCursor(next_cursor || null);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedia(undefined, true);
      setSelectedUrls(selectedImages);
    }
  }, [open, selectedImages]);

  useEffect(() => {
    if (query) {
      const debounceTimer = setTimeout(() => {
        fetchMedia(undefined, true);
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [query]);

  // Handle select/unselect
  const toggleSelect = (file: MediaFile) => {
    setSelectedUrls((prev) => {
      const exists = prev.includes(file.secure_url);
      if (exists) {
        return prev.filter((url) => url !== file.secure_url);
      } else {
        if (multiple) {
          return [...prev, file.secure_url];
        } else {
          return [file.secure_url];
        }
      }
    });
  };

  const handleSave = () => {
    onImagesSelect(selectedUrls);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedUrls(selectedImages);
    setOpen(false);
  };

  const handleImageLoad = (assetId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [assetId]: false }));
  };

  const handleImageLoadStart = (assetId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [assetId]: true }));
  };

  const handleImageError = (assetId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [assetId]: false }));
  };

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split("/").pop() || publicId;
    return `${fileName}.${format}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
          >
            {selectedImages.length > 0 ? (
              <div className="flex items-center gap-3 w-full">
                <div className="flex -space-x-2">
                  {selectedImages.slice(0, 3).map((url, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded border-2 border-white bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {selectedImages.length > 3 && (
                    <div className="w-8 h-8 rounded border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                      +{selectedImages.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">
                    {selectedImages.length} {selectedImages.length === 1 ? 'item' : 'items'} selected
                  </p>
                  <p className="text-xs text-gray-500">Click to change selection</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <ImageIcon className="h-5 w-5" />
                <span>{label}</span>
              </div>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Select Media</span>
              {selectedUrls.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedUrls.length} selected
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search media..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ScrollArea className="h-[500px]">
            {loading && media.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500">Loading media...</p>
                </div>
              </div>
            ) : media.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No media found</p>
                {query && (
                  <p className="text-sm mt-1">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
                {media.map((file) => {
                  const isSelected = selectedUrls.includes(file.secure_url);
                  const isLoading = imageLoadingStates[file.asset_id];
                  
                  return (
                    <div
                      key={file.asset_id}
                      className={`relative group border-2 rounded-lg cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                        isSelected ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleSelect(file)}
                    >
                      <div className="aspect-square relative bg-gray-100">
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        )}
                        
                        {file.resource_type === "image" ? (
                          <img
                            src={file.secure_url}
                            alt={file.public_id}
                            className="w-full h-full object-cover"
                            onLoad={() => handleImageLoad(file.asset_id)}
                            onError={() => handleImageError(file.asset_id)}
                            onLoadStart={() => handleImageLoadStart(file.asset_id)}
                            style={{ display: isLoading ? "none" : "block" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Video className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        
                        {/* Format badge */}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.format.toUpperCase()}
                        </div>
                      </div>
                      
                      {/* File info */}
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium truncate" title={formatFileName(file.public_id, file.format)}>
                          {formatFileName(file.public_id, file.format)}
                        </p>
                        {file.bytes && (
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.bytes)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Load more button */}
          {nextCursor && (
            <div className="flex justify-center mt-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => fetchMedia(nextCursor)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {selectedUrls.length > 0 && (
                <span>{selectedUrls.length} {selectedUrls.length === 1 ? 'item' : 'items'} selected</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSave}
                disabled={selectedUrls.length === 0}
              >
                Save Selection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Selected Images ({selectedImages.length})</p>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {selectedImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded overflow-hidden bg-gray-200">
                  <img 
                    src={url} 
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImages = selectedImages.filter((_, i) => i !== index);
                    onImagesSelect(newImages);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaMultiSelectButton;