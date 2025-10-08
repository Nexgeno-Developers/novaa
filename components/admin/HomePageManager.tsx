"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Save } from "lucide-react";
import { toast } from "sonner";
import MediaSelectButton from "./MediaSelectButton";
import BaseSectionManager from "./BaseSectionManager";

interface HeroSection {
  mediaType: "image" | "video" | "vimeo";
  mediaUrl: string;
  vimeoUrl?: string;
  title: string;
  subtitle: string;
  overlayOpacity: number;
  overlayColor: string;
  titleFontFamily: string;
  subtitleFontFamily: string;
  titleFontSize: string;
  subtitleFontSize: string;
  titleGradient: string;
  subtitleGradient: string;
}

interface HomePageManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function HomePageManager({
  section,
  onChange,
  showSaveButton = true,
}: HomePageManagerProps = {}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  const [heroData, setHeroData] = useState<HeroSection>({
    mediaType: "image",
    mediaUrl: "/images/hero.jpg",
    vimeoUrl: "",
    title: "Experience Unparalleled",
    subtitle: "Luxury in Thailand",
    overlayOpacity: 0.4,
    overlayColor: "#01292B",
    titleFontFamily: "font-cinzel",
    subtitleFontFamily: "font-cinzel",
    titleFontSize: "text-2xl md:text-[50px]",
    subtitleFontSize: "text-2xl md:text-[50px]",
    titleGradient: "none",
    subtitleGradient: "none",
  });

  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange) {
        onChange(changes);
        userHasInteractedRef.current = true;
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content.heroSection || section.content;
      setHeroData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
      setLoading(false);
    } else if (!section && !isInitializedRef.current) {
      fetchHeroData();
      isInitializedRef.current = true;
    }
  }, [section]);

  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: { heroSection: heroData } });
    }
  }, [heroData]);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/home");
      if (response.ok) {
        const data = await response.json();
        if (data.heroSection) {
          setHeroData((prev) => ({ ...prev, ...data.heroSection }));
          initialDataSetRef.current = true;
        }
      }
    } catch (err) {
      console.error("Failed to fetch hero data:", err);
      setError("Failed to load hero data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/cms/home", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heroSection: heroData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const result = await response.json();
      if (result.heroSection) {
        setHeroData(result.heroSection);
        initialDataSetRef.current = true;
        userHasInteractedRef.current = false;
      }

      setHasLocalChanges(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMessage);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const updateHeroData = useCallback((updates: Partial<HeroSection>) => {
    userHasInteractedRef.current = true;
    setHeroData((prev) => ({ ...prev, ...updates }));
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {!section && (
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Home Page Management</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              {showSaveButton && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !hasLocalChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 ">Title</label>
            <Textarea
              value={heroData.title}
              onChange={(e) => updateHeroData({ title: e.target.value })}
              placeholder="Hero title"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Subtitle</label>
            <Textarea
              value={heroData.subtitle}
              onChange={(e) => updateHeroData({ subtitle: e.target.value })}
              placeholder="Hero subtitle"
              rows={2}
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Only show MediaSelectButton when mediaType is not vimeo */}
          {heroData.mediaType !== "vimeo" && (
            <div>
              <MediaSelectButton
                label={`Background ${
                  heroData.mediaType === "video"
                    ? "Video"
                    : heroData.mediaType === "vimeo"
                    ? "Vimeo Video"
                    : "Image"
                }`}
                mediaType={
                  heroData.mediaType === "vimeo" ? "video" : heroData.mediaType
                }
                value={heroData.mediaUrl}
                onSelect={(url: string) => updateHeroData({ mediaUrl: url })}
                placeholder={`Choose ${heroData.mediaType}`}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 mt-2 ">
              Media Type
            </label>
            <Select
              value={heroData.mediaType}
              onValueChange={(value: "image" | "video" | "vimeo") => {
                updateHeroData({
                  mediaType: value,
                  mediaUrl: value === "vimeo" ? "" : heroData.mediaUrl,
                  vimeoUrl: value === "vimeo" ? heroData.vimeoUrl : "",
                });
              }}
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="admin-theme">
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="vimeo">Vimeo Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vimeo URL Field - Only show when mediaType is vimeo */}
        {heroData.mediaType === "vimeo" && (
          <div>
            <label className="block text-sm font-medium mb-1">Vimeo URL</label>
            <Input
              value={heroData.vimeoUrl || ""}
              onChange={(e) => updateHeroData({ vimeoUrl: e.target.value })}
              placeholder="Enter Vimeo video URL (e.g., https://vimeo.com/123456789)"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the full Vimeo URL. The video will be embedded
              automatically.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={handleOnChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Hero Section"
        description="Manage the main hero section content"
      >
        {renderContent()}
      </BaseSectionManager>
    );
  }

  return renderContent();
}
