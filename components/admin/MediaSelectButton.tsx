"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { MediaItem } from "@/redux/slices/mediaSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import { ImageIcon, Video, X, Loader2, FileText, File } from "lucide-react";

interface MediaSelectButtonProps {
  value: string;
  onSelect: (url: string) => void;
  mediaType: "image" | "video" | "file" | "pdf";
  label: string;
  placeholder?: string;
}

// const MediaSelectButton = ({
//   value,
//   onSelect,
//   mediaType,
//   label,
//   placeholder,
// }: MediaSelectButtonProps) => {
//   const [selectorOpen, setSelectorOpen] = useState(false);
//   const [imageLoading, setImageLoading] = useState(false);
//   const [previewLoading, setPreviewLoading] = useState(false);

//   const { items: mediaItems, status } = useSelector(
//     (state: RootState) => state.media
//   );

//   const selectedMedia = useMemo(
//     () => mediaItems.find((item) => item.secure_url === value || item.url === value),
//     [mediaItems, value]
//   );

//   const handleMediaSelect = (media: MediaItem) => {
//     onSelect(media.secure_url);
//     setSelectorOpen(false);
//   };

//   const formatFileName = (publicId: string, format: string) => {
//     const fileName = publicId.split("/").pop() || publicId;
//     return `${fileName}.${format}`;
//   };

//   const getFileIcon = (format?: string) => {
//     if (!format) return <File className="h-6 w-6 text-gray-400" />;
    
//     const lowerFormat = format.toLowerCase();
//     if (lowerFormat === 'pdf') return <FileText className="h-6 w-6 text-red-500" />;
//     if (['doc', 'docx'].includes(lowerFormat)) return <FileText className="h-6 w-6 text-blue-500" />;
//     if (['xls', 'xlsx'].includes(lowerFormat)) return <FileText className="h-6 w-6 text-green-500" />;
//     return <File className="h-6 w-6 text-gray-400" />;
//   };

//   const isLocalDefault =
//     value?.startsWith("/images/") ||
//     value?.startsWith("/static/") ||
//     value?.startsWith("/assets/");

//   const isMediaLoading = status === "loading";
//   const isResolvingMedia = !!value && !isLocalDefault && !selectedMedia && isMediaLoading;

//   const renderIcon = () => {
//     switch (mediaType) {
//       case "image":
//         return <ImageIcon className="h-5 w-5" />;
//       case "video":
//         return <Video className="h-5 w-5" />;
//       case "pdf":
//         return <FileText className="h-5 w-5" />;
//       case "file":
//       default:
//         return <File className="h-5 w-5" />;
//     }
//   };

//   const renderPreview = () => {
//     if (mediaType === "image") {
//       return (
//         <img
//           src={selectedMedia?.secure_url || value}
//           alt="Preview"
//           className="w-full h-full object-cover"
//           onLoad={() => setPreviewLoading(false)}
//           onError={() => setPreviewLoading(false)}
//           onLoadStart={() => setPreviewLoading(true)}
//           style={{ display: previewLoading ? "none" : "block" }}
//         />
//       );
//     }

//     if (mediaType === "video") {
//       return (
//         <video
//           src={selectedMedia?.secure_url || value}
//           className="w-full h-full object-cover"
//           muted
//           onLoadedData={() => setPreviewLoading(false)}
//           onError={() => setPreviewLoading(false)}
//           onLoadStart={() => setPreviewLoading(true)}
//           style={{ display: previewLoading ? "none" : "block" }}
//         />
//       );
//     }

//     // For files and PDFs
//     return (
//       <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
//         {getFileIcon(selectedMedia?.format)}
//         <p className="text-xs text-gray-600 mt-2 text-center px-2">
//           {selectedMedia 
//             ? formatFileName(selectedMedia.public_id, selectedMedia.format)
//             : value.split("/").pop()
//           }
//         </p>
//         {selectedMedia && (
//           <p className="text-xs text-gray-500">
//             {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB
//           </p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="space-y-3">
//         <Label className="text-sm font-medium text-primary">{label}</Label>

//         <div className="space-y-3">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => setSelectorOpen(true)}
//             disabled={isMediaLoading}
//             className="w-full group justify-start hover:bg-primary/20 h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
//           >
//             {isMediaLoading || isResolvingMedia ? (
//               <div className="flex items-center gap-3 w-full">
//                 <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
//                   <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
//                 </div>
//                 <div className="text-left">
//                   <p className="font-medium text-sm text-gray-500">
//                     Loading media...
//                   </p>
//                   <p className="text-xs text-gray-400">Please wait</p>
//                 </div>
//               </div>
//             ) : selectedMedia || isLocalDefault ? (
//               <div className="flex items-center gap-3 w-full">
//                 <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
//                   {imageLoading && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//                       <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
//                     </div>
//                   )}
//                   {mediaType === "image" ? (
//                     <img
//                       src={selectedMedia?.secure_url || value}
//                       alt="Selected"
//                       className="w-full h-full object-cover"
//                       onLoad={() => setImageLoading(false)}
//                       onError={() => setImageLoading(false)}
//                       onLoadStart={() => setImageLoading(true)}
//                       style={{ display: imageLoading ? "none" : "block" }}
//                     />
//                   ) : mediaType === "video" ? (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <Video className="h-6 w-6 text-gray-400" />
//                     </div>
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       {getFileIcon(selectedMedia?.format)}
//                     </div>
//                   )}
//                 </div>
//                 <div className="text-left">
//                   <p className="font-medium text-sm truncate group-hover:text-primary/90 transition-all duration-500">
//                     {selectedMedia
//                       ? formatFileName(selectedMedia.public_id, selectedMedia.format)
//                       : value.split("/").pop()
//                     }
//                   </p>
//                   {selectedMedia && (
//                     <p className="text-xs text-gray-500">
//                       {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB •{" "}
//                       {selectedMedia.format.toUpperCase()}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 text-gray-500">
//                 {renderIcon()}
//                 <span>{placeholder || `Select ${mediaType}...`}</span>
//               </div>
//             )}
//           </Button>

//           {/* Clear selection button */}
//           {(selectedMedia || isLocalDefault) && !isMediaLoading && (
//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={() => onSelect("")}
//               className="text-red-500 hover:text-red-700 cursor-pointer"
//             >
//               <X className="h-4 w-4 mr-1" />
//               Clear Selection
//             </Button>
//           )}

//           {/* Preview */}
//           {(selectedMedia || isLocalDefault) && !isMediaLoading && (
//             <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
//               {previewLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
//                   <div className="text-center">
//                     <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
//                     <p className="text-sm text-gray-500">Loading preview...</p>
//                   </div>
//                 </div>
//               )}

//               {renderPreview()}

//               {!previewLoading && selectedMedia && (
//                 <div className="absolute top-2 right-2">
//                   <Badge variant="secondary" className="text-xs">
//                     {selectedMedia.format.toUpperCase()}
//                   </Badge>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Loading preview while resolving media */}
//           {isResolvingMedia && (
//             <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
//               <div className="text-center">
//                 <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
//                 <p className="text-sm text-gray-500">Loading preview...</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Advanced Media Selector Modal */}
//       <AdvancedMediaSelector
//         isOpen={selectorOpen}
//         onOpenChange={setSelectorOpen}
//         onSelect={handleMediaSelect}
//         selectedValue={value}
//         mediaType={mediaType === "pdf" ? "file" : mediaType}
//         title={`Select ${label}`}
//       />
//     </>
//   );
// };

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
  const [localSelectedMedia, setLocalSelectedMedia] = useState<MediaItem | null>(null);

  const { items: mediaItems, status } = useSelector(
    (state: RootState) => state.media
  );

  // Resolve selected media independently of current Redux filter state
  const selectedMedia = useMemo(() => {
    // First try to find in current Redux items
    let found = mediaItems.find((item) => 
      item.secure_url === value || item.url === value
    );
    
    // If not found in Redux but we have a local cache, use that
    if (!found && localSelectedMedia && 
        (localSelectedMedia.secure_url === value || localSelectedMedia.url === value)) {
      found = localSelectedMedia;
    }
    
    return found;
  }, [mediaItems, value, localSelectedMedia]);

  // Cache selected media when found
  useEffect(() => {
    if (selectedMedia && !localSelectedMedia) {
      setLocalSelectedMedia(selectedMedia);
    }
  }, [selectedMedia, localSelectedMedia]);

  const handleMediaSelect = (media: MediaItem) => {
    onSelect(media.secure_url);
    setLocalSelectedMedia(media); // Cache the selected media locally
    setSelectorOpen(false);
  };

  // Clear local cache when value changes externally
  useEffect(() => {
    if (!value) {
      setLocalSelectedMedia(null);
    }
  }, [value]);

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split("/").pop() || publicId;
    return `${fileName}.${format}`;
  };

  const getFileIcon = (format?: string) => {
    if (!format) return <File className="h-6 w-6 text-gray-400" />;
    
    const lowerFormat = format.toLowerCase();
    if (lowerFormat === 'pdf') return <FileText className="h-6 w-6 text-red-500" />;
    if (['doc', 'docx'].includes(lowerFormat)) return <FileText className="h-6 w-6 text-blue-500" />;
    if (['xls', 'xlsx'].includes(lowerFormat)) return <FileText className="h-6 w-6 text-green-500" />;
    return <File className="h-6 w-6 text-gray-400" />;
  };

  const isLocalDefault =
    value?.startsWith("/images/") ||
    value?.startsWith("/static/") ||
    value?.startsWith("/assets/");

  const isMediaLoading = status === "loading";
  
  // Use either selectedMedia or localSelectedMedia for display
  const displayMedia = selectedMedia || localSelectedMedia;
  const hasValidMedia = displayMedia || isLocalDefault;

  const renderIcon = () => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "file":
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const renderPreview = () => {
    if (mediaType === "image") {
      return (
        <img
          src={displayMedia?.secure_url || value}
          alt="Preview"
          className="w-full h-full object-cover"
          onLoad={() => setPreviewLoading(false)}
          onError={() => setPreviewLoading(false)}
          onLoadStart={() => setPreviewLoading(true)}
          style={{ display: previewLoading ? "none" : "block" }}
        />
      );
    }

    if (mediaType === "video") {
      return (
        <video
          src={displayMedia?.secure_url || value}
          className="w-full h-full object-cover"
          muted
          onLoadedData={() => setPreviewLoading(false)}
          onError={() => setPreviewLoading(false)}
          onLoadStart={() => setPreviewLoading(true)}
          style={{ display: previewLoading ? "none" : "block" }}
        />
      );
    }

    // For files and PDFs
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        {getFileIcon(displayMedia?.format)}
        <p className="text-xs text-gray-600 mt-2 text-center px-2">
          {displayMedia 
            ? formatFileName(displayMedia.public_id, displayMedia.format)
            : value.split("/").pop()
          }
        </p>
        {displayMedia && (
          <p className="text-xs text-gray-500">
            {(displayMedia.bytes / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-medium">{label}</Label>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectorOpen(true)}
            disabled={isMediaLoading}
            className="w-full group justify-start hover:bg-primary/20 h-auto p-3 border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          >
            {isMediaLoading ? (
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
            ) : hasValidMedia ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                  {mediaType === "image" ? (
                    <img
                      src={displayMedia?.secure_url || value}
                      alt="Selected"
                      className="w-full h-full object-cover"
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                      onLoadStart={() => setImageLoading(true)}
                      style={{ display: imageLoading ? "none" : "block" }}
                    />
                  ) : mediaType === "video" ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(displayMedia?.format)}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm truncate group-hover:text-primary/90 transition-all duration-500">
                    {displayMedia
                      ? formatFileName(displayMedia.public_id, displayMedia.format)
                      : value.split("/").pop()
                    }
                  </p>
                  {displayMedia && (
                    <p className="text-xs text-gray-500">
                      {(displayMedia.bytes / 1024 / 1024).toFixed(2)} MB •{" "}
                      {displayMedia.format.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                {renderIcon()}
                <span>{placeholder || `Select ${mediaType}...`}</span>
              </div>
            )}
          </Button>

          {/* Clear selection button */}
          {hasValidMedia && !isMediaLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onSelect("");
                setLocalSelectedMedia(null);
              }}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}

          {/* Preview */}
          {/* {hasValidMedia && !isMediaLoading && (
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading preview...</p>
                  </div>
                </div>
              )}

              {renderPreview()}

              {!previewLoading && displayMedia && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {displayMedia.format.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>

      {/* Advanced Media Selector Modal */}
      <AdvancedMediaSelector
        isOpen={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleMediaSelect}
        selectedValue={value}
        mediaType={mediaType === "pdf" ? "file" : mediaType}
        title={`Select ${label}`}
      />
    </>
  );
};

export default MediaSelectButton;