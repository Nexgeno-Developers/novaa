// app/admin/properties-manager/page.tsx (Redux Version)
"use client";

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, Trash2, GripVertical, RefreshCw, Sparkles, Images } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/Editor';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  fetchPropertiesData,
  savePropertiesData,
  updateMainHeading,
  updateSubHeading,
  updateDescription,
  updateExplorerHeading,
  updateExplorerDescription,
  updateCategoryTitle,
  updateLocation,
  addLocation,
  deleteLocation,
  reorderLocations,
  clearError,
  selectPropertiesData,
  selectPropertiesLoading,
  selectPropertiesError,
} from '@/redux/slices/propertiesSlice';

interface Location {
  id: string;
  name: string;
  image: string;
  coords: { top: string; left: string };
  icon: string;
}

const PropertiesManagerRedux = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectPropertiesData);
  const loading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);
  
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchPropertiesData());
  }, [dispatch]);

  // Set active category when data loads
  useEffect(() => {
    if (data?.categories?.length > 0 && !activeCategory) {
      setActiveCategory(data.categories[0].id);
    }
  }, [data, activeCategory]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleSave = async () => {
    if (!data) return;
    
    try {
      await dispatch(savePropertiesData({
        mainHeading: data.mainHeading,
        subHeading: data.subHeading,
        description: data.description,
        explorerHeading: data.explorerHeading,
        explorerDescription: data.explorerDescription,
        categories: data.categories,
      })).unwrap();
      
      setHasUnsavedChanges(false);
      toast.success('Properties data saved successfully!');
    } catch (error) {
           toast.error('Failed to save properties data.');

    }
  };

  const handleRefresh = () => {
    dispatch(fetchPropertiesData());
    setHasUnsavedChanges(false);
  };

  const handleAddLocation = (categoryId: string) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: 'New Location',
      image: 'https://placehold.co/200x150/C3912F/FFFFFF?text=New+Location',
      coords: { top: '50%', left: '50%' },
      icon: '/icons/map-pin.svg'
    };

    dispatch(addLocation({ categoryId, location: newLocation }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateLocation = (categoryId: string, locationId: string, updates: Partial<Location>) => {
    dispatch(updateLocation({ categoryId, locationId, updates }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteLocation = (categoryId: string, locationId: string) => {
    dispatch(deleteLocation({ categoryId, locationId }));
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const categoryId = activeCategory;
    const category = data?.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const newLocations = Array.from(category.locations);
    const [reorderedItem] = newLocations.splice(result.source.index, 1);
    newLocations.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderLocations({ categoryId, locations: newLocations }));
    setHasUnsavedChanges(true);
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setHasUnsavedChanges(true);
    
    switch (field) {
      case 'mainHeading':
        dispatch(updateMainHeading(value));
        break;
      case 'subHeading':
        dispatch(updateSubHeading(value));
        break;
      case 'description':
        dispatch(updateDescription(value));
        break;
      case 'explorerHeading':
        dispatch(updateExplorerHeading(value));
        break;
      case 'explorerDescription':
        dispatch(updateExplorerDescription(value));
        break;
    }
  };

  const handleCategoryTitleUpdate = (categoryId: string, title: string) => {
    dispatch(updateCategoryTitle({ categoryId, title }));
    setHasUnsavedChanges(true);
  };

  const getCurrentCategory = () => {
    return data?.categories.find(cat => cat.id === activeCategory);
  };

  if (loading && !data) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading properties data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Phuket Properties Manager</h1>
          {hasUnsavedChanges && (
            <p className="text-sm text-orange-600 mt-1">
              You have unsaved changes
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={loading}
            className='bg-primary text-background cursor-pointer '
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading || !hasUnsavedChanges}
            className='bg-primary text-background cursor-pointer'
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
              <TabsTrigger 
                value="content" 
                className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background  data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
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
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Main Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mainHeading" className='pb-2'>Main Heading</Label>
                <Input
                  id="mainHeading"
                  value={data?.mainHeading || ''}
                  onChange={(e) => handleFieldUpdate('mainHeading', e.target.value)}
                  placeholder="DISCOVER PRIME PROPERTIES"
                />
              </div>

              <div>
                <Label htmlFor="subHeading" className='pb-2'>Sub Heading</Label>
                <Input
                  id="subHeading"
                  value={data?.subHeading || ''}
                  onChange={(e) => handleFieldUpdate('subHeading', e.target.value)}
                  placeholder="ACROSS PHUKET"
                />
              </div>

              <div>
                <Label htmlFor="description" className='pb-2'>Description</Label>
                <RichTextEditor
                  value={data?.description || ''}
                  onEditorChange={(content) => handleFieldUpdate('description', content)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Phuket Explorer Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="explorerHeading" className='pb-2'>Explorer Heading</Label>
                <Input
                  id="explorerHeading"
                  value={data?.explorerHeading || ''}
                  onChange={(e) => handleFieldUpdate('explorerHeading', e.target.value)}
                  placeholder="Phuket Explorer"
                />
              </div>

              <div>
                <Label htmlFor="explorerDescription" className='pb-2'>Explorer Description</Label>
                <RichTextEditor
                  value={data?.explorerDescription || ''}
                  onEditorChange={(content) => handleFieldUpdate('explorerDescription', content)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Category Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Badge className='text-background'>{category.id}</Badge>
                  <div className="flex-1">
                    <Label className='pb-2'>Button Title</Label>
                    <Input
                      value={category.title}
                      onChange={(e) => handleCategoryTitleUpdate(category.id, e.target.value)}
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
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Map Location Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Select Category</Label>
                <div className="flex space-x-2 mt-2">
                  {data?.categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      onClick={() => setActiveCategory(category.id)}
                      className={`text-sm cursor-pointer ${activeCategory === category.id ? "bg-primary text-background" : 
                        "bg-gray-200"
                      } `}
                    >
                      {category.title.split(' ')[0]}
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
                      className='bg-primary text-background cursor-pointer'
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
                                  className="p-4 border rounded-lg bg-white"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab hover:cursor-grabbing"
                                    >
                                      <GripVertical className="w-4 h-4 text-gray-400" />
                                    </div>
                                    
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                      <div>
                                        <Label>Name</Label>
                                        <Input
                                          value={location.name}
                                          onChange={(e) => handleUpdateLocation(
                                            activeCategory,
                                            location.id,
                                            { name: e.target.value }
                                          )}
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label>Image URL</Label>
                                        <Input
                                          value={location.image}
                                          onChange={(e) => handleUpdateLocation(
                                            activeCategory,
                                            location.id,
                                            { image: e.target.value }
                                          )}
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label>Top Position (%)</Label>
                                        <Input
                                          value={location.coords.top.replace('%', '')}
                                          onChange={(e) => handleUpdateLocation(
                                            activeCategory,
                                            location.id,
                                            { coords: { ...location.coords, top: `${e.target.value}%` } }
                                          )}
                                          placeholder="50"
                                        />
                                      </div>
                                      
                                      <div>
                                        <Label>Left Position (%)</Label>
                                        <Input
                                          value={location.coords.left.replace('%', '')}
                                          onChange={(e) => handleUpdateLocation(
                                            activeCategory,
                                            location.id,
                                            { coords: { ...location.coords, left: `${e.target.value}%` } }
                                          )}
                                          placeholder="50"
                                        />
                                      </div>
                                    </div>
                                    
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteLocation(activeCategory, location.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  
                                  <div className="mt-4 p-2 bg-gray-50 rounded text-sm">
                                    <strong>Preview Position:</strong> Top: {location.coords.top}, Left: {location.coords.left}
                                    <div className="mt-2">
                                      <img 
                                        src={location.image} 
                                        alt={location.name}
                                        className="w-20 h-15 object-cover rounded border"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://placehold.co/80x60/gray/white?text=No+Image';
                                        }}
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
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Map Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Map Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-150 relative bg-background rounded-lg overflow-hidden">
                <img
                  src="/images/map2.png"
                  alt="Phuket Map"
                  className="w-full h-full object-contain"
                />
                
                {/* Preview pins for current category */}
                {getCurrentCategory()?.locations.map((location) => (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      top: location.coords.top,
                      left: location.coords.left,
                    }}
                    title={location.name}
                  >
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform">
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                This preview shows the current positions of locations for the selected category.
                Drag and drop locations in the management section above to reorder them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertiesManagerRedux;