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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Images,
  Save,
  Sparkles,
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

// const fontFamilies = [
//   { value: "font-cinzel", label: "Cinzel" },
//   { value: "font-inter", label: "Inter" },
//   { value: "font-roboto", label: "Roboto" },
//   { value: "font-playfair", label: "Playfair Display" },
//   { value: "font-poppins", label: "Poppins" },
//   { value: "font-montserrat", label: "Montserrat" },
// ];

// const fontSizes = [
//   { value: "text-sm", label: "Small" },
//   { value: "text-base", label: "Base" },
//   { value: "text-lg", label: "Large" },
//   { value: "text-xl", label: "XL" },
//   { value: "text-2xl", label: "2XL" },
//   { value: "text-3xl", label: "3XL" },
//   { value: "text-4xl", label: "4XL" },
//   { value: "text-[50px]", label: "50px" },
//   { value: "text-[60px]", label: "60px" },
// ];

// const gradientOptions = [
//   { value: "none", label: "No Gradient" },
//   {
//     value: "linear-gradient(45deg, #C3912F, #F5E7A8, #C3912F)",
//     label: "Gold Gradient",
//   },
//   { value: "linear-gradient(45deg, #667eea, #764ba2)", label: "Purple Blue" },
//   { value: "linear-gradient(45deg, #f093fb, #f5576c)", label: "Pink Red" },
//   { value: "linear-gradient(45deg, #4facfe, #00f2fe)", label: "Blue Cyan" },
//   { value: "linear-gradient(45deg, #43e97b, #38f9d7)", label: "Green Mint" },
//   { value: "linear-gradient(45deg, #fa709a, #fee140)", label: "Pink Yellow" },
//   { value: "linear-gradient(45deg, #a8edea, #fed6e3)", label: "Soft Pastel" },
//   { value: "linear-gradient(45deg, #ff9a9e, #fecfef)", label: "Pink Pastel" },
//   { value: "linear-gradient(45deg, #ffecd2, #fcb69f)", label: "Orange Peach" },
// ];

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


  // useEffect(() => {
  //   if (originalData) {
  //     const hasChanges = JSON.stringify(heroData) !== JSON.stringify(originalData);
  //     setHasLocalChanges(hasChanges);
  //   }
  // }, [heroData, originalData]);


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

  // Handle gradient changes with proper state management
  // const handleTitleGradientChange = useCallback((value: string) => {
  //   setHeroData(prev => ({ ...prev, titleGradient: value }));
  //   setHasLocalChanges(true);
  // }, []);

  // const handleSubtitleGradientChange = useCallback((value: string) => {
  //   setHeroData(prev => ({ ...prev, subtitleGradient: value }));
  //   setHasLocalChanges(true);
  // }, []);

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

        {previewMode ? (
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[500px] overflow-hidden rounded-lg">
                {heroData.mediaType === "video" ? (
                  <video
                    src={heroData.mediaUrl}
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroData.mediaUrl})` }}
                  />
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 z-0"
                  style={{
                    background: `linear-gradient(to top, ${
                      heroData.overlayColor
                    }${Math.round(heroData.overlayOpacity * 255)
                      .toString(16)
                      .padStart(2, "0")} 0%, transparent 100%)`,
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-6 w-full z-10 px-6">
                  <div className={`${heroData.titleFontFamily}`}>
                    <div
                      className={`${heroData.titleFontSize} font-normal leading-tight`}
                      style={getTitleStyle()}
                    >
                      {heroData.title}
                    </div>
                    {heroData.subtitle && (
                      <div
                        className={`font-bold ${heroData.subtitleFontSize} leading-tight mt-2 ${heroData.subtitleFontFamily}`}
                        style={getSubtitleStyle()}
                      >
                        {heroData.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="content" className="space-y-6">

              <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
              <TabsTrigger 
                value="content" 
                className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Content</span>
              </TabsTrigger>
              <TabsTrigger 
                value="media"
                className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <Images className="w-4 h-4" />
                <span className="font-medium">Media & Overlay</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="space-y-6">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Background Media & Overlay</CardTitle>
                  <CardDescription>
                    Select background media and configure overlay settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Media Type Selection */}
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select media type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>Hero Content & Styling</CardTitle>
                  <CardDescription>
                    Configure title and subtitle text with styling options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title Section */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg">Title Settings</h4>

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

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title Font Family
                        </label>
                        <Select
                          value={heroData.titleFontFamily}
                          onValueChange={(value) =>
                            updateHeroData({ titleFontFamily: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title Font Size
                        </label>
                        <Select
                          value={heroData.titleFontSize}
                          onValueChange={(value) =>
                            updateHeroData({ titleFontSize: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {fontSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="text-2xl md:text-[50px]">
                              Responsive 2XL-50PX
                            </SelectItem>
                             <SelectItem value="text-3xl md:text-[60px]">
                              Responsive 3XL-60PX
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title Gradient
                        </label>
                        <Select
                          value={heroData.titleGradient}
                          onValueChange={handleTitleGradientChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gradientOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div> */}
                  </div>

                  {/* Subtitle Section */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg">Subtitle Settings</h4>

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

                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle Font Family
                        </label>
                        <Select
                          value={heroData.subtitleFontFamily}
                          onValueChange={(value) =>
                            updateHeroData({ subtitleFontFamily: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle Font Size
                        </label>
                        <Select
                          value={heroData.subtitleFontSize}
                          onValueChange={(value) =>
                            updateHeroData({ subtitleFontSize: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontSizes.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="text-2xl md:text-[50px]">
                              Responsive 2XL-50PX
                            </SelectItem>
                            <SelectItem value="text-3xl md:text-[60px]">
                              Responsive 3XL-60PX
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle Gradient
                        </label>
                        <Select
                          value={heroData.subtitleGradient}
                          onValueChange={handleSubtitleGradientChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {gradientOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div> */}
                  </div>

                  {/* Preview Section */}
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-medium text-white mb-4">
                      Content Preview:
                    </h4>
                    <div className="space-y-2">
                      <div
                        className={`${heroData.titleFontSize} font-normal ${heroData.titleFontFamily}`}
                        style={getTitleStyle()}
                      >
                        {heroData.title}
                      </div>
                      {heroData.subtitle && (
                        <p
                          className={`font-bold ${heroData.subtitleFontSize} ${heroData.subtitleFontFamily}`}
                          style={getSubtitleStyle()}
                        >
                          {heroData.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
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