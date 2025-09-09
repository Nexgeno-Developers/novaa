"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { fetchMedia, MediaItem } from "@/redux/slices/mediaSlice";
import MediaSelectButton from "./MediaSelectButton";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Video, Layers, X } from "lucide-react";

// Custom Editor Component
import RichTextEditor from "@/components/admin/Editor";
import { useAppDispatch } from "@/redux/hooks";

interface AboutManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}
export default function AboutManager({
  section,
  onChange,
  showSaveButton = true,
}: AboutManagerProps = {}) {
  const dispatch = useAppDispatch();
  const { items: mediaItems } = useSelector((state: RootState) => state.media);

  // Use refs to track initialization state
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Local state for section-based management
  const [localData, setLocalData] = useState({
    title: section?.content?.title || "",
    subtitle: section?.content?.subtitle || "",
    description: section?.content?.description || "",
    buttonText: section?.content?.buttonText || "",
    // buttonUrl: section?.content?.buttonUrl || '',
    bgType: section?.content?.bgType || "image",
    bgImage1: section?.content?.bgImage1 || "",
    bgImage2: section?.content?.bgImage2 || "",
    bgVideo: section?.content?.bgVideo || "",
    topOverlay: section?.content?.topOverlay ?? true,
    bottomOverlay: section?.content?.bottomOverlay ?? true,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "",
        subtitle: section.content.subtitle || "",
        description: section.content.description || "",
        buttonText: section.content.buttonText || "",
        // buttonUrl: section.content.buttonUrl || '',
        bgType: section.content.bgType || "image",
        bgImage1: section.content.bgImage1 || "",
        bgImage2: section.content.bgImage2 || "",
        bgVideo: section.content.bgVideo || "",
        topOverlay: section.content.topOverlay ?? true,
        bottomOverlay: section.content.bottomOverlay ?? true,
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
      setOriginalData(JSON.parse(JSON.stringify(newData)));
    }
  }, [section]);

  // Load media on mount
  useEffect(() => {
    if (!initialDataSetRef.current) {
      dispatch(fetchMedia({ limit: 500, reset: true }));
      initialDataSetRef.current = true;
    }
  }, [dispatch]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [localData , hasLocalChanges]);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  // If section prop is provided, render within BaseSectionManager
  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="About Us Section"
        description="Configure your About Us page content and settings"
      >
        <div className="space-y-6">
          {/* Page Content Section */}
          <Card className="shadow-sm border-0 bg-purple-50/30 ring-2 ring-primary/20">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-6 ">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-primary/90"
                >
                  Main Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={localData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Enter main title..."
                />
                <Label
                  htmlFor="subtitle"
                  className="text-sm font-medium text-primary/90"
                >
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={localData.subtitle}
                  onChange={(e) =>
                    handleFieldChange("subtitle", e.target.value)
                  }
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Enter subtitle..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary/90">
                  Description
                </Label>
                <div className="border border-gray-300 rounded-lg">
                  <RichTextEditor
                    value={localData.description}
                    onEditorChange={(content) =>
                      handleFieldChange("description", content)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button Section */}
          <Card className="shadow-sm border-0 bg-purple-50/30 ring-2 ring-secondary/20">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b-emerald-100 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
                Call-to-Action Button
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="buttonText"
                    className="text-sm font-medium text-primary/90"
                  >
                    Button Text
                  </Label>
                  <Input
                    id="buttonText"
                    name="buttonText"
                    value={localData.buttonText}
                    onChange={(e) =>
                      handleFieldChange("buttonText", e.target.value)
                    }
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., Discover More"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="buttonUrl" className="text-sm font-medium text-gray-700">
                    Button URL
                  </Label>
                  <Input 
                    id="buttonUrl" 
                    name="buttonUrl" 
                    value={localData.buttonUrl}
                    onChange={(e) => handleFieldChange('buttonUrl', e.target.value)}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., /about-us"
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Background & Effects Section */}
          <Card className="shadow-sm border-0 bg-purple-50/30 ring-2 ring-purple-200/20">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl border-b-2 border-b-pink-100/90">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <Layers className="h-5 w-5 mr-2 text-purple-600" />
                Background & Visual Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Background Type Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Background Type
                </Label>
                <RadioGroup
                  value={localData.bgType}
                  onValueChange={(value: "image" | "video") =>
                    handleFieldChange("bgType", value)
                  }
                  className="flex items-center space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="bg-image" />
                    <Label
                      htmlFor="bg-image"
                      className="flex items-center cursor-pointer"
                    >
                      <ImageIcon className="h-4 w-4 mr-1 text-blue-500" />
                      Image Background
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="bg-video" />
                    <Label
                      htmlFor="bg-video"
                      className="flex items-center cursor-pointer"
                    >
                      <Video className="h-4 w-4 mr-1 text-purple-500" />
                      Video Background
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Conditional Background Options */}
              {localData.bgType === "image" ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                  <MediaSelectButton
                    value={localData.bgImage1}
                    onSelect={(value) => handleFieldChange("bgImage1", value)}
                    mediaType="image"
                    label="Background Image 1 (With Clouds)"
                    placeholder="Select image with clouds..."
                  />

                  <MediaSelectButton
                    value={localData.bgImage2}
                    onSelect={(value) => handleFieldChange("bgImage2", value)}
                    mediaType="image"
                    label="Background Image 2 (Without Clouds)"
                    placeholder="Select image without clouds..."
                  />
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <MediaSelectButton
                    value={localData.bgVideo}
                    onSelect={(value) => handleFieldChange("bgVideo", value)}
                    mediaType="video"
                    label="Background Video"
                    placeholder="Select background video..."
                  />
                </div>
              )}

              {/* Overlay Controls */}
              <div className="pt-4 border-t border-gray-200">
                <Label className="text-sm font-medium text-primary/90 mb-4 block">
                  Overlay Effects
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Switch
                      id="topOverlay"
                      checked={localData.topOverlay}
                      onCheckedChange={(checked) =>
                        handleFieldChange("topOverlay", checked)
                      }
                    />
                    <Label
                      htmlFor="topOverlay"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enable Top Overlay
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Switch
                      id="bottomOverlay"
                      checked={localData.bottomOverlay}
                      onCheckedChange={(checked) =>
                        handleFieldChange("bottomOverlay", checked)
                      }
                    />
                    <Label
                      htmlFor="bottomOverlay"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enable Bottom Overlay
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseSectionManager>
    );
  }
}
