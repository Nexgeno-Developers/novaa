import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux"; // adjust path
import {MediaItem} from '@/redux/slices/mediaSlice'
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import { ImageIcon, Video, X } from "lucide-react";

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
  const { items: mediaItems } = useSelector((state: RootState) => state.media);

  const selectedMedia = useMemo(
    () => mediaItems.find((item) => item.secure_url === value),
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

  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectorOpen(true)}
            className="w-full justify-start h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
          >
            {selectedMedia ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {mediaType === "image" ? (
                    <img
                      src={selectedMedia.secure_url}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm truncate">
                    {formatFileName(
                      selectedMedia.public_id,
                      selectedMedia.format
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB •{" "}
                    {selectedMedia.format.toUpperCase()}
                  </p>
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
          {selectedMedia && (
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
          {selectedMedia && (
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {mediaType === "image" ? (
                <img
                  src={selectedMedia.secure_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={selectedMedia.secure_url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {selectedMedia.format.toUpperCase()}
                </Badge>
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