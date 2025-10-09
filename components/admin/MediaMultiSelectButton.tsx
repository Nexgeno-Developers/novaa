"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import {
  Check,
  Search,
  ImageIcon,
  Video,
  X,
  Loader2,
  Upload,
  Plus,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { addMediaItem } from "@/redux/slices/mediaSlice";

interface MediaFile {
  asset_id: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: "image" | "video";
  bytes?: number;
}

interface MediaMultiSelectButtonProps {
  onImagesSelect: (urls: string[]) => void;
  selectedImages: string[];
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
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(selectedImages);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

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

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/cms/media", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // Add to Redux store
          dispatch(addMediaItem(result));

          // Add to selected URLs immediately
          setSelectedUrls((prev) => [...prev, result.secure_url]);

          successCount++;
          return result;
        } else {
          errorCount++;
          throw new Error(result.error || `Failed to upload ${file.name}`);
        }
      });

      await Promise.all(uploadPromises);

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
      }

      if (errorCount > 0) {
        toast.error(`Failed to upload ${errorCount} file(s)`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleImageLoad = (assetId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [assetId]: false }));
  };

  const handleImageLoadStart = (assetId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [assetId]: true }));
  };

  const handleImageError = (assetId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [assetId]: false }));
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
    <div className="space-y-3">
      {/* Main selection button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="w-full group justify-start hover:bg-primary/20 h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          >
            {uploading ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm text-gray-500">
                    Uploading files...
                  </p>
                  <p className="text-xs text-gray-400">Please wait</p>
                </div>
              </div>
            ) : selectedImages.length > 0 ? (
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
                  <p className="font-medium text-sm text-primary">
                    {selectedImages.length}{" "}
                    {selectedImages.length === 1 ? "item" : "items"} selected
                  </p>
                  <p className="text-xs text-gray-500">
                    Click to change selection
                  </p>
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
      </Dialog>

      {/* Upload buttons */}
      <div className="flex gap-2">
        <input
          type="file"
          id={`upload-multi-${mediaType}`}
          accept={
            mediaType === "image"
              ? "image/*"
              : mediaType === "video"
              ? "video/*"
              : "*"
          }
          multiple
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            document.getElementById(`upload-multi-${mediaType}`)?.click()
          }
          disabled={uploading}
          className="flex-1 cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload New
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          disabled={uploading}
          className="flex-1 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Browse Library
        </Button>
      </div>

      {/* Re-open dialog for browsing */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden admin-theme">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Select Media</span>
              {selectedUrls.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedUrls.length} selected
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Search bar - Fixed at top */}
          <div className="flex gap-2 mb-4 flex-shrink-0">
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

          {/* Media grid - Scrollable area */}
          <ScrollArea className="h-[50vh]">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
              {media.map((file) => {
                const isSelected = selectedUrls.includes(file.secure_url);
                const isLoading = imageLoadingStates[file.asset_id];

                return (
                  <div
                    key={file.asset_id}
                    className={`relative group border-2 rounded-lg cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                      isSelected
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleSelect(file)}
                  >
                    <div className="aspect-square relative bg-gray-100 overflow-hidden">
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
                          onLoadStart={() =>
                            handleImageLoadStart(file.asset_id)
                          }
                          style={{ display: isLoading ? "none" : "block" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="p-2 bg-white">
                      <p
                        className="text-xs font-medium truncate"
                        title={formatFileName(file.public_id, file.format)}
                      >
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

            {/* Load more button inside scroll area */}
            {nextCursor && (
              <div className="flex justify-center mt-6 pb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchMedia(nextCursor)}
                  disabled={loading}
                  className="cursor-pointer"
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
          </ScrollArea>

          {/* Action buttons - Sticky at bottom */}
          <div className="flex justify-between items-center flex-shrink-0">
            <div className="text-sm text-gray-500">
              {selectedUrls.length > 0 && (
                <span>
                  {selectedUrls.length}{" "}
                  {selectedUrls.length === 1 ? "item" : "items"} selected
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                className="cursor-pointer"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="cursor-pointer"
                onClick={handleSave}
                disabled={selectedUrls.length === 0}
              >
                Save Selection ({selectedUrls.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected images preview */}
      {/* {selectedImages.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-2">
            Selected Images ({selectedImages.length})
          </p>
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
                    const newImages = selectedImages.filter(
                      (_, i) => i !== index
                    );
                    onImagesSelect(newImages);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default MediaMultiSelectButton;
