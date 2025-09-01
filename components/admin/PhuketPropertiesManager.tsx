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
  categories: Category[];
}

interface PhuketPropertiesManagerProps {
  section: any; // Required for global mode
  onChange: (changes: any) => void; // Required for global mode
  showSaveButton?: boolean;
}

export default function PhuketPropertiesManager({
  section,
  onChange,
  showSaveButton = false,
}: PhuketPropertiesManagerProps) {
  // State management following HomePageManager pattern
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track initialization state like HomePageManager
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Default data structure
  const defaultData: PhuketPropertiesData = {
    mainHeading: "DISCOVER PRIME PROPERTIES",
    subHeading: "ACROSS PHUKET",
    description: "",
    explorerHeading: "Phuket Explorer",
    explorerDescription: "",
    categories: [
      {
        id: "luxury-villas",
        title: "Luxury Villas",
        icon: "/icons/villa.svg",
        locations: [],
      },
      {
        id: "condominiums",
        title: "Condominiums",
        icon: "/icons/condo.svg",
        locations: [],
      },
      {
        id: "commercial",
        title: "Commercial",
        icon: "/icons/commercial.svg",
        locations: [],
      },
    ],
  };

  // Local state for properties data
  const [propertiesData, setPropertiesData] = useState<PhuketPropertiesData>(defaultData);

  // Additional state for UI
  const [activeCategory, setActiveCategory] = useState<string>("");

  // Memoize the onChange callback to prevent infinite re-renders
  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange) {
        onChange(changes);
        userHasInteractedRef.current = true;
      }
    },
    [onChange]
  );

  // Initial load - section data only
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content;
      setPropertiesData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
      setLoading(false);
    } else if (!section && !isInitializedRef.current) {
      // Should never happen in global mode, but fallback
      setPropertiesData(defaultData);
      isInitializedRef.current = true;
      setLoading(false);
    }
  }, [section]);

  // Notify parent only if user interacted
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: propertiesData });
    }
  }, [propertiesData]);

  // Set active category when data loads
  useEffect(() => {
    if (propertiesData.categories.length > 0 && !activeCategory) {
      setActiveCategory(propertiesData.categories[0].id);
    }
  }, [propertiesData.categories, activeCategory]);

  // Memoize updatePropertiesData to prevent unnecessary re-renders
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

  const handleDragEnd = useCallback(
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

  const handleLocationImageSelect = useCallback(
    (categoryId: string, locationId: string, imageUrl: string) => {
      handleUpdateLocation(categoryId, locationId, { image: imageUrl });
    },
    [handleUpdateLocation]
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
          <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
            <TabsTrigger
              value="content"
              className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Content Management</span>
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Images className="w-4 h-4" />
              <span className="font-medium">Map Management</span>
            </TabsTrigger>
          </TabsList>

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

            <Card className="py-6">
              <CardHeader>
                <CardTitle>Category Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {propertiesData.categories.map((category: Category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <Badge className="text-background">{category.id}</Badge>
                    <div className="flex-1">
                      <Label className="pb-2">Button Title</Label>
                      <Input
                        value={category.title}
                        onChange={(e) =>
                          handleCategoryTitleUpdate(category.id, e.target.value)
                        }
                        placeholder="Category Title"
                      />
                    </div>
                    <div className="text-sm pt-4 text-gray-500">
                      Icon: {category.icon}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Map Location Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Select Category</Label>
                  <div className="flex space-x-2 mt-2">
                    {propertiesData.categories.map((category: Category) => (
                      <Button
                        key={category.id}
                        variant={
                          activeCategory === category.id ? "default" : "outline"
                        }
                        onClick={() => setActiveCategory(category.id)}
                        className={`text-sm cursor-pointer ${
                          activeCategory === category.id
                            ? "bg-primary text-background"
                            : "bg-gray-200"
                        }`}
                      >
                        {category.title.split(" ")[0]}
                      </Button>
                    ))}
                  </div>
                </div>

                {getCurrentCategory() && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {getCurrentCategory()?.title} Locations
                      </h3>
                      <Button
                        onClick={() => handleAddLocation(activeCategory)}
                        size="sm"
                        className="bg-primary text-background cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Location
                      </Button>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="locations">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                          >
                            {getCurrentCategory()?.locations.map(
                              (location: Location, index: number) => (
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
                                              <Label>Name</Label>
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
                                                handleLocationImageSelect(
                                                  activeCategory,
                                                  location.id,
                                                  imageUrl
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Always wrapped with BaseSectionManager for global mode
  return (
    <BaseSectionManager
      section={section}
      onChange={handleOnChange}
      showSaveButton={showSaveButton}
      title="Phuket Properties"
      description="Manage properties content and map locations"
    >
      {renderContent()}
    </BaseSectionManager>
  );
}