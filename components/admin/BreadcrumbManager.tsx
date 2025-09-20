"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import MediaSelectButton from "@/components/admin/MediaSelectButton";
import Editor from "@/components/admin/Editor";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

interface BreadcrumbManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
  pageSlug?: string;
}

export default function BreadcrumbManager({
  section,
  onChange,
  showSaveButton = true,
  pageSlug,
}: BreadcrumbManagerProps) {
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  const [localData, setLocalData] = useState({
    title: section?.content?.title || "",
    description: section?.content?.description || "",
    backgroundImageUrl: section?.content?.backgroundImageUrl || "",
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "",
        description: section.content.description || "",
        backgroundImageUrl: section.content.backgroundImageUrl || "",
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

  const handleMediaSelect = (url: string) => {
    handleFieldChange("backgroundImageUrl", url);
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Breadcrumb Section"
        description="Configure the breadcrumb banner for this page"
      >
        <div className="space-y-4">
          {/* Basic Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="pb-2">
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  value={localData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="e.g., About Our Company"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Editor
                  value={localData.description}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </div>

            <div>
              <MediaSelectButton
                label="Background Image"
                mediaType="image"
                value={localData.backgroundImageUrl}
                onSelect={handleMediaSelect}
              />
            </div>
          </div>
        </div>
      </BaseSectionManager>
    );
  }

  return null;
}
