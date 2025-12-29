"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import RichTextEditor from "@/components/admin/Editor";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

// Type definitions
interface Category {
  id: string;
  title: string;
  icon: string;
  locations: Location[];
}

interface Location {
  id: string;
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
}

interface PhuketPropertiesData {
  mainHeading: string;
  subHeading: string;
  description: string;
  explorerHeading: string;
  explorerDescription: string;
  backgroundImage: string;
  mapImage: string;
  categories: Category[];
}

interface PhuketPropertiesManagerProps {
  section: any;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function PhuketPropertiesManager({
  section,
  onChange,
  showSaveButton = false,
}: PhuketPropertiesManagerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  const defaultData: PhuketPropertiesData = {
    mainHeading: "DISCOVER ",
    subHeading: "PHUKET",
    description:
      "<p>Explore premium properties across Phuket's most sought-after locations.</p>",
    explorerHeading: "Phuket Explorer",
    explorerDescription:
      "<p>Navigate through different property categories and locations.</p>",
    backgroundImage: "/images/background.jpg",
    mapImage: "/images/map2.png",
    categories: [],
  };

  const [propertiesData, setPropertiesData] =
    useState<PhuketPropertiesData>(defaultData);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");

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
      const sectionData = section.content;
      setPropertiesData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
      setLoading(false);
    } else if (!section && !isInitializedRef.current) {
      setPropertiesData(defaultData);
      isInitializedRef.current = true;
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: propertiesData });
    }
  }, [propertiesData]);

  useEffect(() => {
    if (propertiesData.categories.length > 0 && !activeCategory) {
      setActiveCategory(propertiesData.categories[0].id);
    }
  }, [propertiesData.categories, activeCategory]);

  const updatePropertiesData = useCallback(
    (updates: Partial<PhuketPropertiesData>) => {
      userHasInteractedRef.current = true;
      setPropertiesData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleFieldUpdate = useCallback(
    (field: string, value: string) => {
      updatePropertiesData({ [field]: value });
    },
    [updatePropertiesData]
  );

  const handleAddCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      title: newCategoryName.trim(),
      icon: "/icons/villa.svg",
      locations: [],
    };

    setPropertiesData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));

    setNewCategoryName("");
    setActiveCategory(newCategory.id);
    userHasInteractedRef.current = true;
  }, [newCategoryName]);

  const handleDeleteCategory = useCallback(
    (categoryId: string) => {
      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.filter((cat) => cat.id !== categoryId),
      }));

      if (activeCategory === categoryId) {
        const remainingCategories = propertiesData.categories.filter(
          (cat) => cat.id !== categoryId
        );
        setActiveCategory(
          remainingCategories.length > 0 ? remainingCategories[0].id : ""
        );
      }

      userHasInteractedRef.current = true;
    },
    [activeCategory, propertiesData.categories]
  );

  const handleCategoryTitleUpdate = useCallback(
    (categoryId: string, title: string) => {
      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, title } : cat
        ),
      }));
      userHasInteractedRef.current = true;
    },
    []
  );

  const handleCategoryIconUpdate = useCallback(
    (categoryId: string, icon: string) => {
      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, icon } : cat
        ),
      }));
      userHasInteractedRef.current = true;
    },
    []
  );

  const handleCategoryDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newCategories = Array.from(propertiesData.categories);
      const [reorderedCategory] = newCategories.splice(result.source.index, 1);
      newCategories.splice(result.destination.index, 0, reorderedCategory);

      setPropertiesData((prev) => ({
        ...prev,
        categories: newCategories,
      }));
      userHasInteractedRef.current = true;
    },
    [propertiesData.categories]
  );

  const handleAddLocation = useCallback((categoryId: string) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: "New Location",
      image: "",
      coords: { top: "50%", left: "50%" },
      icon: "/icons/map-pin.svg",
    };

    setPropertiesData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, locations: [...cat.locations, newLocation] }
          : cat
      ),
    }));
    userHasInteractedRef.current = true;
  }, []);

  const handleUpdateLocation = useCallback(
    (categoryId: string, locationId: string, updates: Partial<Location>) => {
      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                locations: cat.locations.map((loc) =>
                  loc.id === locationId ? { ...loc, ...updates } : loc
                ),
              }
            : cat
        ),
      }));
      userHasInteractedRef.current = true;
    },
    []
  );

  const handleDeleteLocation = useCallback(
    (categoryId: string, locationId: string) => {
      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                locations: cat.locations.filter((loc) => loc.id !== locationId),
              }
            : cat
        ),
      }));
      userHasInteractedRef.current = true;
    },
    []
  );

  const handleLocationDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const categoryId = activeCategory;
      const category = propertiesData.categories.find(
        (cat) => cat.id === categoryId
      );
      if (!category) return;

      const newLocations = Array.from(category.locations);
      const [reorderedItem] = newLocations.splice(result.source.index, 1);
      newLocations.splice(result.destination.index, 0, reorderedItem);

      setPropertiesData((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id === categoryId ? { ...cat, locations: newLocations } : cat
        ),
      }));
      userHasInteractedRef.current = true;
    },
    [activeCategory, propertiesData.categories]
  );

  const getCurrentCategory = useCallback(() => {
    return propertiesData.categories.find((cat) => cat.id === activeCategory);
  }, [propertiesData.categories, activeCategory]);

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
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Content */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="mainHeading">Main Heading</Label>
            <Input
              id="mainHeading"
              value={propertiesData.mainHeading || ""}
              onChange={(e) => handleFieldUpdate("mainHeading", e.target.value)}
              placeholder="Main heading"
            />
          </div>
          <div>
            <Label htmlFor="subHeading">Sub Heading</Label>
            <Input
              id="subHeading"
              value={propertiesData.subHeading || ""}
              onChange={(e) => handleFieldUpdate("subHeading", e.target.value)}
              placeholder="Sub heading"
            />
          </div>
          <div>
            <Label htmlFor="explorerHeading">Explorer Heading</Label>
            <Input
              id="explorerHeading"
              value={propertiesData.explorerHeading || ""}
              onChange={(e) =>
                handleFieldUpdate("explorerHeading", e.target.value)
              }
              placeholder="Explorer heading"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* Background IMage */}
            <MediaSelectButton
              label="Background Image"
              mediaType="image"
              value={propertiesData.backgroundImage}
              onSelect={(imageUrl) =>
                handleFieldUpdate("backgroundImage", imageUrl)
              }
            />
          </div>
          <div>
             {/* Map & Locations */}
        <MediaSelectButton
          label="Map Image"
          mediaType="image"
          value={propertiesData.mapImage}
          onSelect={(imageUrl) => handleFieldUpdate("mapImage", imageUrl)}
        />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Description</Label>
            <RichTextEditor
              value={propertiesData.description || ""}
              onEditorChange={(content) =>
                handleFieldUpdate("description", content)
              }
            />
          </div>

          <div>
            <Label>Explorer Description</Label>
            <RichTextEditor
              value={propertiesData.explorerDescription || ""}
              onEditorChange={(content) =>
                handleFieldUpdate("explorerDescription", content)
              }
            />
          </div>
        </div>

        {/* Category Management */}

        <p className="text-sm font-semibold">Category Management</p>

        {/* Add Category */}
        <div className="flex gap-2 p-3 border-2 border-dashed rounded">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1"
          />
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {/* Categories List */}
        <DragDropContext onDragEnd={handleCategoryDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {propertiesData.categories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="p-3 border rounded bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {index + 1}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {category.locations.length} loc
                            </span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <Input
                          value={category.title}
                          onChange={(e) =>
                            handleCategoryTitleUpdate(
                              category.id,
                              e.target.value
                            )
                          }
                          placeholder="Category title"
                          className="text-sm"
                        />

                        <MediaSelectButton
                          label=""
                          mediaType="image"
                          value={category.icon}
                          onSelect={(iconUrl) =>
                            handleCategoryIconUpdate(category.id, iconUrl)
                          }
                          placeholder="Select icon"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

       
        {/* Category Selection */}
        {propertiesData.categories.length > 0 && (
          <div>
            <Label className="text-sm mb-2 block">
              Select Category for Locations
            </Label>
            <div className="flex flex-wrap gap-1">
              {propertiesData.categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(category.id)}
                  className="text-sm"
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Location Management */}
        {getCurrentCategory() && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm">
                {getCurrentCategory()?.title} Locations
              </Label>
              <Button
                onClick={() => handleAddLocation(activeCategory)}
                size="sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>

            <DragDropContext onDragEnd={handleLocationDragEnd}>
              <Droppable droppableId="locations">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {getCurrentCategory()?.locations.map((location, index) => (
                      <Draggable
                        key={location.id}
                        draggableId={location.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-3 border rounded bg-white"
                          >
                            <div className="flex items-start space-x-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:cursor-grabbing mt-2"
                              >
                                <GripVertical className="w-3 h-3 text-gray-400" />
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  <Input
                                    value={location.name}
                                    onChange={(e) =>
                                      handleUpdateLocation(
                                        activeCategory,
                                        location.id,
                                        { name: e.target.value }
                                      )
                                    }
                                    placeholder="Location name"
                                    className="text-sm"
                                  />
                                  <Input
                                    value={location.coords.top.replace("%", "")}
                                    onChange={(e) =>
                                      handleUpdateLocation(
                                        activeCategory,
                                        location.id,
                                        {
                                          coords: {
                                            ...location.coords,
                                            top: `${e.target.value}%`,
                                          },
                                        }
                                      )
                                    }
                                    placeholder="Top %"
                                    className="text-sm"
                                  />
                                  <Input
                                    value={location.coords.left.replace(
                                      "%",
                                      ""
                                    )}
                                    onChange={(e) =>
                                      handleUpdateLocation(
                                        activeCategory,
                                        location.id,
                                        {
                                          coords: {
                                            ...location.coords,
                                            left: `${e.target.value}%`,
                                          },
                                        }
                                      )
                                    }
                                    placeholder="Left %"
                                    className="text-sm"
                                  />
                                </div>

                                <MediaSelectButton
                                  label=""
                                  mediaType="image"
                                  value={location.image}
                                  onSelect={(imageUrl) =>
                                    handleUpdateLocation(
                                      activeCategory,
                                      location.id,
                                      { image: imageUrl }
                                    )
                                  }
                                  placeholder="Select location image"
                                />
                              </div>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteLocation(
                                    activeCategory,
                                    location.id
                                  )
                                }
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
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
          </div>
        )}

        {propertiesData.categories.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Add categories first to manage locations
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseSectionManager
      section={section}
      onChange={handleOnChange}
      showSaveButton={showSaveButton}
      title="Phuket Properties"
      description="Manage properties content, categories, and map locations"
    >
      {renderContent()}
    </BaseSectionManager>
  );
}
