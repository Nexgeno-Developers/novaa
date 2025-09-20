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
import { Image as ImageIcon, Video } from "lucide-react";

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

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  const [localData, setLocalData] = useState({
    title: section?.content?.title || "",
    subtitle: section?.content?.subtitle || "",
    description: section?.content?.description || "",
    buttonText: section?.content?.buttonText || "",
    bgType: section?.content?.bgType || "image",
    bgImage1: section?.content?.bgImage1 || "",
    bgImage2: section?.content?.bgImage2 || "",
    bgVideo: section?.content?.bgVideo || "",
    topOverlay: section?.content?.topOverlay ?? true,
    bottomOverlay: section?.content?.bottomOverlay ?? true,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "",
        subtitle: section.content.subtitle || "",
        description: section.content.description || "",
        buttonText: section.content.buttonText || "",
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

  useEffect(() => {
    if (!initialDataSetRef.current) {
      dispatch(fetchMedia({ limit: 500, reset: true }));
      initialDataSetRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [localData, hasLocalChanges]);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="About Us Section"
        description="Configure About Us page content and settings"
      >
        <div className="space-y-4">
          {/* Basic Content */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Main title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={localData.subtitle}
                onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localData.buttonText}
                onChange={(e) =>
                  handleFieldChange("buttonText", e.target.value)
                }
                placeholder="Button text"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <div className="min-h-[150px]">
              <RichTextEditor
                value={localData.description}
                onEditorChange={(content) =>
                  handleFieldChange("description", content)
                }
              />
            </div>
          </div>

          {/* Background Settings */}
          <div>
            <Label>Background Type</Label>
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
                  className="flex items-center pt-2 cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Image
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="bg-video" />
                <Label
                  htmlFor="bg-video"
                  className="flex items-center pt-2 cursor-pointer"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Label>
              </div>
            </RadioGroup>
          </div>

          {localData.bgType === "image" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MediaSelectButton
                value={localData.bgImage1}
                onSelect={(value) => handleFieldChange("bgImage1", value)}
                mediaType="image"
                label="Image 1 (With Clouds)"
                placeholder="Select image with clouds"
              />
              <MediaSelectButton
                value={localData.bgImage2}
                onSelect={(value) => handleFieldChange("bgImage2", value)}
                mediaType="image"
                label="Image 2 (Without Clouds)"
                placeholder="Select image without clouds"
              />
            </div>
          ) : (
            <MediaSelectButton
              value={localData.bgVideo}
              onSelect={(value) => handleFieldChange("bgVideo", value)}
              mediaType="video"
              label="Background Video"
              placeholder="Select background video"
            />
          )}

          {/* <div>
                <Label className="text-sm mb-2 block">Overlay Settings</Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="topOverlay"
                      checked={localData.topOverlay}
                      onCheckedChange={(checked) =>
                        handleFieldChange("topOverlay", checked)
                      }
                    />
                    <Label htmlFor="topOverlay" className="text-sm">Top Overlay</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bottomOverlay"
                      checked={localData.bottomOverlay}
                      onCheckedChange={(checked) =>
                        handleFieldChange("bottomOverlay", checked)
                      }
                    />
                    <Label htmlFor="bottomOverlay" className="text-sm">Bottom Overlay</Label>
                  </div>
                </div>
              </div> */}
        </div>
      </BaseSectionManager>
    );
  }
}
