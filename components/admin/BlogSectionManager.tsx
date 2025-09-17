// components/admin/BlogSectionManager.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

interface BlogSectionData {
  title: string;
  description: string;
  showCategories: boolean;
  maxBlogs: number;
  displayMode: "grid" | "list";
  showReadMore: boolean;
}

interface BlogSectionManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
  pageSlug?: string;
}

export default function BlogSectionManager({
  section,
  onChange,
  showSaveButton = true,
  pageSlug
}: BlogSectionManagerProps) {
  // Use refs to track initialization state
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  // Local state for section-based management
  const [localData, setLocalData] = useState<BlogSectionData>({
    title: section?.content?.title || "Our Blog",
    description: section?.content?.description || "Stay updated with the latest insights and news",
    showCategories: section?.content?.showCategories ?? true,
    maxBlogs: section?.content?.maxBlogs || 6,
    displayMode: section?.content?.displayMode || "grid",
    showReadMore: section?.content?.showReadMore ?? true,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData: BlogSectionData = {
        title: section.content.title || "Our Blog",
        description: section.content.description || "Stay updated with the latest insights and news",
        showCategories: section.content.showCategories ?? true,
        maxBlogs: section.content.maxBlogs || 6,
        displayMode: section.content.displayMode || "grid",
        showReadMore: section.content.showReadMore ?? true,
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    }
  }, [section]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges && isInitializedRef.current) {
      onChange({ content: localData });
    }
  }, [localData, hasLocalChanges]);

  const handleFieldChange = (field: keyof BlogSectionData, value: any) => {
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
        title="Blog Section"
        description="Configure blog section settings and display options"
      >
        <div className="space-y-6">
          <Card className="pb-6 ring-2 ring-primary/20 bg-indigo-50/30">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                Blog Section Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blogTitle" className="text-sm font-medium text-primary/90">
                    Section Title
                  </Label>
                  <Input
                    id="blogTitle"
                    value={localData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Our Blog"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBlogs" className="text-sm font-medium text-primary/90">
                    Maximum Blogs to Show
                  </Label>
                  <Input
                    id="maxBlogs"
                    type="number"
                    value={localData.maxBlogs}
                    onChange={(e) =>
                      handleFieldChange("maxBlogs", parseInt(e.target.value) || 6)
                    }
                    min="1"
                    max="100"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blogDescription" className="text-sm font-medium text-primary/90">
                  Section Description
                </Label>
                <Textarea
                  id="blogDescription"
                  value={localData.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Stay updated with the latest insights and news"
                  rows={3}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Display Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayMode" className="text-sm font-medium text-primary/90">
                    Display Mode
                  </Label>
                  <Select
                    value={localData.displayMode}
                    onValueChange={(value) =>
                      handleFieldChange("displayMode", value as "grid" | "list")
                    }
                  >
                    <SelectTrigger className="cursor-pointer border-gray-300 focus:border-primary focus:ring-primary">
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent className="admin-theme">
                      <SelectItem value="grid" className="cursor-pointer">Grid Layout</SelectItem>
                      <SelectItem value="list" className="cursor-pointer">List Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showCategories"
                    checked={localData.showCategories}
                    onCheckedChange={(checked) =>
                      handleFieldChange("showCategories", checked)
                    }
                  />
                  <Label htmlFor="showCategories" className="text-sm font-medium text-primary/90">
                    Show Category Filter
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showReadMore"
                    checked={localData.showReadMore}
                    onCheckedChange={(checked) =>
                      handleFieldChange("showReadMore", checked)
                    }
                  />
                  <Label htmlFor="showReadMore" className="text-sm font-medium text-primary/90">
                    Show "View All Blogs" Button
                  </Label>
                </div>
              </div>

              {/* Preview Information */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2 text-primary/90">Preview Settings:</h3>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Title: "{localData.title}"</li>
                  <li>• Shows up to {localData.maxBlogs} blogs</li>
                  <li>
                    • Display mode:{" "}
                    {localData.displayMode === "grid" ? "Grid" : "List"} layout
                  </li>
                  <li>
                    • Category filter:{" "}
                    {localData.showCategories ? "Enabled" : "Disabled"}
                  </li>
                  <li>
                    • Read more button: {localData.showReadMore ? "Shown" : "Hidden"}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseSectionManager>
    );
  }

  // Fallback if no section prop (shouldn't happen in your use case)
  return null;
}