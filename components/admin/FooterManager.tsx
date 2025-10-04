"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  fetchFooterData,
  updateFooterData,
  FooterData,
  Link,
  SocialLink,
} from "@/redux/slices/footerSlice";
import {
  Book,
  Copyright,
  Images,
  Loader2,
  Sparkles,
  Save,
  XCircle,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom Components
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import Editor from "@/components/admin/Editor";
import { toast } from "sonner";

const FooterManagerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.footer);

  const [formData, setFormData] = useState<FooterData | null>(null);
  const [saving, setSaving] = useState(false);

  // Available social platforms
  const availableSocialPlatforms: Array<SocialLink["name"]> = [
    "whatsapp",
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
    "snapchat",
    "tiktok",
    "youtube",
    "telegram",
    "pinterest",
    "reddit",
    "discord",
    "tumblr",
    "wechat",
  ];

  useEffect(() => {
    dispatch(fetchFooterData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Check if there are any unsaved changes
  const hasChanges =
    data && formData
      ? JSON.stringify(data) !== JSON.stringify(formData)
      : false;

  // Handle nested object updates
  const handleNestedInputChange = <T extends keyof FooterData>(
    section: T,
    field: keyof FooterData[T],
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const currentSection = prev[section];
      if (typeof currentSection === "object" && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value,
          },
        };
      }
      return prev;
    });
  };

  // Handle simple input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // Handle CTA button lines array
  const handleCtaButtonChange = (value: string) => {
    const lines = value.split("\n").filter((line) => line.trim());
    setFormData((prev) => {
      if (!prev) return null;
      return { ...prev, ctaButtonLines: lines };
    });
  };

  // Quick Links CRUD Operations
  const handleQuickLinkChange = (
    index: number,
    field: "label" | "url",
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedLinks = [...prev.quickLinks.links];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };

      return {
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          links: updatedLinks,
        },
      };
    });
  };

  const addQuickLink = () => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          links: [...prev.quickLinks.links, { label: "", url: "" }],
        },
      };
    });
  };

  const removeQuickLink = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedLinks = prev.quickLinks.links.filter((_, i) => i !== index);
      return {
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          links: updatedLinks,
        },
      };
    });
  };

  // Social Links CRUD Operations
  const handleSocialLinkChange = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedLinks = [...prev.socials.links];
      if (field === "name") {
        updatedLinks[index] = {
          ...updatedLinks[index],
          [field]: value as SocialLink["name"],
        };
      } else {
        updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      }
      return {
        ...prev,
        socials: {
          ...prev.socials,
          links: updatedLinks,
        },
      };
    });
  };

  const addSocialLink = () => {
    // Find first available platform not already in use
    const usedPlatforms =
      formData?.socials.links.map((link) => link.name) || [];
    const availablePlatform = availableSocialPlatforms.find(
      (platform) => !usedPlatforms.includes(platform)
    );

    if (!availablePlatform) {
      toast.error("All social platforms are already added");
      return;
    }

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        socials: {
          ...prev.socials,
          links: [...prev.socials.links, { name: availablePlatform, url: "" }],
        },
      };
    });
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedLinks = prev.socials.links.filter((_, i) => i !== index);
      return {
        ...prev,
        socials: {
          ...prev.socials,
          links: updatedLinks,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      console.log("test");
      await dispatch(updateFooterData(formData)).unwrap();
      toast.success("Footer has been updated.");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update footer.");
    } finally {
      setSaving(false);
    }
  };

  // Discard changes function
  const handleDiscardChanges = () => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
      toast.info("Changes have been discarded.");
    }
  };

  if (!formData || (status === "loading" && !data)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <Images className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Footer Manager
            </h1>
            <p className="text-slate-600 font-medium">
              Design and customize your website footer content
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Content & Branding
              </CardTitle>
              <CardDescription className="text-slate-600">
                Configure footer taglines, descriptions, and background images
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Footer Tagline */}
            <div className="space-y-3">
              <div>
                <Label className="pb-2">Title</Label>
                <Input
                  value={formData.tagline.title}
                  onChange={(e) =>
                    handleNestedInputChange("tagline", "title", e.target.value)
                  }
                  placeholder="Title"
                  className="ring-2 ring-primary/20"
                />
              </div>
              <div>
                <Label className="pb-2">Subtitle</Label>
                <Input
                  value={formData.tagline.subtitle}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tagline",
                      "subtitle",
                      e.target.value
                    )
                  }
                  placeholder="Subtitle"
                  className="ring-2 ring-primary/20"
                />
              </div>
              <div>
                <Label className="pb-2">Description</Label>
                <Textarea
                  value={formData.tagline.description}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tagline",
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  className="ring-2 ring-primary/20"
                />
              </div>
              <div>
                <Label className="pb-2">CTA Button Lines (one per line)</Label>
                <Textarea
                  value={formData.ctaButtonLines.join("\n")}
                  onChange={(e) => handleCtaButtonChange(e.target.value)}
                  placeholder="Explore&#10;Your Future&#10;Home"
                  rows={3}
                  className="ring-2 ring-primary/20"
                />
              </div>
              <div>
                <Label className="pb-2">Copyright Text</Label>
                <Textarea
                  name="copyrightText"
                  value={formData.copyrightText}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Copyright text with HTML allowed"
                  className="ring-2 ring-primary/20"
                />
              </div>
            </div>

            {/* Right side: Background Images */}
            <div className="flex flex-col">
              <MediaSelectButton
                key={"bg-image-one"}
                label="Background Image 1 (Top-Left)"
                mediaType="image"
                value={formData.bgImageOne}
                onSelect={(url) =>
                  setFormData({ ...formData, bgImageOne: url })
                }
              />
              <MediaSelectButton
                key={"bg-image-two"}
                label="Background Image 2 (Middle)"
                mediaType="image"
                value={formData.bgImageTwo}
                onSelect={(url) =>
                  setFormData({ ...formData, bgImageTwo: url })
                }
              />
              <MediaSelectButton
                key={"bg-image-three"}
                label="Background Image 3 (Bottom-Right)"
                mediaType="image"
                value={formData.bgImageThree}
                onSelect={(url) =>
                  setFormData({ ...formData, bgImageThree: url })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* About Us */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <Book className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold">
                About Us Section
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="pb-2">Section Title</Label>
              <Input
                value={formData.about.title}
                onChange={(e) =>
                  handleNestedInputChange("about", "title", e.target.value)
                }
                placeholder="About Us"
                className="ring-2 ring-primary/20"
              />
            </div>
            <div>
              <Label className="pb-2">Description</Label>
              <Editor
                value={formData.about.description}
                onEditorChange={(content) =>
                  handleNestedInputChange("about", "description", content)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links with CRUD */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Quick Links</CardTitle>
              </div>
              <Button
                onClick={addQuickLink}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 h-8 w-8 p-0"
                title="Add Quick Link"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="pb-2">Section Title</Label>
              <Input
                value={formData.quickLinks.title}
                onChange={(e) =>
                  handleNestedInputChange("quickLinks", "title", e.target.value)
                }
                className="ring-2 ring-primary/20"
                placeholder="Quick Links"
              />
            </div>
            <div className="space-y-3">
              <Label>Links</Label>
              {formData.quickLinks.links.map((link, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 border rounded-lg border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Link {index + 1}
                    </span>
                    <Button
                      onClick={() => removeQuickLink(index)}
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      title="Remove Link"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={link.label}
                      onChange={(e) =>
                        handleQuickLinkChange(index, "label", e.target.value)
                      }
                      className="ring-2 ring-primary/20"
                      placeholder="Link Label"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        handleQuickLinkChange(index, "url", e.target.value)
                      }
                      className="ring-2 ring-primary/20"
                      placeholder="URL (e.g., /about-us)"
                    />
                  </div>
                </div>
              ))}
              {formData.quickLinks.links.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No quick links added yet. Click the + button to add one.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact & Socials with CRUD */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Copyright className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">
                  Contact & Socials
                </CardTitle>
              </div>
              <Button
                onClick={addSocialLink}
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 h-8 w-8 p-0"
                title="Add Social Link"
                disabled={
                  formData.socials.links.length >=
                  availableSocialPlatforms.length
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="pb-2">Phone</Label>
              <Input
                value={formData.contact.phone}
                onChange={(e) =>
                  handleNestedInputChange("contact", "phone", e.target.value)
                }
                className="ring-2 ring-primary/20"
                placeholder="Phone Number"
              />
            </div>
            <div>
              <Label className="pb-2">Email</Label>
              <Input
                value={formData.contact.email}
                onChange={(e) =>
                  handleNestedInputChange("contact", "email", e.target.value)
                }
                className="ring-2 ring-primary/20"
                placeholder="Email Address"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="pb-2">Social Media Section Title</Label>
              <Button
                onClick={addSocialLink}
                size="sm"
                className="h-8 w-8 p-0"
                title="Add Social Link"
                disabled={
                  formData.socials.links.length >=
                  availableSocialPlatforms.length
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={formData.socials.title}
              onChange={(e) =>
                handleNestedInputChange("socials", "title", e.target.value)
              }
              className="ring-2 ring-primary/20"
              placeholder="Follow on"
            />
            <div className="space-y-3">
              <Label className="pb-2">Social Links</Label>
              {formData.socials.links.map((link, index) => (
                <div
                  key={`${link.name}-${index}`}
                  className="space-y-2 p-3 border rounded-lg border-primary/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {link.name}
                    </span>
                    <Button
                      onClick={() => removeSocialLink(index)}
                      size="sm"
                      variant="destructive"
                      className="h-6 w-6 p-0"
                      title="Remove Social Link"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={link.name}
                      onValueChange={(value) =>
                        handleSocialLinkChange(index, "name", value)
                      }
                    >
                      <SelectTrigger className="ring-2 ring-primary/20">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSocialPlatforms.map((platform) => {
                          const isUsed = formData.socials.links.some(
                            (socialLink, socialIndex) =>
                              socialLink.name === platform &&
                              socialIndex !== index
                          );
                          return (
                            <SelectItem
                              key={platform}
                              value={platform}
                              disabled={isUsed}
                              className="capitalize"
                            >
                              {platform} {isUsed ? "(Already used)" : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "url", e.target.value)
                      }
                      className="ring-2 ring-primary/20"
                      placeholder={`${link.name} URL`}
                    />
                  </div>
                </div>
              ))}
              {formData.socials.links.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No social links added yet. Click the + button to add one.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Save/Discard Buttons - Show when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-50">
          <Button
            onClick={handleDiscardChanges}
            variant="outline"
            className="bg-white/90 backdrop-blur-xl border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <XCircle className="h-4 w-4 mr-2" />
            <span className="font-medium">Discard Changes</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="font-medium">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                <span className="font-medium">Save Changes</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FooterManagerPage;
