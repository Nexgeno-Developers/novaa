"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/client/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Download,
  Eye,
  Image as ImageIcon,
  Video,
  Grid3X3,
  List,
  Filter,
  RefreshCw,
  FileText,
  Calendar,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMedia,
  addMediaItem,
  removeMediaItem,
  setQuery,
  setType,
  resetMedia,
  MediaItem,
} from "@/redux/slices/mediaSlice";

export default function MediaManagement() {
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewDialog, setPreviewDialog] = useState<MediaItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<MediaItem | null>(null);

  const dispatch = useAppDispatch();
  const { items, loading, query, type, hasMore, totalCount, cursor } = useAppSelector((state) => state.media);

  // Initial load
  useEffect(() => {
    dispatch(fetchMedia({ reset: true }));
  }, [dispatch]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(resetMedia());
      dispatch(fetchMedia({ 
        query, 
        type, 
        reset: true 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, type, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  const handleTabChange = (newType: string) => {
    dispatch(setType(newType));
  };

  const handleRefresh = () => {
    dispatch(resetMedia());
    dispatch(fetchMedia({ 
      query, 
      type, 
      reset: true 
    }));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchMedia({ 
        query, 
        type, 
        cursor 
      }));
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/cms/media", {
          method: "POST",
          body: formData,
        });
        console.log("Respone after upload" , response)

        const result = await response.json();
        console.log("Result after upload" , result)

        if (result.success) {
          dispatch(addMediaItem(result));
          successCount++;
        } else {
          errorCount++;
          toast.error(`Failed to upload ${file.name}`, {
            description: result.error,
            duration: 4000,
          });
        }
      } catch (error) {
        errorCount++;
        toast.error(`Upload failed for ${file.name}`, {
          duration: 4000,
        });
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`, {
        description: "Files are now available in your media library",
        duration: 3000,
      });
    }

    if (errorCount > 0 && successCount === 0) {
      toast.error(`Failed to upload ${errorCount} file(s)`, {
        description: "Please check file formats and sizes",
        duration: 5000,
      });
    }

    setUploading(false);
  };

  const handleDelete = async (file: MediaItem) => {
    try {
      const response = await fetch("/api/cms/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: file.public_id,
          resource_type: file.resource_type,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("File deleted successfully", {
          description: "The file has been permanently removed",
          duration: 3000,
        });
        dispatch(removeMediaItem(file.public_id));
      } else {
        toast.error("Delete failed", {
          description: result.message || "Failed to delete file",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("Delete failed", {
        description: "An error occurred while deleting the file",
        duration: 4000,
      });
    }
    setDeleteDialog(null);
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard", {
        description: "You can now paste it anywhere",
        duration: 2000,
      });
    } catch (error) {
      toast.error("Copy failed", {
        description: "Unable to copy URL to clipboard",
        duration: 3000,
      });
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

  // Filter items based on current type
  const filteredMedia = items.filter((file) => {
    if (type === "all") return true;
    return file?.resource_type === type;
  });

  // Calculate stats from current items
  const stats = {
    total: totalCount,
    images: items.filter(f => f.resource_type === "image").length,
    videos: items.filter(f => f.resource_type === "video").length,
    totalSize: items.reduce((acc, f) => acc + f.bytes, 0)
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600">
            Upload, organize and manage your media files
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-white text-background cursor-pointer"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="outline"
            className="bg-white text-background cursor-pointer"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Files</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Images</p>
                <p className="text-xl font-bold">{stats.images}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Videos</p>
                <p className="text-xl font-bold">{stats.videos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-xl font-bold">
                  {formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <input
              type="file"
              id="fileInput"
              multiple
              accept="image/*,video/*"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploading ? <Loader /> : "Upload Media Files"}
              </h3>
              <p className="text-gray-500">
                Drag and drop files here or click to browse
                <br />
                <span className="text-xs">
                  Supports: JPG, PNG, WebP, GIF, MP4, WebM (Max: 50MB)
                </span>
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search media files..."
            value={query}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs and Media Grid */}
      <Tabs value={type} onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-300 text-background">
          <TabsTrigger value="all" className="cursor-pointer">
            All Files
          </TabsTrigger>
          <TabsTrigger value="image" className="cursor-pointer">
            Images
          </TabsTrigger>
          <TabsTrigger value="video" className="cursor-pointer">
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value={type} className="mt-6">
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading media...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No media files found
                </h3>
                <p className="text-gray-500">
                  {query ? "Try adjusting your search terms" : "Upload some files to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    : "space-y-2"
                }
              >
                {filteredMedia.map((file) => (
                  <MediaCard
                    key={file.public_id}
                    file={file}
                    viewMode={viewMode}
                    onPreview={setPreviewDialog}
                    onDelete={setDeleteDialog}
                    onCopy={copyToClipboard}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      {previewDialog && (
        <PreviewDialog
          file={previewDialog}
          onClose={() => setPreviewDialog(null)}
          onCopy={copyToClipboard}
          formatFileSize={formatFileSize}
          formatDate={formatDate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
            <AlertDialog.Title className="m-0 text-lg font-semibold text-gray-900">
              Delete Media File
            </AlertDialog.Title>
            <AlertDialog.Description className="mb-5 mt-3 text-sm leading-normal text-gray-600">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </AlertDialog.Description>

            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-200 px-4 font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 cursor-pointer">
                  Cancel
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  onClick={() => deleteDialog && handleDelete(deleteDialog)}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
                >
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}

// Media Card Component
function MediaCard({
  file,
  viewMode,
  onPreview,
  onDelete,
  onCopy,
  formatFileSize,
  formatDate,
}: {
  file: MediaItem;
  viewMode: "grid" | "list";
  onPreview: (file: MediaItem) => void;
  onDelete: (file: MediaItem) => void;
  onCopy: (url: string) => void;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: string) => string;
}) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 bg-transparent">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {file.resource_type === "image" ? (
                <img
                  src={file.secure_url}
                  alt="Media thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {file.public_id.split("/").pop()}.{file.format}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.bytes)} • {formatDate(file.created_at)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  className="text-background"
                  variant={
                    file.resource_type === "image" ? "default" : "secondary"
                  }
                >
                  {file.resource_type}
                </Badge>
                <span className="text-xs text-gray-400 uppercase">
                  {file.format}
                </span>
              </div>
            </div>

            <div className="flex items-center text-primary space-x-1">
              <Button
                size="sm"
                className="bg-background text-primary hover:bg-primary hover:text-background transition-colors duration-300 cursor-pointer"
                variant="ghost"
                onClick={() => onPreview(file)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="bg-background text-primary hover:bg-primary hover:text-background transition-colors duration-300 cursor-pointer"
                variant="ghost"
                onClick={() => onCopy(file.secure_url)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="bg-background text-primary hover:bg-primary hover:text-background transition-colors duration-300 cursor-pointer"
                onClick={() => onDelete(file)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          {file.resource_type === "image" ? (
            <img
              src={file.secure_url}
              alt="Media thumbnail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Video className="h-8 w-8 text-primary" />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-lg bg-background text-primary cursor-pointer hover:bg-primary hover:text-background transition-color duration-300"
                onClick={() => onPreview(file)}
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-lg bg-background text-primary cursor-pointer hover:bg-primary hover:text-background transition-color duration-300"
                onClick={() => onCopy(file.secure_url)}
              >
                <Copy className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-lg bg-background text-primary cursor-pointer hover:bg-primary hover:text-background transition-color duration-300"
                onClick={() => onDelete(file)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
            {file.public_id.split("/").pop()}.{file.format}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {formatFileSize(file.bytes)}
          </p>
          <div className="flex items-center justify-between">
            <Badge
              variant={file.resource_type === "image" ? "default" : "secondary"}
              className="text-xs text-background"
            >
              {file.resource_type}
            </Badge>
            <span className="text-xs text-gray-400 uppercase">
              {file.format}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Preview Dialog Component
function PreviewDialog({
  file,
  onClose,
  onCopy,
  formatFileSize,
  formatDate,
}: {
  file: MediaItem;
  onClose: () => void;
  onCopy: (url: string) => void;
  formatFileSize: (bytes: number) => string;
  formatDate: (date: string) => string;
}) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden border-background">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center justify-between px-3">
            <DialogTitle className="text-primary text-lg font-semibold">
              {file.public_id.split("/").pop()}.{file.format}
            </DialogTitle>
            <Badge
              className="text-background capitalize"
              variant={file.resource_type === "image" ? "default" : "secondary"}
            >
              {file.resource_type}
            </Badge>
          </div>
        </DialogHeader>

        {/* Preview */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {file.resource_type === "image" ? (
            <img
              src={file.secure_url}
              alt="Preview"
              className="w-full max-h-96 object-contain"
            />
          ) : (
            <video
              src={file.secure_url}
              controls
              className="w-full max-h-96 object-contain"
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>

        {/* File Details */}
        <section className="mt-4 text-primary">
          <h3 className="font-semibold text-primary mb-2">File Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Type</dt>
              <dd className="font-medium capitalize">{file.resource_type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Format</dt>
              <dd className="font-medium uppercase">{file.format}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Size</dt>
              <dd className="font-medium">{formatFileSize(file.bytes)}</dd>
            </div>
            {file.width && file.height && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Dimensions</dt>
                <dd className="font-medium">
                  {file.width} × {file.height}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Uploaded</dt>
              <dd className="font-medium">{formatDate(file.created_at)}</dd>
            </div>
          </dl>
        </section>

        {/* Actions */}
        <section className="mt-4">
          <h3 className="font-semibold text-primary mb-3">Actions</h3>
          <div className="flex items-center justify-start gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-background border-primary"
              onClick={() => onCopy(file.secure_url)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-background border-primary"
              onClick={() => {
                const a = document.createElement("a");
                a.href = file.secure_url;
                a.download = `${file.public_id.split("/").pop()}.${file.format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </section>

        {/* Direct URL */}
        <section className="mt-4">
          <h3 className="font-semibold text-primary mb-2">Direct URL</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <code className="text-xs text-gray-800 break-all">
              {file.secure_url}
            </code>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}