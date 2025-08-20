"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Save,
  Plus,
  X,
  Eye,
  Palette,
  Type,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface HighlightedWord {
  word: string;
  style: {
    color: string;
    fontWeight: string;
    textDecoration?: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
  };
}

interface CtaButton {
  text: string;
  href: string;
  isActive: boolean;
}

interface HeroSection {
  mediaType: "image" | "video";
  mediaUrl: string;
  title: string;
  subtitle: string;
  highlightedWords: HighlightedWord[];
  ctaButton: CtaButton;
  overlayOpacity: number;
  overlayColor: string;
  titleFontFamily: string;
  subtitleFontFamily: string;
  titleFontSize: string;
  subtitleFontSize: string;
  titleGradient: string;
  subtitleGradient: string;
}

const fontFamilies = [
  { value: "font-cinzel", label: "Cinzel" },
  { value: "font-inter", label: "Inter" },
  { value: "font-roboto", label: "Roboto" },
  { value: "font-playfair", label: "Playfair Display" },
  { value: "font-poppins", label: "Poppins" },
  { value: "font-montserrat", label: "Montserrat" },
];

const fontSizes = [
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Base" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "XL" },
  { value: "text-2xl", label: "2XL" },
  { value: "text-3xl", label: "3XL" },
  { value: "text-4xl", label: "4XL" },
  { value: "text-[50px]", label: "50px" },
  { value: "text-[60px]", label: "60px" },
];

const gradientOptions = [
  { value: "none", label: "No Gradient" },
  {
    value: "linear-gradient(45deg, #C3912F, #F5E7A8, #C3912F)",
    label: "Gold Gradient",
  },
  { value: "linear-gradient(45deg, #667eea, #764ba2)", label: "Purple Blue" },
  { value: "linear-gradient(45deg, #f093fb, #f5576c)", label: "Pink Red" },
  { value: "linear-gradient(45deg, #4facfe, #00f2fe)", label: "Blue Cyan" },
  { value: "linear-gradient(45deg, #43e97b, #38f9d7)", label: "Green Mint" },
  { value: "linear-gradient(45deg, #fa709a, #fee140)", label: "Pink Yellow" },
  { value: "linear-gradient(45deg, #a8edea, #fed6e3)", label: "Soft Pastel" },
  { value: "linear-gradient(45deg, #ff9a9e, #fecfef)", label: "Pink Pastel" },
  { value: "linear-gradient(45deg, #ffecd2, #fcb69f)", label: "Orange Peach" },
];

export default function HomePageManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  // Initialize with default values
  const [heroData, setHeroData] = useState<HeroSection>({
    mediaType: "image",
    mediaUrl: "/images/hero.jpg",
    title: "Experience Unparalleled",
    subtitle: "Luxury in Thailand",
    highlightedWords: [],
    ctaButton: {
      text: "Explore Properties",
      href: "/projects",
      isActive: false,
    },
    overlayOpacity: 0.4,
    overlayColor: "#01292B",
    titleFontFamily: "font-cinzel",
    subtitleFontFamily: "font-cinzel",
    titleFontSize: "text-2xl md:text-[50px]",
    subtitleFontSize: "text-2xl md:text-[50px]",
    titleGradient: "none",
    subtitleGradient: "none",
  });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/home");
      if (response.ok) {
        const data = await response.json();
        if (data.heroSection) {
          setHeroData({
            mediaType: data.heroSection.mediaType || "image",
            mediaUrl: data.heroSection.mediaUrl || "/images/hero.jpg",
            title:
              data.heroSection.title ||
              "Experience Unparalleled Luxury in Thailand",
            subtitle:
              data.heroSection.subtitle ||
              "Your Premier Destination for Luxury Properties",
            highlightedWords: data.heroSection.highlightedWords || [],
            ctaButton: data.heroSection.ctaButton || {
              text: "Explore Properties",
              href: "/projects",
              isActive: false,
            },
            overlayOpacity: data.heroSection.overlayOpacity || 0.4,
            overlayColor: data.heroSection.overlayColor || "#01292B",
            titleFontFamily: data.heroSection.titleFontFamily || "font-cinzel",
            subtitleFontFamily:
              data.heroSection.subtitleFontFamily || "font-cinzel",
            titleFontSize:
              data.heroSection.titleFontSize || "text-2xl md:text-[50px]",
            subtitleFontSize:
              data.heroSection.subtitleFontSize || "text-2xl md:text-[50px]",
            titleGradient: data.heroSection.titleGradient || "none",
            subtitleGradient: data.heroSection.subtitleGradient || "none",
          });
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

      let updatedData = { ...heroData };

      // Upload media file if selected
      if (mediaFile) {
        setUploadProgress(true);
        const formData = new FormData();
        formData.append("file", mediaFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          updatedData.mediaUrl = uploadResult.url;
          toast.success("Media file uploaded successfully!");
        } else {
          throw new Error(uploadResult.error || "Upload failed");
        }
        setUploadProgress(false);
      }

      const response = await fetch("/api/cms/home", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ heroSection: updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const result = await response.json();
      if (result.heroSection) {
        setHeroData(result.heroSection);
      }

      setMediaFile(null);

      // Success toast notification
      toast.success("Changes saved successfully!", {
        description: "Your homepage content has been updated.",
        duration: 3000,
      });
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save changes";
      setError(errorMessage);

      // Error toast notification
      toast.error("Failed to save changes", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setSaving(false);
      setUploadProgress(false);
    }
  };

  const updateHeroData = (updates: Partial<HeroSection>) => {
    setHeroData((prev) => ({ ...prev, ...updates }));
  };

  const addHighlightedWord = () => {
    const newWord: HighlightedWord = {
      word: "",
      style: {
        color: "#01292B",
        fontWeight: "bold",
        fontFamily: "font-cinzel",
        fontSize: "inherit",
        fontStyle: "normal",
        background: "none",
      },
    };

    setHeroData((prev) => ({
      ...prev,
      highlightedWords: [...prev.highlightedWords, newWord],
    }));
  };

  const updateHighlightedWord = (
    index: number,
    updates: Partial<HighlightedWord>
  ) => {
    setHeroData((prev) => ({
      ...prev,
      highlightedWords: prev.highlightedWords.map((word, i) =>
        i === index ? { ...word, ...updates } : word
      ),
    }));
  };

  const removeHighlightedWord = (index: number) => {
    setHeroData((prev) => ({
      ...prev,
      highlightedWords: prev.highlightedWords.filter((_, i) => i !== index),
    }));
  };

  const renderStyledTitle = () => {
    let styledTitle = heroData.title;
    heroData.highlightedWords.forEach(({ word, style }) => {
      if (word.trim()) {
        const regex = new RegExp(`\\b${word.trim()}\\b`, "gi");
        const backgroundStyle =
          style.background && style.background !== "none"
            ? `background: ${style.background}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
            : "";

        styledTitle = styledTitle.replace(
          regex,
          `<span style="color: ${
            backgroundStyle ? "transparent" : style.color
          }; font-weight: ${style.fontWeight}; font-size: ${
            style.fontSize
          }; font-style: ${style.fontStyle}; ${backgroundStyle} ${
            style.textDecoration
              ? `text-decoration: ${style.textDecoration};`
              : ""
          }">${word}</span>`
        );
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: styledTitle }} />;
  };
  const getTitleStyle = () => {
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
  };

  const getSubtitleStyle = () => {
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
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Home Page Management
          </h1>
          <p className="text-gray-600">
            Manage your website's hero section and content
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

          <Button
            onClick={handleSave}
            disabled={saving || uploadProgress}
            className="flex items-center space-x-2 bg-primary text-background cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>
              {uploadProgress
                ? "Uploading..."
                : saving
                ? "Saving..."
                : "Save Changes"}
            </span>
          </Button>
        </div>
      </div>

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
                    {renderStyledTitle()}
                  </div>
                  {heroData.subtitle && (
                    <div
                      className={`font-bold ${heroData.subtitleFontSize} leading-tight mt-2 ${heroData.subtitleFontFamily}`}
                      style={getSubtitleStyle()}
                    >
                      {heroData.subtitle}
                    </div>
                  )}
                  {heroData.ctaButton.isActive && (
                    <div className="mt-6">
                      <Button
                        size="lg"
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        {heroData.ctaButton.text}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-300">
            <TabsTrigger value="media" className="cursor-pointer">
              Media
            </TabsTrigger>
            <TabsTrigger value="content" className="cursor-pointer">
              Content
            </TabsTrigger>
            <TabsTrigger value="highlights" className="cursor-pointer">
              Highlights
            </TabsTrigger>
            <TabsTrigger value="cta" className="cursor-pointer">
              CTA Button
            </TabsTrigger>
          </TabsList>

          <TabsContent value="media" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Background Media</CardTitle>
                <CardDescription>
                  Upload image or video for hero section background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Type
                  </label>
                  <Select
                    value={heroData.mediaType}
                    onValueChange={(value: "image" | "video") =>
                      updateHeroData({ mediaType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {heroData.mediaUrl && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Current Media
                    </label>
                    {heroData.mediaType === "video" ? (
                      <video
                        src={heroData.mediaUrl}
                        controls
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                    ) : (
                      <img
                        src={heroData.mediaUrl}
                        alt="Current hero background"
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          console.error("Image load error:", e);
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/hero.jpg"; // Fallback image
                        }}
                      />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New{" "}
                    {heroData.mediaType === "video" ? "Video" : "Image"}
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept={
                        heroData.mediaType === "video" ? "video/*" : "image/*"
                      }
                      onChange={(e) =>
                        setMediaFile(e.target.files?.[0] || null)
                      }
                    />
                    {mediaFile && (
                      <Badge
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>Ready to upload: {mediaFile.name}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={heroData.overlayColor}
                        onChange={(e) =>
                          updateHeroData({ overlayColor: e.target.value })
                        }
                        className="w-12 h-10 p-1 rounded cursor-pointer"
                      />
                      <Input
                        value={heroData.overlayColor}
                        onChange={(e) =>
                          updateHeroData({ overlayColor: e.target.value })
                        }
                        placeholder="#01292B"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overlay Opacity (
                      {Math.round(heroData.overlayOpacity * 100)}%)
                    </label>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={heroData.overlayOpacity}
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
                <CardTitle>Hero Content</CardTitle>
                <CardDescription>
                  Main title and subtitle text with styling options
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
                      onChange={(e) =>
                        updateHeroData({ title: e.target.value })
                      }
                      placeholder="Experience Unparalleled Luxury in Thailand"
                      className="text-lg"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        onValueChange={(value) => {
                          updateHeroData({ titleGradient: "none" });
                          setTimeout(() => {
                            updateHeroData({ titleGradient: value });
                          }, 0);
                        }}
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
                  </div>
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
                      onChange={(e) =>
                        updateHeroData({ subtitle: e.target.value })
                      }
                      placeholder="Your Premier Destination for Luxury Properties"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        onValueChange={(value) => {
                          updateHeroData({ subtitleGradient: "none" });
                          setTimeout(() => {
                            updateHeroData({ subtitleGradient: value });
                          }, 0);
                        }}
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
                  </div>
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
                      {renderStyledTitle()}
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

          <TabsContent value="highlights" className="space-y-6">
            <Card className="py-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Text Highlights</CardTitle>
                  <CardDescription>
                    Add special styling to specific words in your title
                  </CardDescription>
                </div>
                <Button
                  onClick={addHighlightedWord}
                  className="flex items-center space-x-2 bg-primary text-background cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Highlight</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {heroData.highlightedWords.map((highlightedWord, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Highlight #{index + 1}</h4>
                      <Button
                        variant="outline"
                        className="text-background cursor-pointer bg-gray-200"
                        size="sm"
                        onClick={() => removeHighlightedWord(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Word
                        </label>
                        <Input
                          value={highlightedWord.word}
                          onChange={(e) =>
                            updateHighlightedWord(index, {
                              word: e.target.value,
                            })
                          }
                          placeholder="e.g., Luxury"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Background/Gradient
                        </label>
                        <Select
                          value={highlightedWord.style.background || "none"}
                          onValueChange={(value) =>
                            updateHighlightedWord(index, {
                              style: {
                                ...highlightedWord.style,
                                background: value === "none" ? "" : value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gradient" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradientOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="color"
                            value={highlightedWord.style.color}
                            onChange={(e) =>
                              updateHighlightedWord(index, {
                                style: {
                                  ...highlightedWord.style,
                                  color: e.target.value,
                                },
                              })
                            }
                            className="w-12 h-10 p-1 rounded cursor-pointer"
                          />
                          <Input
                            value={highlightedWord.style.color}
                            onChange={(e) =>
                              updateHighlightedWord(index, {
                                style: {
                                  ...highlightedWord.style,
                                  color: e.target.value,
                                },
                              })
                            }
                            placeholder="#3B82F6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Weight
                        </label>
                        <Select
                          value={highlightedWord.style.fontWeight}
                          onValueChange={(value) =>
                            updateHighlightedWord(index, {
                              style: {
                                ...highlightedWord.style,
                                fontWeight: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="bolder">Bolder</SelectItem>
                            <SelectItem value="lighter">Lighter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Style
                        </label>
                        <Select
                          value={highlightedWord.style.fontStyle || "normal"}
                          onValueChange={(value) =>
                            updateHighlightedWord(index, {
                              style: {
                                ...highlightedWord.style,
                                fontStyle: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="italic">Italic</SelectItem>
                            <SelectItem value="oblique">Oblique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Size
                        </label>
                        <Select
                          value={highlightedWord.style.fontSize || "inherit"}
                          onValueChange={(value) =>
                            updateHighlightedWord(index, {
                              style: {
                                ...highlightedWord.style,
                                fontSize: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inherit">Inherit</SelectItem>
                            <SelectItem value="0.75em">Small (75%)</SelectItem>
                            <SelectItem value="0.875em">
                              Small (87.5%)
                            </SelectItem>
                            <SelectItem value="1em">Normal (100%)</SelectItem>
                            <SelectItem value="1.125em">
                              Large (112.5%)
                            </SelectItem>
                            <SelectItem value="1.25em">Large (125%)</SelectItem>
                            <SelectItem value="1.5em">
                              X-Large (150%)
                            </SelectItem>
                            <SelectItem value="2em">2X-Large (200%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Decoration
                      </label>
                      <Select
                        value={highlightedWord.style.textDecoration || "none"}
                        onValueChange={(value) =>
                          updateHighlightedWord(index, {
                            style: {
                              ...highlightedWord.style,
                              textDecoration:
                                value === "none" ? undefined : value,
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="underline">Underline</SelectItem>
                          <SelectItem value="overline">Overline</SelectItem>
                          <SelectItem value="line-through">
                            Line Through
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">Preview: </span>
                      <span
                        style={{
                          color:
                            highlightedWord.style.background &&
                            highlightedWord.style.background !== "none"
                              ? "transparent"
                              : highlightedWord.style.color,
                          fontWeight: highlightedWord.style.fontWeight,
                          fontStyle: highlightedWord.style.fontStyle,
                          fontSize: highlightedWord.style.fontSize,
                          background:
                            highlightedWord.style.background &&
                            highlightedWord.style.background !== "none"
                              ? highlightedWord.style.background
                              : "transparent",
                          WebkitBackgroundClip:
                            highlightedWord.style.background &&
                            highlightedWord.style.background !== "none"
                              ? "text"
                              : "initial",
                          backgroundClip:
                            highlightedWord.style.background &&
                            highlightedWord.style.background !== "none"
                              ? "text"
                              : "initial",
                          WebkitTextFillColor:
                            highlightedWord.style.background &&
                            highlightedWord.style.background !== "none"
                              ? "transparent"
                              : "initial",
                          textDecoration:
                            highlightedWord.style.textDecoration || "none",
                        }}
                      >
                        {highlightedWord.word || "Preview Text"}
                      </span>
                    </div>
                  </Card>
                ))}

                {heroData.highlightedWords.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Palette className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      No highlighted words yet. Add some to make your title
                      stand out!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cta" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Call to Action Button</CardTitle>
                <CardDescription>
                  Configure the main action button in your hero section
                  (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="cta-toggle"
                    checked={heroData.ctaButton.isActive}
                    onChange={(e) =>
                      updateHeroData({
                        ctaButton: {
                          ...heroData.ctaButton,
                          isActive: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="cta-toggle"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Show Call to Action Button
                  </label>
                  <Badge
                    variant={
                      heroData.ctaButton.isActive ? "default" : "secondary"
                    }
                  >
                    {heroData.ctaButton.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {heroData.ctaButton.isActive && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={heroData.ctaButton.text}
                        onChange={(e) =>
                          updateHeroData({
                            ctaButton: {
                              ...heroData.ctaButton,
                              text: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., Explore Properties, Get Started"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={heroData.ctaButton.href}
                        onChange={(e) =>
                          updateHeroData({
                            ctaButton: {
                              ...heroData.ctaButton,
                              href: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., /projects, /contact"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use relative paths (e.g., /projects) or full URLs (e.g.,
                        https://example.com)
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Button Preview:
                      </h4>
                      <Button
                        size="lg"
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        {heroData.ctaButton.text || "Button Text"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
