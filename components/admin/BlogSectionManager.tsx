// components/admin/BlogSectionManager.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface BlogSectionData {
  title: string;
  description: string;
  showCategories: boolean;
  maxBlogs: number;
  displayMode: "grid" | "list";
  showReadMore: boolean;
}

interface BlogSectionManagerProps {
  initialData?: BlogSectionData;
  onSave?: (data: BlogSectionData) => void;
  onChange?: (data: BlogSectionData) => void;
  pageSlug?: string;
}

export default function BlogSectionManager({
  initialData,
  onSave,
  onChange,
  pageSlug = "blog",
}: BlogSectionManagerProps) {
  const [formData, setFormData] = useState<BlogSectionData>({
    title: "Our Blog",
    description: "Stay updated with the latest insights and news",
    showCategories: true,
    maxBlogs: 6,
    displayMode: "grid",
    showReadMore: true,
    ...initialData,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof BlogSectionData, value: any) => {
    const newData = {
      ...formData,
      [field]: value,
    };
    setFormData(newData);
    setHasChanges(true);

    if (onChange) {
      onChange(newData);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
      setHasChanges(false);
      toast.success("Blog section settings saved successfully");
    }
  };

  return (
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
              <Label htmlFor="blogTitle" className="text-primary/90">Section Title</Label>
              <Input
                id="blogTitle"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Our Blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxBlogs" className="text-primary/90">Maximum Blogs to Show</Label>
              <Input
                id="maxBlogs"
                type="number"
                value={formData.maxBlogs}
                onChange={(e) =>
                  handleInputChange("maxBlogs", parseInt(e.target.value) || 6)
                }
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blogDescription" className="text-primary/90">Section Description</Label>
            <Textarea
              id="blogDescription"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Stay updated with the latest insights and news"
              rows={3}
            />
          </div>

          {/* Display Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayMode" className="text-primary/90">Display Mode</Label>
              <Select
                value={formData.displayMode}
                onValueChange={(value) =>
                  handleInputChange("displayMode", value as "grid" | "list")
                }
              >
                <SelectTrigger className="cursor-pointer">
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
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showCategories"
                checked={formData.showCategories}
                onCheckedChange={(checked) =>
                  handleInputChange("showCategories", checked)
                }
              />
              <Label htmlFor="showCategories">Show Category Filter</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="showReadMore"
                checked={formData.showReadMore}
                onCheckedChange={(checked) =>
                  handleInputChange("showReadMore", checked)
                }
              />
              <Label htmlFor="showReadMore">Show "View All Blogs" Button</Label>
            </div>
          </div>

          {/* Preview Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Preview Settings:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Title: "{formData.title}"</li>
              <li>• Shows up to {formData.maxBlogs} blogs</li>
              <li>
                • Display mode:{" "}
                {formData.displayMode === "grid" ? "Grid" : "List"} layout
              </li>
              <li>
                • Category filter:{" "}
                {formData.showCategories ? "Enabled" : "Disabled"}
              </li>
              <li>
                • Read more button: {formData.showReadMore ? "Shown" : "Hidden"}
              </li>
            </ul>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end">
              <Button onClick={handleSave} className="text-background">
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
