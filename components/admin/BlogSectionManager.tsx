"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import BaseSectionManager from "@/components/admin/BaseSectionManager";

interface BlogSectionData {
  title: string;
  description: string;
  showCategories: boolean;
  maxBlogs: number;
  initialBlogs: number;
  displayMode: "grid" | "list";
  showReadMore: boolean;
  enableLoadMore: boolean;
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
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  const [localData, setLocalData] = useState<BlogSectionData>({
    title: section?.content?.title || "Our Blog",
    description: section?.content?.description || "Stay updated with the latest insights and news",
    showCategories: section?.content?.showCategories ?? true,
    maxBlogs: section?.content?.maxBlogs || 10,
    initialBlogs: section?.content?.initialBlogs || 10,
    displayMode: section?.content?.displayMode || "grid",
    showReadMore: section?.content?.showReadMore ?? true,
    enableLoadMore: section?.content?.enableLoadMore ?? true,
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData: BlogSectionData = {
        title: section.content.title || "Our Blog",
        description: section.content.description || "Stay updated with the latest insights and news",
        showCategories: section.content.showCategories ?? true,
        maxBlogs: section.content.maxBlogs || 10,
        initialBlogs: section.content.initialBlogs || 10,
        displayMode: section.content.displayMode || "grid",
        showReadMore: section.content.showReadMore ?? true,
        enableLoadMore: section.content.enableLoadMore ?? true,
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

  const handleFieldChange = (field: keyof BlogSectionData, value: any) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Blog Section"
        description="Configure blog section settings and display options"
      >
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side - Content */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="blogTitle">Section Title</Label>
                    <Input
                      id="blogTitle"
                      value={localData.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      placeholder="Our Blog"
                    />
                  </div>

                  <div>
                    <Label htmlFor="blogDescription">Description</Label>
                    <Textarea
                      id="blogDescription"
                      value={localData.description}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                      placeholder="Stay updated with the latest insights and news"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="displayMode">Display Mode</Label>
                    <Select
                      value={localData.displayMode}
                      onValueChange={(value) =>
                        handleFieldChange("displayMode", value as "grid" | "list")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid Layout</SelectItem>
                        <SelectItem value="list">List Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Side - Settings */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="initialBlogs" className="text-xs">Initial Blogs</Label>
                      <Input
                        id="initialBlogs"
                        type="number"
                        value={localData.initialBlogs}
                        onChange={(e) =>
                          handleFieldChange("initialBlogs", parseInt(e.target.value) || 10)
                        }
                        min="1"
                        max="50"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBlogs" className="text-xs">Max per Load</Label>
                      <Input
                        id="maxBlogs"
                        type="number"
                        value={localData.maxBlogs}
                        onChange={(e) =>
                          handleFieldChange("maxBlogs", parseInt(e.target.value) || 10)
                        }
                        min="1"
                        max="50"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="showCategories"
                        checked={localData.showCategories}
                        onCheckedChange={(checked) =>
                          handleFieldChange("showCategories", checked)
                        }
                      />
                      <Label htmlFor="showCategories" className="text-sm">
                        Show Category Filter
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableLoadMore"
                        checked={localData.enableLoadMore}
                        onCheckedChange={(checked) =>
                          handleFieldChange("enableLoadMore", checked)
                        }
                      />
                      <Label htmlFor="enableLoadMore" className="text-sm">
                        Enable Load More
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
                      <Label htmlFor="showReadMore" className="text-sm">
                        Show "View All" Button
                      </Label>
                    </div>
                  </div>

                  {/* Compact Preview */}
                  <div className="p-3 bg-gray-50 rounded text-xs">
                    <div className="font-medium mb-1">Preview:</div>
                    <div>Shows {localData.initialBlogs} blogs initially</div>
                    <div>Loads {localData.maxBlogs} more per click</div>
                    <div>Layout: {localData.displayMode}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BaseSectionManager>
    );
  }

  return null;
}