"use client";

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux"; // adjust path if needed
import { MediaItem } from "@/redux/slices/mediaSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import { ImageIcon, Video, X, Loader2 } from "lucide-react";

interface MediaSelectButtonProps {
  value: string;
  onSelect: (url: string) => void;
  mediaType: "image" | "video";
  label: string;
  placeholder?: string;
}

const MediaSelectButton = ({
  value,
  onSelect,
  mediaType,
  label,
  placeholder,
}: MediaSelectButtonProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const { items: mediaItems, status } = useSelector(
    (state: RootState) => state.media
  );

  const selectedMedia = useMemo(
    () => mediaItems.find((item) => item.secure_url === value || item.url === value),
    [mediaItems, value]
  );

  const handleMediaSelect = (media: MediaItem) => {
    onSelect(media.secure_url);
    setSelectorOpen(false);
  };

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split("/").pop() || publicId;
    return `${fileName}.${format}`;
  };

  // Detect local default images (so we don’t keep “Loading…” forever)
  const isLocalDefault =
    value?.startsWith("/images/") ||
    value?.startsWith("/static/") ||
    value?.startsWith("/assets/");

  const isMediaLoading = status === "loading";
  // Fix: only resolve if not local default and not yet matched in items
  const isResolvingMedia =
    !!value && !isLocalDefault && !selectedMedia && isMediaLoading;

  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-300">{label}</Label>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectorOpen(true)}
            disabled={isMediaLoading}
            className="w-full justify-start h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          >
            {isMediaLoading || isResolvingMedia ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm text-gray-500">
                    Loading media...
                  </p>
                  <p className="text-xs text-gray-400">Please wait</p>
                </div>
              </div>
            ) : selectedMedia || isLocalDefault ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                  {mediaType === "image" ? (
                    <img
                      src={selectedMedia?.secure_url || value}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      onLoadStart={() => setImageLoading(true)}
                      style={{ display: imageLoading ? "none" : "block" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm truncate">
                    {selectedMedia
                      ? formatFileName(
                          selectedMedia.public_id,
                          selectedMedia.format
                        )
                      : value.split("/").pop()}
                  </p>
                  {selectedMedia && (
                    <p className="text-xs text-gray-500">
                      {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB •{" "}
                      {selectedMedia.format.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                {mediaType === "image" ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <Video className="h-5 w-5" />
                )}
                <span>{placeholder || `Select ${mediaType}...`}</span>
              </div>
            )}
          </Button>

          {/* Clear selection button */}
          {(selectedMedia || isLocalDefault) && !isMediaLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelect("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}

          {/* Preview */}
          {(selectedMedia || isLocalDefault) && !isMediaLoading && (
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading preview...</p>
                  </div>
                </div>
              )}

              {mediaType === "image" ? (
                <img
                  src={selectedMedia?.secure_url || value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onLoad={() => setPreviewLoading(false)}
                  onError={() => setPreviewLoading(false)}
                  onLoadStart={() => setPreviewLoading(true)}
                  style={{ display: previewLoading ? "none" : "block" }}
                />
              ) : (
                <video
                  src={selectedMedia?.secure_url || value}
                  className="w-full h-full object-cover"
                  muted
                  onLoadedData={() => setPreviewLoading(false)}
                  onError={() => setPreviewLoading(false)}
                  onLoadStart={() => setPreviewLoading(true)}
                  style={{ display: previewLoading ? "none" : "block" }}
                />
              )}

              {!previewLoading && selectedMedia && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedMedia.format.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Loading preview while resolving media */}
          {isResolvingMedia && (
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading preview...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Media Selector Modal */}
      <AdvancedMediaSelector
        isOpen={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleMediaSelect}
        selectedValue={value}
        mediaType={mediaType}
        title={`Select ${label}`}
      />
    </>
  );
};

export default MediaSelectButton;