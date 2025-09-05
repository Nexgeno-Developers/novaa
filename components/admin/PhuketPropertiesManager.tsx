"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Images,
  Edit,
  MapPin,
} from "lucide-react";
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

  // Default data structure
  const defaultData: PhuketPropertiesData = {
    mainHeading: "DISCOVER PRIME PROPERTIES",
    subHeading: "ACROSS PHUKET",
    description: "<p>Explore premium properties across Phuket's most sought-after locations.</p>",
    explorerHeading: "Phuket Explorer",
    explorerDescription: "<p>Navigate through different property categories and locations.</p>",
    mapImage: "/images/map2.png",
    categories: [],
  };

  const [propertiesData, setPropertiesData] = useState<PhuketPropertiesData>(defaultData);
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

  // Initial load
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

  // Notify parent of changes
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: propertiesData });
    }
  }, [propertiesData]);

  // Set active category
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

  // Category Management Functions
  const handleAddCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      title: newCategoryName.trim(),
      icon: "/icons/villa.svg", // Default icon
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

  const handleDeleteCategory = useCallback((categoryId: string) => {
    setPropertiesData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat.id !== categoryId),
    }));

    // If deleting active category, set new active category
    if (activeCategory === categoryId) {
      const remainingCategories = propertiesData.categories.filter(
        (cat) => cat.id !== categoryId
      );
      setActiveCategory(remainingCategories.length > 0 ? remainingCategories[0].id : "");
    }

    userHasInteractedRef.current = true;
  }, [activeCategory, propertiesData.categories]);

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

  const handleCategoryDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const newCategories = Array.from(propertiesData.categories);
    const [reorderedCategory] = newCategories.splice(result.source.index, 1);
    newCategories.splice(result.destination.index, 0, reorderedCategory);

    setPropertiesData((prev) => ({
      ...prev,
      categories: newCategories,
    }));
    userHasInteractedRef.current = true;
  }, [propertiesData.categories]);

  // Location Management Functions
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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6 container">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full h-15 grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
            <TabsTrigger
              value="content"
              className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Edit className="w-4 h-4" />
              <span className="font-medium">Categories</span>
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Images className="w-4 h-4" />
              <span className="font-medium">Map</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Main Section Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mainHeading" className="pb-2">
                    Main Heading
                  </Label>
                  <Input
                    id="mainHeading"
                    value={propertiesData.mainHeading || ""}
                    onChange={(e) =>
                      handleFieldUpdate("mainHeading", e.target.value)
                    }
                    placeholder="DISCOVER PRIME PROPERTIES"
                  />
                </div>

                <div>
                  <Label htmlFor="subHeading" className="pb-2">
                    Sub Heading
                  </Label>
                  <Input
                    id="subHeading"
                    value={propertiesData.subHeading || ""}
                    onChange={(e) =>
                      handleFieldUpdate("subHeading", e.target.value)
                    }
                    placeholder="ACROSS PHUKET"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="pb-2">
                    Description
                  </Label>
                  <RichTextEditor
                    value={propertiesData.description || ""}
                    onEditorChange={(content) =>
                      handleFieldUpdate("description", content)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Phuket Explorer Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="explorerHeading" className="pb-2">
                    Explorer Heading
                  </Label>
                  <Input
                    id="explorerHeading"
                    value={propertiesData.explorerHeading || ""}
                    onChange={(e) =>
                      handleFieldUpdate("explorerHeading", e.target.value)
                    }
                    placeholder="Phuket Explorer"
                  />
                </div>

                <div>
                  <Label htmlFor="explorerDescription" className="pb-2">
                    Explorer Description
                  </Label>
                  <RichTextEditor
                    value={propertiesData.explorerDescription || ""}
                    onEditorChange={(content) =>
                      handleFieldUpdate("explorerDescription", content)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Category */}
                <div className="flex gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex-1">
                    <Label className="pb-2">Add New Category</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name..."
                      onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                    />
                  </div>
                  <Button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="mt-6 text-background cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                {/* Categories List */}
                <DragDropContext onDragEnd={handleCategoryDragEnd}>
                  <Droppable droppableId="categories">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
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
                                className="p-4 border rounded-lg bg-white shadow-sm"
                              >
                                <div className="flex items-center space-x-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab hover:cursor-grabbing"
                                  >
                                    <GripVertical className="w-5 h-5 text-gray-400" />
                                  </div>

                                  <Badge variant="outline" className="text-background">{index + 1}</Badge>

                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="pt-1 mb-2 text-background">Category Title</Label>
                                      <Input
                                        value={category.title}
                                        onChange={(e) =>
                                          handleCategoryTitleUpdate(
                                            category.id,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Category Title"
                                      />
                                    </div>

                                    <div>
                                      <MediaSelectButton
                                        label="Category Icon"
                                        mediaType="image"
                                        value={category.icon}
                                        onSelect={(iconUrl) =>
                                          handleCategoryIconUpdate(category.id, iconUrl)
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="text-sm text-gray-500">
                                    {category.locations.length} locations
                                  </div>

                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Management Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Map Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Map Image Selection */}
                <div>
                  <MediaSelectButton
                    label="Map Background Image"
                    mediaType="image"
                    value={propertiesData.mapImage}
                    onSelect={(imageUrl) => handleFieldUpdate("mapImage", imageUrl)}
                  />
                  {propertiesData.mapImage && (
                    <div className="mt-4">
                      <img
                        src={propertiesData.mapImage}
                        alt="Map preview"
                        className="w-48 h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                {/* Category Selection for Locations */}
                <div className="mb-4">
                  <Label>Select Category for Location Management</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {propertiesData.categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeCategory === category.id ? "default" : "outline"
                        }
                        onClick={() => setActiveCategory(category.id)}
                        size="sm"
                      >
                        {category.title}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Location Management */}
                {getCurrentCategory() && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {getCurrentCategory()?.title} Locations
                      </h3>
                      <Button
                        onClick={() => handleAddLocation(activeCategory)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                      </Button>
                    </div>

                    <DragDropContext onDragEnd={handleLocationDragEnd}>
                      <Droppable droppableId="locations">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {getCurrentCategory()?.locations.map(
                              (location, index) => (
                                <Draggable
                                  key={location.id}
                                  draggableId={location.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="p-4 border rounded-lg bg-white"
                                    >
                                      <div className="flex items-start space-x-4">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab hover:cursor-grabbing mt-8"
                                        >
                                          <GripVertical className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="flex-1 space-y-4">
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                              <Label>Location Name</Label>
                                              <Input
                                                value={location.name}
                                                onChange={(e) =>
                                                  handleUpdateLocation(
                                                    activeCategory,
                                                    location.id,
                                                    { name: e.target.value }
                                                  )
                                                }
                                              />
                                            </div>

                                            <div>
                                              <Label>Top Position (%)</Label>
                                              <Input
                                                value={location.coords.top.replace(
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
                                                        top: `${e.target.value}%`,
                                                      },
                                                    }
                                                  )
                                                }
                                                placeholder="50"
                                              />
                                            </div>

                                            <div>
                                              <Label>Left Position (%)</Label>
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
                                                placeholder="50"
                                              />
                                            </div>
                                          </div>

                                          <div>
                                            <MediaSelectButton
                                              label="Location Image"
                                              mediaType="image"
                                              value={location.image}
                                              onSelect={(imageUrl) =>
                                                handleUpdateLocation(
                                                  activeCategory,
                                                  location.id,
                                                  { image: imageUrl }
                                                )
                                              }
                                            />
                                          </div>

                                          {location.image && (
                                            <div className="mt-2">
                                              <img
                                                src={location.image}
                                                alt={location.name}
                                                className="w-20 h-15 object-cover rounded border"
                                                onError={(e) => {
                                                  e.currentTarget.src =
                                                    "https://placehold.co/80x60/gray/white?text=No+Image";
                                                }}
                                              />
                                            </div>
                                          )}

                                          <div className="p-2 bg-gray-50 rounded text-sm">
                                            <strong>Position:</strong> Top:{" "}
                                            {location.coords.top}, Left:{" "}
                                            {location.coords.left}
                                          </div>
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
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              )
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                )}

                {propertiesData.categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No categories available. Please add categories first in the Categories tab.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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