"use client";

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux';
import { fetchMedia, setQuery, setType, resetMedia, MediaItem } from '@/redux/slices/mediaSlice';
import { 
  fetchAboutData, 
  saveAboutData, 
  updateField, 
  updateDescription,
  clearError,
  AboutData 
} from '@/redux/slices/aboutSlice';
import { toast } from 'sonner';
import { AdvancedMediaSelector } from '@/components/admin/AdvancedMediaSelector';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Video, 
  Settings,
  FileText,
  Mouse,
  Layers,
  RefreshCw,
  CheckCircle,
  X
} from 'lucide-react';

// Custom Editor Component
import RichTextEditor from '@/components/admin/Editor';

interface MediaSelectButtonProps {
  value: string;
  onSelect: (url: string) => void;
  mediaType: 'image' | 'video';
  label: string;
  placeholder?: string;
}

function MediaSelectButton({ 
  value, 
  onSelect, 
  mediaType, 
  label,
  placeholder 
}: MediaSelectButtonProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { items: mediaItems } = useSelector((state: RootState) => state.media);

  const selectedMedia = useMemo(() => 
    mediaItems.find(item => item.secure_url === value),
    [mediaItems, value]
  );

  const handleMediaSelect = (media: MediaItem) => {
    onSelect(media.secure_url);
    setSelectorOpen(false);
  };

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split('/').pop() || publicId;
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
                  {mediaType === 'image' ? (
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
                    {formatFileName(selectedMedia.public_id, selectedMedia.format)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB • {selectedMedia.format.toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                {mediaType === 'image' ? (
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
              onClick={() => onSelect('')}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Selection
            </Button>
          )}

          {/* Preview */}
          {selectedMedia && (
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {mediaType === 'image' ? (
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
}

interface MediaSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  mediaItems: MediaItem[];
  mediaType: 'image' | 'video';
  loading: boolean;
  label: string;
  placeholder?: string;
}


function MediaSelect({ 
  value, 
  onValueChange, 
  mediaItems, 
  mediaType, 
  loading, 
  label,
  placeholder 
}: MediaSelectProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = useMemo(() => 
    mediaItems.filter(item => item.resource_type === mediaType), 
    [mediaItems, mediaType]
  );

  const currentMedia = useMemo(() => 
    filteredMedia.find(item => item.secure_url === value),
    [filteredMedia, value]
  );

  const handlePreview = (media: MediaItem) => {
    setSelectedMedia(media);
    setPreviewOpen(true);
  };

  const formatFileName = (publicId: string, format: string) => {
    const fileName = publicId.split('/').pop() || publicId;
    return `${fileName}.${format}`;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || `Select ${mediaType}...`} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {loading ? (
            <SelectItem value="loading" disabled>
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading {mediaType}s...
              </div>
            </SelectItem>
          ) : filteredMedia.length === 0 ? (
            <SelectItem value="empty" disabled>
              No {mediaType}s available
            </SelectItem>
          ) : (
            filteredMedia.map(item => (
              <SelectItem key={item.public_id} value={item.secure_url}>
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">
                    {formatFileName(item.public_id, item.format)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(item);
                    }}
                    className="ml-2 h-6 w-6 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Preview thumbnail */}
      {currentMedia && (
        <div className="relative">
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            {mediaType === 'image' ? (
              <img
                src={currentMedia.secure_url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={currentMedia.secure_url}
                className="w-full h-full object-cover"
                muted
              />
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                {currentMedia.format.toUpperCase()}
              </Badge>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePreview(currentMedia)}
              className="absolute bottom-2 right-2"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedMedia && formatFileName(selectedMedia.public_id, selectedMedia.format)}
            </DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                {selectedMedia.resource_type === 'image' ? (
                  <img
                    src={selectedMedia.secure_url}
                    alt="Preview"
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <video
                    src={selectedMedia.secure_url}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span> {selectedMedia.resource_type}
                </div>
                <div>
                  <span className="text-gray-500">Format:</span> {selectedMedia.format.toUpperCase()}
                </div>
                <div>
                  <span className="text-gray-500">Size:</span> {(selectedMedia.bytes / 1024 / 1024).toFixed(2)} MB
                </div>
                {selectedMedia.width && selectedMedia.height && (
                  <div>
                    <span className="text-gray-500">Dimensions:</span> {selectedMedia.width} × {selectedMedia.height}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AboutManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: aboutData, loading, saving, error, lastSaved } = useSelector((state: RootState) => state.about);
  const { items: mediaItems, loading: mediaLoading } = useSelector((state: RootState) => state.media);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAboutData());
    dispatch(fetchMedia({ limit: 500, reset: true })); // Fetch all media for dropdowns
  }, [dispatch]);

  // Clear error after showing toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleFieldChange = (field: keyof AboutData, value: any) => {
    dispatch(updateField({ field, value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aboutData) return;
    
    try {
      await dispatch(saveAboutData(aboutData)).unwrap();
      toast.success('About Us page updated successfully!');
    } catch (error) {
      toast.error('Failed to update. Please try again.');
    }
  };

  const handleRefreshMedia = () => {
    dispatch(fetchMedia({ limit: 500, reset: true }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading About Us content...</p>
        </div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Failed to load About Us content</p>
            <Button onClick={() => dispatch(fetchAboutData())}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="h-8 w-8 mr-3 text-primary" />
                About Us Management
              </h1>
              <p className="text-gray-600 mt-1">Configure your About Us page content and settings</p>
              {lastSaved && (
                <div className="flex items-center mt-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefreshMedia}
                disabled={mediaLoading}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${mediaLoading ? 'animate-spin' : ''}`} />
                Refresh Media
              </Button>
              
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={saving}
                className="bg-primary text-white hover:bg-primary/90 transition-colors"
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Page Content Section */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <CardTitle className="flex items-center text-gray-800">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Main Title
                  </Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={aboutData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="Enter main title..."
                  />
                </div>
                
                <div className="flex items-center space-x-3 pt-6">
                  <Switch 
                    id="showSubtitle" 
                    checked={aboutData.showSubtitle}
                    onCheckedChange={(checked) => handleFieldChange('showSubtitle', checked)}
                  />
                  <Label htmlFor="showSubtitle" className="text-sm font-medium text-gray-700">
                    Show "NOVAA" Subtitle
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <div className="border border-gray-300 rounded-lg">
                  <RichTextEditor 
                    value={aboutData.description} 
                    onEditorChange={(content) => dispatch(updateDescription(content))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Button Section */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
              <CardTitle className="flex items-center text-gray-800">
                <Mouse className="h-5 w-5 mr-2 text-green-600" />
                Call-to-Action Button
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="buttonText" className="text-sm font-medium text-gray-700">
                    Button Text
                  </Label>
                  <Input 
                    id="buttonText" 
                    name="buttonText" 
                    value={aboutData.buttonText}
                    onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., Discover More"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buttonUrl" className="text-sm font-medium text-gray-700">
                    Button URL
                  </Label>
                  <Input 
                    id="buttonUrl" 
                    name="buttonUrl" 
                    value={aboutData.buttonUrl}
                    onChange={(e) => handleFieldChange('buttonUrl', e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., /about-us"
                  />
                </div>
              </div>

              {/* Button Preview */}
              {aboutData.buttonText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview:</Label>
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    {aboutData.buttonText}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Background & Effects Section */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
              <CardTitle className="flex items-center text-gray-800">
                <Layers className="h-5 w-5 mr-2 text-purple-600" />
                Background & Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Background Type Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Background Type</Label>
                <RadioGroup
                  value={aboutData.bgType}
                  onValueChange={(value: 'image' | 'video') => handleFieldChange('bgType', value)}
                  className="flex items-center space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="bg-image" />
                    <Label htmlFor="bg-image" className="flex items-center cursor-pointer">
                      <ImageIcon className="h-4 w-4 mr-1 text-blue-500" />
                      Image Background
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="bg-video" />
                    <Label htmlFor="bg-video" className="flex items-center cursor-pointer">
                      <Video className="h-4 w-4 mr-1 text-purple-500" />
                      Video Background
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Conditional Background Options */}
              {aboutData.bgType === 'image' ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <MediaSelectButton
                    value={aboutData.bgImage1}
                    onSelect={(value) => handleFieldChange('bgImage1', value)}
                    mediaType="image"
                    label="Background Image 1 (With Clouds)"
                    placeholder="Select image with clouds..."
                  />
                  
                  <MediaSelectButton
                    value={aboutData.bgImage2}
                    onSelect={(value) => handleFieldChange('bgImage2', value)}
                    mediaType="image"
                    label="Background Image 2 (Without Clouds)"
                    placeholder="Select image without clouds..."
                  />
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <MediaSelectButton
                    value={aboutData.bgVideo}
                    onSelect={(value) => handleFieldChange('bgVideo', value)}
                    mediaType="video"
                    label="Background Video"
                    placeholder="Select background video..."
                  />
                </div>
              )}

              {/* Overlay Controls */}
              <div className="pt-4 border-t border-gray-200">
                <Label className="text-sm font-medium text-gray-700 mb-4 block">Overlay Effects</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Switch 
                      id="topOverlay" 
                      checked={aboutData.topOverlay}
                      onCheckedChange={(checked) => handleFieldChange('topOverlay', checked)}
                    />
                    <Label htmlFor="topOverlay" className="text-sm font-medium text-gray-700">
                      Enable Top Overlay
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Switch 
                      id="bottomOverlay" 
                      checked={aboutData.bottomOverlay}
                      onCheckedChange={(checked) => handleFieldChange('bottomOverlay', checked)}
                    />
                    <Label htmlFor="bottomOverlay" className="text-sm font-medium text-gray-700">
                      Enable Bottom Overlay
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl">
              <CardTitle className="flex items-center text-gray-800">
                <Eye className="h-5 w-5 mr-2 text-amber-600" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                {/* Background */}
                {aboutData.bgType === 'image' ? (
                  aboutData.bgImage1 && (
                    <img
                      src={aboutData.bgImage1}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  aboutData.bgVideo && (
                    <video
                      src={aboutData.bgVideo}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                    />
                  )
                )}

                {/* Overlays */}
                {aboutData.topOverlay && (
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/30 to-transparent" />
                )}
                {aboutData.bottomOverlay && (
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
                )}

                {/* Content Preview */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
                  <h2 className="text-3xl font-bold mb-2">{aboutData.title}</h2>
                  {aboutData.showSubtitle && (
                    <p className="text-lg opacity-90 mb-4">NOVAA</p>
                  )}
                  <div className="text-sm opacity-80 mb-6 max-w-md line-clamp-3">
                    <div dangerouslySetInnerHTML={{ __html: aboutData.description }} />
                  </div>
                  {aboutData.buttonText && (
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      {aboutData.buttonText}
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2 text-center">
                * This is a simplified preview. Actual styling may vary on the live site.
              </p>
            </CardContent>
          </Card>

          {/* Media Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <ImageIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-700">Available Images</p>
                    <p className="text-xl font-bold text-blue-800">
                      {mediaItems.filter(item => item.resource_type === 'image').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Video className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-purple-700">Available Videos</p>
                    <p className="text-xl font-bold text-purple-800">
                      {mediaItems.filter(item => item.resource_type === 'video').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-700">Configuration</p>
                    <p className="text-xl font-bold text-green-800">
                      {aboutData.bgType.charAt(0).toUpperCase() + aboutData.bgType.slice(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </form>
      </div>
    </div>
  );
}