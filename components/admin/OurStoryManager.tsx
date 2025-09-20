"use client";

import React, { useEffect, useState, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Images, Video } from "lucide-react";

import MediaSelectButton from "@/components/admin/MediaSelectButton";
import Editor from "@/components/admin/Editor";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

interface OurStoryManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
  pageSlug?: string;
}

export default function OurStoryManager({
  section,
  onChange,
  showSaveButton = true,
  pageSlug,
}: OurStoryManagerProps) {
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  const [localData, setLocalData] = useState({
    title: section?.content?.title || "",
    description: section?.content?.description || "",
    mediaType: section?.content?.mediaType || "video",
    mediaUrl: section?.content?.mediaUrl || "",
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "",
        description: section.content.description || "",
        mediaType: section.content.mediaType || "video",
        mediaUrl: section.content.mediaUrl || "",
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    }
  }, [section]);

  useEffect(() => {
    if (onChange && hasLocalChanges && isInitializedRef.current) {
      onChange({ content: localData });
    }
  }, [localData, hasLocalChanges]);

  const handleFieldChange = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleEditorChange = (content: string) => {
    handleFieldChange("description", content);
  };

  const handleMediaTypeChange = (value: "image" | "video") => {
    setLocalData((prev) => ({ ...prev, mediaType: value, mediaUrl: "" }));
    setHasLocalChanges(true);
  };

  const handleMediaSelect = (url: string) => {
    handleFieldChange("mediaUrl", url);
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Our Story Section"
        description="Configure the main story content and media for this page"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Content */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={localData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="e.g., OUR STORY"
                />
              </div>

              <div>
                <Label>Description</Label>
                <div className="min-h-[120px]">
                  <Editor
                    value={localData.description}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Media */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm mb-2 block">Media Type</Label>
                <RadioGroup
                  value={localData.mediaType}
                  onValueChange={handleMediaTypeChange}
                  className="flex items-center space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label
                      htmlFor="video"
                      className="flex items-center cursor-pointer"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Video
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <Label
                      htmlFor="image"
                      className="flex items-center cursor-pointer"
                    >
                      <Images className="h-4 w-4 mr-1" />
                      Image
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <MediaSelectButton
                  label={
                    localData.mediaType === "video"
                      ? "Select Video"
                      : "Select Image"
                  }
                  mediaType={localData.mediaType as "image" | "video"}
                  value={localData.mediaUrl}
                  onSelect={handleMediaSelect}
                  placeholder={`Select ${localData.mediaType}`}
                />
              </div>
            </div>
          </div>
        </div>
      </BaseSectionManager>
    );
  }

  return null;
}
