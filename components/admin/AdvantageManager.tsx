"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  Image as ImageIcon,
  Images,
  Sparkles,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Shadcn UI and Custom Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import RichTextEditor from "@/components/admin/Editor";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import BaseSectionManager from "@/components/admin/BaseSectionManager";
import Image from "next/image";

interface AdvantageItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

interface AdvantageData {
  title: string;
  highlightedTitle: string;
  description: string;
  backgroundImage: string;
  logoImage: string;
  advantages: AdvantageItem[];
}

interface NovaaAdvantageManagerProps {
  section: any; // Required
  onChange: (changes: any) => void; // Required
  showSaveButton?: boolean;
}

const NovaaAdvantageManagerContent = ({
  section,
  onChange,
}: {
  section: any;
  onChange: (changes: any) => void;
}) => {
  // Local state for section-based management
  const [localData, setLocalData] = useState<AdvantageData>({
    title: section?.content?.title || "",
    highlightedTitle: section?.content?.highlightedTitle || "",
    description: section?.content?.description || "",
    backgroundImage: section?.content?.backgroundImage || "",
    logoImage: section?.content?.logoImage || "",
    advantages: section?.content?.advantages || [],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState<AdvantageData | null>(null);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content) {
      const newData = {
        title: section.content.title || "",
        highlightedTitle: section.content.highlightedTitle || "",
        description: section.content.description || "",
        backgroundImage: section.content.backgroundImage || "",
        logoImage: section.content.logoImage || "",
        advantages: section.content.advantages || [],
      };

      // Only update local data if we don't have pending changes
      if (!hasLocalChanges) {
        setLocalData(newData);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
      }
    }
  }, [section, hasLocalChanges]);

  // Add effect to handle successful saves
  useEffect(() => {
    if (section?.content && hasLocalChanges && originalData) {
      const currentContent = JSON.stringify(localData);
      const sectionContent = JSON.stringify({
        title: section.content.title || "",
        highlightedTitle: section.content.highlightedTitle || "",
        description: section.content.description || "",
        backgroundImage: section.content.backgroundImage || "",
        logoImage: section.content.logoImage || "",
        advantages: section.content.advantages || [],
      });

      if (currentContent === sectionContent) {
        setHasLocalChanges(false);
        setOriginalData(JSON.parse(JSON.stringify(localData)));
      }
    }
  }, [section?.content, hasLocalChanges, localData, originalData]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [hasLocalChanges, localData]);

  const handleUpdateMainField = (field: keyof AdvantageData, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleUpdateAdvantageItem = useCallback(
    (index: number, field: keyof AdvantageItem, value: string) => {
      setLocalData((prev) => ({
        ...prev,
        advantages: prev.advantages.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
      setHasLocalChanges(true);
    },
    []
  );

  const handleAddAdvantage = () => {
    const newAdvantage: AdvantageItem = {
      _id: uuidv4(),
      title: "",
      description: "",
      icon: "",
      order: localData.advantages.length,
    };

    setLocalData((prev) => ({
      ...prev,
      advantages: [...prev.advantages, newAdvantage],
    }));
    setHasLocalChanges(true);
  };

  const handleDeleteAdvantage = (index: number) => {
    setLocalData((prev) => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index),
    }));
    setHasLocalChanges(true);
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localData.advantages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalData((prev) => ({
      ...prev,
      advantages: reorderedItems,
    }));
    setHasLocalChanges(true);
  };

  const handleBackgroundImageSelect = (imageUrl: string) => {
    handleUpdateMainField("backgroundImage", imageUrl);
  };

  const handleLogoImageSelect = (imageUrl: string) => {
    handleUpdateMainField("logoImage", imageUrl);
  };

  const handleAdvantageIconSelect = (index: number, imageUrl: string) => {
    handleUpdateAdvantageItem(index, "icon", imageUrl);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
          <TabsTrigger
            value="content"
            className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Content</span>
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Images className="w-4 h-4" />
            <span className="font-medium">Images</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Section Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-title">Main Title</Label>
                  <Input
                    id="main-title"
                    placeholder="e.g., THE NOVAA"
                    value={localData.title}
                    onChange={(e) =>
                      handleUpdateMainField("title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlighted-title">Highlighted Title</Label>
                  <Input
                    id="highlighted-title"
                    placeholder="e.g., ADVANTAGE"
                    value={localData.highlightedTitle}
                    onChange={(e) =>
                      handleUpdateMainField("highlightedTitle", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Main Description</Label>
                <RichTextEditor
                  id="main-description"
                  value={localData.description}
                  onEditorChange={(content) =>
                    handleUpdateMainField("description", content)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card className="py-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Advantage Items</CardTitle>
              <Button
                onClick={handleAddAdvantage}
                className="bg-primary text-background cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Advantage
              </Button>
            </CardHeader>
            <CardContent>
              {localData.advantages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No advantages added yet</p>
                  <Button
                    onClick={handleAddAdvantage}
                    className="bg-primary text-background cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Advantage
                  </Button>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="advantages">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {localData.advantages.map((item, index) => (
                          <Draggable
                            key={index}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4 transition-all duration-200 ${
                                  snapshot.isDragging
                                    ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50"
                                    : ""
                                }`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"
                                >
                                  <GripVertical />
                                </div>

                                <div className="flex-grow space-y-4">
                                  <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                      value={item.title}
                                      onChange={(e) =>
                                        handleUpdateAdvantageItem(
                                          index,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Advantage title"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <RichTextEditor
                                      id={`advantage-desc-${item._id}`}
                                      value={item.description}
                                      onEditorChange={(content) =>
                                        handleUpdateAdvantageItem(
                                          index,
                                          "description",
                                          content
                                        )
                                      }
                                    />
                                  </div>

                                  {/* <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <div className="flex items-center gap-4">
                                      {item.icon && (
                                        <Image
                                          src={item.icon}
                                          alt="Icon preview"
                                          width={48}
                                          height={48}
                                          className="object-contain border rounded"
                                        />
                                      )}
                                      <MediaSelectButton
                                        label={item.icon ? "Change Icon" : "Select Icon"}
                                        mediaType="image"
                                        value={item.icon}
                                        onSelect={(imageUrl) => handleAdvantageIconSelect(index, imageUrl)}
                                      />
                                    </div>
                                  </div> */}
                                </div>

                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteAdvantage(index)}
                                  className="cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Water Effect Image Components</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-medium">Background Image</Label>
                <div className="w-full aspect-square rounded-lg border border-dashed flex items-center justify-center bg-gray-50 overflow-hidden">
                  {localData.backgroundImage ? (
                    <Image
                      src={localData.backgroundImage}
                      alt="Background Preview"
                      width={500}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No background image selected
                      </p>
                    </div>
                  )}
                </div>
                <MediaSelectButton
                  label="Select Background Image"
                  mediaType="image"
                  value={localData.backgroundImage}
                  onSelect={handleBackgroundImageSelect}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-medium">Center Logo Image</Label>
                <div className="w-full aspect-square rounded-lg bg-gray-50 border border-dashed flex items-center justify-center overflow-hidden">
                  {localData.logoImage ? (
                    <Image
                      src={localData.logoImage}
                      alt="Logo Preview"
                      width={300}
                      height={300}
                      className="object-contain w-full h-full p-4"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No logo image selected
                      </p>
                    </div>
                  )}
                </div>
                <MediaSelectButton
                  label="Select Logo Image"
                  mediaType="image"
                  value={localData.logoImage}
                  onSelect={handleLogoImageSelect}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main component - Global save mode only
export default function NovaaAdvantageManager({
  section,
  onChange,
  showSaveButton = false,
}: NovaaAdvantageManagerProps) {
  // Require section prop for global save mode
  if (!section || !onChange) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-600">
          This manager can only be used within the global page management
          system.
        </p>
      </div>
    );
  }

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="Novaa Advantage"
      description="Manage advantage section content and images"
    >
      <NovaaAdvantageManagerContent section={section} onChange={onChange} />
    </BaseSectionManager>
  );
}
