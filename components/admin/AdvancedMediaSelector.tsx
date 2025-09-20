"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  fetchMedia,
  setQuery,
  setType,
  resetMedia,
  MediaItem,
} from "@/redux/slices/mediaSlice";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Search,
  Grid3X3,
  List,
  Eye,
  Check,
  Image as ImageIcon,
  Video,
  FileText,
  File,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AdvancedMediaSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem) => void;
  selectedValue?: string;
  mediaType?: "image" | "video" | "file" | "all" | "raw" | "pdf";
  title?: string;
  multiple?: boolean;
  onMultipleSelect?: (media: MediaItem[]) => void;
}

export function AdvancedMediaSelector({
  isOpen,
  onOpenChange,
  onSelect,
  selectedValue,
  mediaType = "all",
  title = "Select Media",
  multiple = false,
  onMultipleSelect,
}: AdvancedMediaSelectorProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: mediaItems,
    loading,
    cursor,
    query,
    type,
    hasMore,
  } = useSelector((state: RootState) => state.media);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [localQuery, setLocalQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter media based on mediaType prop and active tab
  const filteredMedia = useMemo(() => {
    let filtered = mediaItems;

    // If mediaType is specified and not 'all', filter by that type
    if (mediaType !== "all") {
      if (mediaType === "file" || mediaType === "pdf") {
        // For 'file' or 'pdf' type, include files based on format/extension
        filtered = filtered.filter((item) => {
          // Check if it's a document format (not image or video)
          const documentFormats = [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "txt",
            "rtf",
          ];
          return (
            documentFormats.includes(item.format?.toLowerCase()) ||
            (item.resource_type !== "image" && item.resource_type !== "video")
          );
        });
      } else {
        filtered = filtered.filter((item) => item.resource_type === mediaType);
      }
    } else {
      // If mediaType is 'all', filter by active tab
      if (activeTab !== "all") {
        if (activeTab === "file") {
          // For file tab, include document formats
          filtered = filtered.filter((item) => {
            const documentFormats = [
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "txt",
              "rtf",
            ];
            return (
              documentFormats.includes(item.format?.toLowerCase()) ||
              (item.resource_type !== "image" && item.resource_type !== "video")
            );
          });
        } else {
          filtered = filtered.filter(
            (item) => item.resource_type === activeTab
          );
        }
      }
    }

    return filtered;
  }, [mediaItems, mediaType, activeTab]);

  // Initialize media type filter
  // useEffect(() => {
  //   if (isOpen) {
  //     // Fetch media if not already loaded
  //     if (mediaItems.length === 0) {
  //       dispatch(fetchMedia({ limit: 100, reset: true }));
  //     }
  //   }
  // }, [isOpen, dispatch, mediaItems.length]);

  // useEffect(() => {
  //   if (isOpen) {
  //     // Only fetch if we don't have media items or if we need a specific type
  //     const needsTypeSpecificFetch =
  //       mediaType !== "all" && filteredMedia.length === 0;
  //     const hasNoMediaItems = mediaItems.length === 0;

  //     if (hasNoMediaItems || needsTypeSpecificFetch) {
  //       let searchType: string | undefined;

  //       if (mediaType !== "all") {
  //         if (mediaType === "file" || mediaType === "pdf") {
  //           searchType = "raw";
  //         } else {
  //           searchType = mediaType;
  //         }
  //       }

  //       // Only reset if we really need to fetch different data
  //       if (needsTypeSpecificFetch) {
  //         dispatch(resetMedia());
  //       }

  //       dispatch(
  //         fetchMedia({
  //           limit: 100,
  //           reset: needsTypeSpecificFetch,
  //           type: searchType,
  //         })
  //       );
  //     }
  //   }
  // }, [isOpen, dispatch, mediaType, mediaItems.length, filteredMedia.length]);

  useEffect(() => {
    if (isOpen) {
      // Check if we have the right type of media already loaded
      const hasRightTypeOfMedia =
        mediaType === "all" ||
        filteredMedia.some((item) => {
          if (mediaType === "file" || mediaType === "pdf") {
            const documentFormats = [
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "txt",
              "rtf",
            ];
            return (
              documentFormats.includes(item.format?.toLowerCase()) ||
              (item.resource_type !== "image" && item.resource_type !== "video")
            );
          }
          return item.resource_type === mediaType;
        });

      // Only fetch if we don't have appropriate media or no media at all
      if (mediaItems.length === 0 || !hasRightTypeOfMedia) {
        let searchType: string | undefined;

        if (mediaType !== "all") {
          if (mediaType === "file" || mediaType === "pdf") {
            searchType = "raw";
          } else {
            searchType = mediaType;
          }
        }

        // Only reset if we really need different data
        if (!hasRightTypeOfMedia && mediaItems.length > 0) {
          dispatch(resetMedia());
        }

        dispatch(
          fetchMedia({
            limit: 100,
            reset: !hasRightTypeOfMedia && mediaItems.length > 0,
            type: searchType,
          })
        );
      }
    }
  }, [isOpen, dispatch, mediaType]);
  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setQuery(localQuery));
      dispatch(resetMedia());

      let searchType: string | undefined;

      if (mediaType !== "all") {
        if (mediaType === "file" || mediaType === "pdf") {
          searchType = "raw"; // Cloudinary stores documents as 'raw'
        } else {
          searchType = mediaType;
        }
      } else if (activeTab !== "all") {
        if (activeTab === "file") {
          searchType = "raw";
        } else {
          searchType = activeTab;
        }
      }

      dispatch(
        fetchMedia({
          query: localQuery || undefined,
          type: searchType,
          reset: true,
          limit: 100, // Add limit to ensure consistent behavior
        })
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, mediaType, activeTab, dispatch]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    dispatch(resetMedia());

    let searchType: string | undefined;
    let searchResourceType: string | undefined;

    if (value === "file") {
      searchResourceType = "raw"; // Documents are stored as 'raw' in Cloudinary
      searchType = undefined;
    } else if (value !== "all") {
      searchResourceType = value;
      searchType = value;
    }

    dispatch(
      fetchMedia({
        query: localQuery || undefined,
        type: searchType,
        reset: true,
      })
    );
  };
  const handleItemSelect = (item: MediaItem) => {
    if (multiple) {
      const isSelected = selectedItems.some(
        (selected) => selected.public_id === item.public_id
      );
      let newSelectedItems;

      if (isSelected) {
        newSelectedItems = selectedItems.filter(
          (selected) => selected.public_id !== item.public_id
        );
      } else {
        newSelectedItems = [...selectedItems, item];
      }

      setSelectedItems(newSelectedItems);
    } else {
      onSelect(item);
      onOpenChange(false);
    }
  };

  const handleMultipleConfirm = () => {
    if (onMultipleSelect && selectedItems.length > 0) {
      onMultipleSelect(selectedItems);
      onOpenChange(false);
      setSelectedItems([]);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      let searchType: string | undefined;
      let searchResourceType: string | undefined;

      if (mediaType !== "all") {
        if (mediaType === "file" || mediaType === "pdf") {
          searchResourceType = "raw";
          searchType = undefined;
        } else {
          searchResourceType = mediaType;
          searchType = mediaType;
        }
      } else if (activeTab !== "all") {
        if (activeTab === "file") {
          searchResourceType = "raw";
          searchType = undefined;
        } else {
          searchResourceType = activeTab;
          searchType = activeTab;
        }
      }

      dispatch(
        fetchMedia({
          query: localQuery || undefined,
          type: searchType,
          cursor: cursor,
          reset: false,
        })
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split("/").pop() || publicId;
    return `${fileName}.${format}`;
  };

  const getFileIcon = (item: MediaItem) => {
    if (item.resource_type === "image")
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    if (item.resource_type === "video")
      return <Video className="h-6 w-6 text-purple-500" />;
    if (item.format === "pdf")
      return <FileText className="h-6 w-6 text-red-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
  };

  const isItemSelected = (item: MediaItem) => {
    if (multiple) {
      return selectedItems.some(
        (selected) => selected.public_id === item.public_id
      );
    }
    return item.secure_url === selectedValue;
  };

  const MediaCard = ({ item }: { item: MediaItem }) => {
    const isSelected = isItemSelected(item);

    if (viewMode === "list") {
      return (
        <Card
          className={`hover:shadow-md transition-all cursor-pointer ${
            isSelected ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => handleItemSelect(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.resource_type === "image" ? (
                  <img
                    src={item.secure_url}
                    alt="Media thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(item)}
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {formatFileName(item.public_id, item.format)}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(item.bytes)} • {formatDate(item.created_at)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant={
                      item.resource_type === "image" ? "default" : "secondary"
                    }
                    className="text-xs text-background bg-gray-200"
                  >
                    {item.resource_type}
                  </Badge>
                  <span className="text-xs text-gray-400 uppercase">
                    {item.format}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => handleItemSelect(item)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
            {item.resource_type === "image" ? (
              <img
                src={item.secure_url}
                alt="Media thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                {getFileIcon(item)}
              </div>
            )}

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            {/* Preview button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewItem(item);
                  }}
                  className="rounded-full"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
              {formatFileName(item.public_id, item.format)}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {formatFileSize(item.bytes)}
            </p>
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  item.resource_type === "image" ? "default" : "secondary"
                }
                className="text-xs bg-gray-200 text-primary"
              >
                {item.resource_type}
              </Badge>
              <span className="text-xs text-gray-400 uppercase">
                {item.format}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[95vh] p-0 admin-theme">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                {title}
                {multiple && selectedItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedItems.length} selected
                  </Badge>
                )}
              </DialogTitle>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-300 cursor-pointer"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid3X3 className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-300 cursor-pointer"
                  onClick={() => {
                    dispatch(resetMedia());
                    dispatch(fetchMedia({ limit: 100, reset: true }));
                  }}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 pb-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media files..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Media Type Tabs (if mediaType is 'all') */}
            {mediaType === "all" && (
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="mb-4"
              >
                <TabsList>
                  <TabsTrigger value="all">All Files</TabsTrigger>
                  <TabsTrigger value="image">Images</TabsTrigger>
                  <TabsTrigger value="video">Videos</TabsTrigger>
                  <TabsTrigger value="file">Documents</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <FileText className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <span className="text-lg font-semibold">
                  {filteredMedia.length}
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ImageIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">Images</span>
                </div>
                <span className="text-lg font-semibold">
                  {
                    mediaItems.filter((item) => item.resource_type === "image")
                      .length
                  }
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Video className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-gray-600">Videos</span>
                </div>
                <span className="text-lg font-semibold">
                  {
                    mediaItems.filter((item) => item.resource_type === "video")
                      .length
                  }
                </span>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <File className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm text-gray-600">Files</span>
                </div>
                <span className="text-lg font-semibold">
                  {
                    mediaItems.filter(
                      (item) =>
                        item.resource_type !== "image" &&
                        item.resource_type !== "video"
                    ).length
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Media Grid/List */}
          <ScrollArea className="h-96 px-4">
            {loading && filteredMedia.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  {/* <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" /> */}
                  {/* <p className="text-gray-500">Loading media...</p> */}
                </div>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No media files found
                </h3>
                <p className="text-gray-500 text-center">
                  {localQuery
                    ? "Try adjusting your search terms"
                    : "Upload some files to get started"}
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-2"
                    : "space-y-2"
                }
              >
                {filteredMedia.map((item) => (
                  <MediaCard key={item.public_id} item={item} />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-6 pb-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="bg-gray-200 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="text-sm text-gray-600">
              {filteredMedia.length} file{filteredMedia.length !== 1 ? "s" : ""}{" "}
              available
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className=" cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              {multiple && (
                <Button
                  onClick={handleMultipleConfirm}
                  disabled={selectedItems.length === 0}
                  className="bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  Select {selectedItems.length} Item
                  {selectedItems.length !== 1 ? "s" : ""}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-3xl admin-theme">
          <DialogHeader>
            <DialogTitle>
              {previewItem &&
                formatFileName(previewItem.public_id, previewItem.format)}
            </DialogTitle>
          </DialogHeader>

          {previewItem && (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                {previewItem.resource_type === "image" ? (
                  <img
                    src={previewItem.secure_url}
                    alt="Preview"
                    className="w-full max-h-96 object-contain"
                  />
                ) : previewItem.resource_type === "video" ? (
                  <video
                    src={previewItem.secure_url}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <div className="w-full h-48 flex flex-col items-center justify-center">
                    {getFileIcon(previewItem)}
                    <p className="mt-2 text-gray-600">
                      {formatFileName(
                        previewItem.public_id,
                        previewItem.format
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* File Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>{" "}
                  {previewItem.resource_type}
                </div>
                <div>
                  <span className="text-gray-500">Format:</span>{" "}
                  {previewItem.format.toUpperCase()}
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>{" "}
                  {formatFileSize(previewItem.bytes)}
                </div>
                {previewItem.width && previewItem.height && (
                  <div>
                    <span className="text-gray-500">Dimensions:</span>{" "}
                    {previewItem.width} × {previewItem.height}
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Uploaded:</span>{" "}
                  {formatDate(previewItem.created_at)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="bg-primary text-background hover:bg-primary/90 cursor-pointer"
                  onClick={() => setPreviewItem(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleItemSelect(previewItem);
                    setPreviewItem(null);
                  }}
                  className="bg-primary text-background hover:bg-primary/90 cursor-pointer"
                >
                  {isItemSelected(previewItem)
                    ? "Selected"
                    : "Select This File"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
