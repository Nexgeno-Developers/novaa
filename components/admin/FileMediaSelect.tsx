"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Image as ImageIcon,
  Video,
  FileText,
  Upload,
  X,
  Search,
  Check,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { toast } from "sonner";

interface MediaSelectButtonProps {
  onSelect?: (selectedMedia: string[]) => void;
  onImagesSelect?: (selectedImages: string[]) => void;
  selectedImages?: string[];
  multiple?: boolean;
  label?: string;
  mediaType?: 'image' | 'video' | 'file' | 'all';
  acceptedFileTypes?: string;
  className?: string;
}

export default function MediaSelectButton({
  onSelect,
  onImagesSelect,
  selectedImages = [],
  multiple = false,
  label = "Select Media",
  mediaType = 'all',
  acceptedFileTypes = '.jpg,.jpeg,.png,.gif,.mp4,.mov,.pdf,.doc,.docx',
  className = "",
}: MediaSelectButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string[]>(selectedImages);
  const [activeTab, setActiveTab] = useState("gallery");

  const { items } = useSelector((state: RootState) => state.media);

  // Filter media based on type and search
  const filteredMedia = items.filter((item) => {
    const matchesSearch = item.alt.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (mediaType === 'all') return matchesSearch;
    
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => 
      item.url.toLowerCase().includes(`.${ext}`)
    );
    const isVideo = ['mp4', 'mov', 'avi', 'wmv'].some(ext => 
      item.url.toLowerCase().includes(`.${ext}`)
    );
    const isFile = ['pdf', 'doc', 'docx', 'txt'].some(ext => 
      item.url.toLowerCase().includes(`.${ext}`)
    );

    switch (mediaType) {
      case 'image':
        return matchesSearch && isImage;
      case 'video':
        return matchesSearch && isVideo;
      case 'file':
        return matchesSearch && isFile;
      default:
        return matchesSearch;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');

        const response = await fetch('/api/cms/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        return result.data;
      });

      const uploadResults = await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${uploadResults.length} file(s)`);
      
      // Refresh media list or dispatch action to update Redux store
      // You might want to dispatch a fetchMedia action here
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const handleMediaToggle = (mediaUrl: string) => {
    if (multiple) {
      setSelectedMedia(prev => {
        if (prev.includes(mediaUrl)) {
          return prev.filter(url => url !== mediaUrl);
        } else {
          return [...prev, mediaUrl];
        }
      });
    } else {
      setSelectedMedia([mediaUrl]);
    }
  };

  const handleConfirmSelection = () => {
    if (onSelect) {
      onSelect(selectedMedia);
    }
    if (onImagesSelect) {
      onImagesSelect(selectedMedia);
    }
    setIsDialogOpen(false);
  };

  const getMediaIcon = (url: string) => {
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => 
      url.toLowerCase().includes(`.${ext}`)
    );
    const isVideo = ['mp4', 'mov', 'avi', 'wmv'].some(ext => 
      url.toLowerCase().includes(`.${ext}`)
    );
    
    if (isImage) return <ImageIcon className="w-4 h-4" />;
    if (isVideo) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileTypeFilter = () => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'file':
        return '.pdf,.doc,.docx,.txt';
      default:
        return acceptedFileTypes;
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className={`text-background ${className}`}
          onClick={() => {
            setSelectedMedia(selectedImages);
            setIsDialogOpen(true);
          }}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {label}
          {selectedImages.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedImages.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList>
            <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-4 h-[calc(80vh-120px)]">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
              {filteredMedia.map((item) => (
                <div
                  key={item._id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedMedia.includes(item.url)
                      ? 'border-primary shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMediaToggle(item.url)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        {getMediaIcon(item.url)}
                        <span className="text-xs mt-1 text-center px-1">
                          {item.alt}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {selectedMedia.includes(item.url) && (
                    <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.alt}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredMedia.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No media files found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-700">
                  Click to upload files
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Supports: {getFileTypeFilter()}
                </p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple={multiple}
                accept={getFileTypeFilter()}
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading && (
                <div className="flex items-center justify-center mt-4">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedMedia.length} file(s) selected
            {multiple && ` (Multiple selection enabled)`}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSelection}
              disabled={selectedMedia.length === 0}
            >
              Select {selectedMedia.length} File(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}