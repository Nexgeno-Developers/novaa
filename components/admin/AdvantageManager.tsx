"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// Redux
import { AppDispatch, RootState } from "@/redux";
import {
  fetchNovaaAdvantageData,
  saveNovaaAdvantageData,
  updateMainField,
  updateAdvantageItem,
  reorderAdvantages,
} from "@/redux/slices/advantageSlice";

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

interface NovaaAdvantageManagerProps {
  section: any; // Required
  onChange: (changes: any) => void; // Required
  showSaveButton?: boolean;
}

const NovaaAdvantageManagerContent = ({
  onChange,
  showSaveButton = true,
}: {
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.advantage);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNovaaAdvantageData());
    }
  }, [status, dispatch]);

  // Store original data for comparison
  useEffect(() => {
    if (data && !originalData) {
      setOriginalData(JSON.parse(JSON.stringify(data)));
    }
  }, [data, originalData]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && data && originalData && hasUnsavedChanges) {
      const hasChanges = JSON.stringify(data) !== JSON.stringify(originalData);
      if (hasChanges) {
        setHasUnsavedChanges(true);
        onChange({ content: data });
      }
    }
  }, [data, originalData]);

  const handleSaveChanges = () => {
    if (data) {
      dispatch(saveNovaaAdvantageData(data));
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setHasUnsavedChanges(false);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination || !data) return;
    const items = Array.from(data.advantages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderAdvantages(items));
  };

  const handleRefresh = () => {
    dispatch(fetchNovaaAdvantageData());
    setHasUnsavedChanges(false);
    setOriginalData(null);
  };

  const handleBackgroundImageSelect = (imageUrl: string) => {
    dispatch(updateMainField({ field: "backgroundImage", value: imageUrl }));
  };

  const handleLogoImageSelect = (imageUrl: string) => {
    dispatch(updateMainField({ field: "logoImage", value: imageUrl }));
  };

  if (status === "loading" && !data)
    return <div className="p-8">Loading Advantage Manager...</div>;
  if (status === "failed" || !data)
    return <div className="p-8">Could not load data. Try refreshing.</div>;

  return (
    <div className="space-y-6">
      {/* Header - only show in standalone mode */}
      {showSaveButton && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Nova Advantage Manager
            </h1>
            {hasUnsavedChanges && (
              <p className="text-sm text-orange-600 mt-1">
                You have unsaved changes
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefresh}
              disabled={status === "loading"}
              className="bg-primary text-background cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  status === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-primary text-background cursor-pointer"
              disabled={status === "loading" || !hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {status === "loading" ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

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
            <span className="font-medium">Center Image</span>
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
                    value={data.title}
                    onChange={(e) =>
                      dispatch(
                        updateMainField({
                          field: "title",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlighted-title">Highlighted Title</Label>
                  <Input
                    id="highlighted-title"
                    placeholder="e.g., ADVANTAGE"
                    value={data.highlightedTitle}
                    onChange={(e) =>
                      dispatch(
                        updateMainField({
                          field: "highlightedTitle",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Main Description</Label>
                <RichTextEditor
                  id="main-description"
                  value={data.description}
                  onEditorChange={(content) =>
                    dispatch(
                      updateMainField({ field: "description", value: content })
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card className="py-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Advantage Items</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="advantages">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {data.advantages.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4"
                            >
                              <div className="text-gray-400 hover:text-gray-600 cursor-grab pt-2">
                                <GripVertical />
                              </div>
                              <div className="flex-grow space-y-4">
                                <div className="space-y-2">
                                  <Label>Title</Label>
                                  <Input
                                    value={item.title}
                                    onChange={(e) =>
                                      dispatch(
                                        updateAdvantageItem({
                                          index,
                                          field: "title",
                                          value: e.target.value,
                                        })
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <RichTextEditor
                                    id={`advantage-desc-${item._id}`}
                                    value={item.description}
                                    onEditorChange={(content) =>
                                      dispatch(
                                        updateAdvantageItem({
                                          index,
                                          field: "description",
                                          value: content,
                                        })
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
                <div className="w-full aspect-square rounded-lg border border-dashed flex items-center justify-center bg-gray-300 overflow-hidden">
                  {data.backgroundImage ? (
                    <Image
                      src={data.backgroundImage}
                      alt="Background Preview"
                      width={500}
                      height={300}
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <MediaSelectButton
                  label="Select Background Image"
                  mediaType="image"
                  value={data.backgroundImage}
                  onSelect={handleBackgroundImageSelect}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-medium">Center Logo Image</Label>
                <div className="w-full aspect-square rounded-lg bg-gray-300 border border-dashed flex items-center justify-center overflow-hidden">
                  {data.logoImage ? (
                    <Image
                      src={data.logoImage}
                      alt="Logo Preview"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <MediaSelectButton
                  label="Select Logo Image"
                  mediaType="image"
                  value={data.logoImage}
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
          This manager can only be used within the global page management system.
        </p>
      </div>
    );
  }

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="Nova Advantage"
      description="Manage advantage section content and images"
    >
      <NovaaAdvantageManagerContent 
        onChange={onChange}
        showSaveButton={false} 
      />
    </BaseSectionManager>
  );
}