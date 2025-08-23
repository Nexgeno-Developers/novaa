"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  fetchOurStory,
  updateOurStory,
  OurStory,
} from "@/redux/slices/ourStorySlice";
import { Loader2 } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Custom Components
import MediaSelectButton from "@/components/admin/MediaSelectButton"; // Adjust path if needed
import Editor from "@/components/admin/Editor";

const manageablePages = [
  { slug: "about-us", label: "About Us" },
  // Add more pages that have an info section here
];

const OurStoryManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.infoSection);

  const [selectedSlug, setSelectedSlug] = useState(manageablePages[0].slug);
  const [formData, setFormData] = useState<Partial<OurStory>>({
    title: "",
    description: "",
    mediaType: "video",
    mediaUrl: "",
  });

  useEffect(() => {
    if (selectedSlug) {
      dispatch(fetchOurStory(selectedSlug));
    }
  }, [dispatch, selectedSlug]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMediaTypeChange = (value: "image" | "video") => {
    // When changing type, clear the URL to avoid saving an image URL for a video type and vice-versa
    setFormData((prev) => ({ ...prev, mediaType: value, mediaUrl: "" }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        updateOurStory({ slug: selectedSlug, data: formData })
      ).unwrap();
      toast.success("Info section has been updated.");
    } catch (error) {
      toast.error("Failed to update info section.");
    }
  };

  if (status === "loading" && (!data || data.pageSlug !== selectedSlug)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Info Section Manager</h1>
          <p className="text-muted-foreground">
            Manage the main info content for different pages.
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={status === "loading"} className="text-background cursor-pointer">
          {status === "loading" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Select Page to Edit</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {manageablePages.map((page) => (
                <SelectItem key={page.slug} value={page.slug}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., OUR STORY"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Editor
                value={formData.description || ""}
                onEditorChange={(content) =>
                  setFormData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader>
            <CardTitle>Media (Image or Video)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Media Type</Label>
              <RadioGroup
                value={formData.mediaType}
                onValueChange={handleMediaTypeChange}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image</Label>
                </div>
              </RadioGroup>
            </div>
            {formData.mediaType === "video" && (
              <MediaSelectButton
                label="Select Video"
                mediaType="video"
                value={formData.mediaUrl || ""}
                onSelect={(url) =>
                  setFormData((prev) => ({ ...prev, mediaUrl: url }))
                }
              />
            )}
            {formData.mediaType === "image" && (
              <MediaSelectButton
                label="Select Image"
                mediaType="image"
                value={formData.mediaUrl || ""}
                onSelect={(url) =>
                  setFormData((prev) => ({ ...prev, mediaUrl: url }))
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OurStoryManager;
