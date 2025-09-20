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
  Image as ImageIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  section: any;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

const NovaaAdvantageManagerContent = ({
  section,
  onChange,
}: {
  section: any;
  onChange: (changes: any) => void;
}) => {
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

      if (!hasLocalChanges) {
        setLocalData(newData);
        setOriginalData(JSON.parse(JSON.stringify(newData)));
      }
    }
  }, [section, hasLocalChanges]);

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

  return (
    <div className="space-y-4">
      {/* Basic Content */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            <div>
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
          
          <div>
            <Label>Description</Label>
            <div className="min-h-[120px]">
              <RichTextEditor
                value={localData.description}
                onEditorChange={(content) =>
                  handleUpdateMainField("description", content)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Background Image</Label>
            {/* <div className="w-full aspect-video rounded border border-dashed flex items-center justify-center bg-gray-50 overflow-hidden">
              {localData.backgroundImage ? (
                <Image
                  src={localData.backgroundImage}
                  alt="Background"
                  width={300}
                  height={168}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">No background</p>
                </div>
              )}
            </div> */}
            <MediaSelectButton
              label=""
              mediaType="image"
              value={localData.backgroundImage}
              onSelect={(url) => handleUpdateMainField("backgroundImage", url)}
              placeholder="Select background"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo Image</Label>
            {/* <div className="w-full aspect-video rounded border border-dashed flex items-center justify-center bg-gray-50 overflow-hidden">
              {localData.logoImage ? (
                <Image
                  src={localData.logoImage}
                  alt="Logo"
                  width={200}
                  height={112}
                  className="object-contain w-full h-full p-2"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">No logo</p>
                </div>
              )}
            </div> */}
            <MediaSelectButton
              label=""
              mediaType="image"
              value={localData.logoImage}
              onSelect={(url) => handleUpdateMainField("logoImage", url)}
              placeholder="Select logo"
            />
          </div>
        </div>


      {/* Advantages */}

        <div className="pb-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Advantage Items</p>
            <Button onClick={handleAddAdvantage} size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
        <div>
          {localData.advantages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm mb-3">No advantages added yet</p>
              <Button onClick={handleAddAdvantage} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add First Advantage
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="advantages">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
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
                            className={`p-3 border rounded bg-white flex items-start gap-3 ${
                              snapshot.isDragging ? "shadow-lg" : ""
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex-grow space-y-3">
                              <div>
                                <Label className="text-xs">Title</Label>
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
                                  className="text-sm"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Description</Label>
                                <div className="min-h-[80px]">
                                  <RichTextEditor
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
                              </div>
                            </div>

                            <Button
                              size="sm"
                              className="cursor-pointer"
                              variant="destructive"
                              onClick={() => handleDeleteAdvantage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
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
        </div>

    </div>
  );
};

export default function NovaaAdvantageManager({
  section,
  onChange,
  showSaveButton = false,
}: NovaaAdvantageManagerProps) {
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
      title="Novaa Advantage"
      description="Manage advantage section content and images"
    >
      <NovaaAdvantageManagerContent section={section} onChange={onChange} />
    </BaseSectionManager>
  );
}