"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Save,
  Sparkles,
  Images,
} from "lucide-react";
import { toast } from "sonner";
import MediaSelectButton from "./MediaSelectButton";
import BaseSectionManager from "./BaseSectionManager";

interface HeroSection {
  mediaType: "image" | "video";
  mediaUrl: string;
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
  showSaveButton = true 
}: HomePageManagerProps = {}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState<HeroSection | null>(null);

   // Use refs to track initialization state
    const isInitializedRef = useRef(false);
    const initialDataSetRef = useRef(false);
    const userHasInteractedRef = useRef(false);

  // Initialize with default values
  const [heroData, setHeroData] = useState<HeroSection>({
    mediaType: "image",
    mediaUrl: "/images/hero.jpg",
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

  // Memoize the onChange callback to prevent infinite re-renders
  const handleOnChange = useCallback((changes: any) => {
    if (onChange) {
      onChange(changes);
      userHasInteractedRef.current = true;
    }
  }, [onChange]);

 // Initial load
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content.heroSection || section.content;
      setHeroData(prev => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
      setLoading(false);
    } else if (!section && !isInitializedRef.current) {
      fetchHeroData();
      isInitializedRef.current = true;
    }
  }, [section]);

  // Notify parent only if user interacted
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
          setHeroData(prev => ({ ...prev, ...data.heroSection }));
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
        setOriginalData(result.heroSection);
      }

      setHasLocalChanges(false);
      toast.success("Changes saved successfully!");
       if (result.heroSection) {
        setHeroData(result.heroSection);
        initialDataSetRef.current = true;
        userHasInteractedRef.current = false; // reset interaction after save
      }

    } catch (err) {
      console.error("Save error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMessage);
      toast.error("Failed to save changes", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Memoize updateHeroData to prevent unnecessary re-renders
   const updateHeroData = useCallback(
    (updates: Partial<HeroSection>) => {
      userHasInteractedRef.current = true;
      setHeroData(prev => ({ ...prev, ...updates }));
    },
    []
  );

  // Memoize style functions to prevent unnecessary re-calculations
  const getTitleStyle = useCallback(() => {
    if (heroData.titleGradient && heroData.titleGradient !== "none") {
      return {
        background: heroData.titleGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      };
    }
    return {
      color: "white",
      background: "transparent",
      WebkitBackgroundClip: "initial",
      backgroundClip: "initial",
      WebkitTextFillColor: "initial",
    };
  }, [heroData.titleGradient]);

  const getSubtitleStyle = useCallback(() => {
    if (heroData.subtitleGradient && heroData.subtitleGradient !== "none") {
      return {
        background: heroData.subtitleGradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      };
    }
    return {
      color: "white",
      background: "transparent",
      WebkitBackgroundClip: "initial",
      backgroundClip: "initial",
      WebkitTextFillColor: "initial",
    };
  }, [heroData.subtitleGradient]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6 container">
        {!section && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Home Page Management
              </h1>
              <p className="text-gray-600">
                Manage your website&apos;s hero section and content
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center space-x-2 bg-secondary text-background cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                <span>{previewMode ? "Edit Mode" : "Preview"}</span>
              </Button>

              {showSaveButton && (
                <Button
                  onClick={handleSave}
                  disabled={saving || !hasLocalChanges}
                  className="flex items-center space-x-2 bg-primary text-background cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
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

          <div className="space-y-6">
            {/* Content Section */}
            <Card className="pb-6 bg-purple-50/30 ring-2 ring-primary/20">
              <CardHeader className="flex flex-row items-center space-y-0 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
                <div className="flex items-center space-x-2 ">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-gray-900">Hero Content & Styling</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 ">
                {/* Title Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 ring-2 ring-primary/20">
                  <h4 className="font-semibold text-lg flex items-center space-x-2 text-primary/80">
                    <span>Title Settings</span>
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title
                    </label>
                    <Textarea
                      value={heroData.title}
                      onChange={(e) => updateHeroData({ title: e.target.value })}
                      placeholder="Experience Unparalleled Luxury in Thailand"
                      className="text-lg"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Subtitle Section */}
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50 ring-2 ring-primary/20">
                  <h4 className="font-semibold text-lg text-primary/80">Subtitle Settings</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <Textarea
                      value={heroData.subtitle}
                      onChange={(e) => updateHeroData({ subtitle: e.target.value })}
                      placeholder="Your Premier Destination for Luxury Properties"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media & Overlay Section */}
            <Card className="pb-6 bg-purple-50/30 ring-2 ring-primary/20">
              <CardHeader className="flex flex-row items-center space-y-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2 py-6">
                <div className="flex items-center space-x-2">
                  <Images className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-gray-900">Background Media & Overlay</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Media Type Selection */}
                <div className="p-4 border rounded-lg bg-gray-50/50 ring-2 ring-primary/20">
                  <h4 className="font-semibold text-lg mb-4 text-primary/90">Media Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Media Type
                      </label>
                      <Select
                        value={heroData.mediaType}
                        onValueChange={(value: "image" | "video") => {
                          updateHeroData({ mediaType: value, mediaUrl: "" });
                        }}
                      >
                        <SelectTrigger className="cursor-pointer ">
                          <SelectValue placeholder="Select media type" />
                        </SelectTrigger>
                        <SelectContent className="admin-theme">
                          <SelectItem value="image" className="cursor-pointer">Image</SelectItem>
                          <SelectItem value="video" className="cursor-pointer">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <MediaSelectButton
                        label={`Background ${heroData.mediaType === "video" ? "Video" : "Image"}`}
                        mediaType={heroData.mediaType}
                        value={heroData.mediaUrl}
                        onSelect={(url: string) => updateHeroData({ mediaUrl: url })}
                        placeholder={`Choose a background ${heroData.mediaType}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay Settings */}
                {/* <div className="p-4 border rounded-lg bg-purple-50/30">
                  <h4 className="font-semibold text-lg mb-4">Overlay Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overlay Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={heroData.overlayColor || "#000000"}
                          onChange={(e) => updateHeroData({ overlayColor: e.target.value })}
                          className="w-12 h-10 p-1 rounded cursor-pointer border-gray-300"
                        />
                        <Input
                          value={heroData.overlayColor || "#000000"}
                          onChange={(e) => updateHeroData({ overlayColor: e.target.value })}
                          placeholder="#01292B"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Overlay Opacity ({Math.round((heroData.overlayOpacity || 0) * 100)}%)
                      </label>
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={heroData.overlayOpacity || 0}
                        onChange={(e) =>
                          updateHeroData({
                            overlayOpacity: parseFloat(e.target.value),
                          })
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
      </div>
    );
  };

  // If used within a section manager, wrap with BaseSectionManager
  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={handleOnChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Hero Section"
        description="Manage the main hero section content and styling"
      >
        {renderContent()}
      </BaseSectionManager>
    );
  }

  // Return standalone component
  return renderContent();
}