"use client";

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import { RootState } from '@/redux';
import { fetchMedia, MediaItem } from '@/redux/slices/mediaSlice';
import { AdvancedMediaSelector } from '@/components/admin/AdvancedMediaSelector';
import BaseSectionManager from '@/components/admin/BaseSectionManager';
import RichTextEditor from '@/components/admin/Editor';
import { useAppDispatch } from '@/redux/hooks';
import Image from 'next/image';

// ShadCN UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePlus, Sparkles, Target, Images } from 'lucide-react';

interface WhyInvestManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function WhyInvestManager({ 
  section, 
  onChange, 
  showSaveButton = true 
}: WhyInvestManagerProps = {}) {
  const dispatch = useAppDispatch();
  const { items: mediaItems } = useSelector((state: RootState) => state.media);

  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  // Local state for section-based management
  const [localData, setLocalData] = useState({
    mainTitle: section?.content?.mainTitle || '',
    highlightedTitle: section?.content?.highlightedTitle || '',
    description: section?.content?.description || '',
    investmentPoints: section?.content?.investmentPoints || [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
    images: section?.content?.images || ['', '', '', ''],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content) {
      const newData = {
        mainTitle: section.content.mainTitle || '',
        highlightedTitle: section.content.highlightedTitle || '',
        description: section.content.description || '',
        investmentPoints: section.content.investmentPoints || [
          { title: '', description: '' },
          { title: '', description: '' },
          { title: '', description: '' },
          { title: '', description: '' },
        ],
        images: section.content.images || ['', '', '', ''],
      };
      setLocalData(newData);
      setOriginalData(JSON.parse(JSON.stringify(newData)));
    }
  }, [section]);

  // Load media on mount
  useEffect(() => {
    dispatch(fetchMedia({ limit: 500, reset: true }));
  }, [dispatch]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [hasLocalChanges]);

  const handleFieldChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleInvestmentPointChange = (index: number, field: 'title' | 'description', value: string) => {
    setLocalData(prev => ({
      ...prev,
      investmentPoints: prev.investmentPoints.map((point: any, i: number) => 
        i === index ? { ...point, [field]: value } : point
      )
    }));
    setHasLocalChanges(true);
  };

  const handleImageChange = (index: number, value: string) => {
    setLocalData(prev => ({
      ...prev,
      images: prev.images.map((img: any, i: number) => i === index ? value : img)
    }));
    setHasLocalChanges(true);
  };

  const handleOpenSelector = (index: number) => {
    setEditingImageIndex(index);
    setSelectorOpen(true);
  };

  const handleImageSelect = (media: MediaItem) => {
    if (editingImageIndex !== null) {
      handleImageChange(editingImageIndex, media.secure_url);
    }
    setEditingImageIndex(null);
    setSelectorOpen(false);
  };

  const selectedImageValue = editingImageIndex !== null ? localData.images[editingImageIndex] : undefined;

  // If section prop is provided, render within BaseSectionManager
  if (section) {
    return (
      <>
        <BaseSectionManager
          section={section}
          onChange={onChange || (() => {})}
          showSaveButton={showSaveButton}
          title="Why Invest Section"
          description="Configure your investment proposition content"
        >
          <div className="space-y-6">
            {/* Enhanced Tabs */}
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
                  value="images"
                  className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                >
                  <Images className="w-4 h-4" />
                  <span className="font-medium">Images</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                {/* Main Section Card */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
                    <CardTitle className="flex items-center space-x-3 text-xl text-slate-800 dark:text-slate-100">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                      <span>Main Section</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative space-y-6 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="mainTitle" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Main Title</Label>
                        <Input 
                          id="mainTitle" 
                          value={localData.mainTitle}
                          onChange={(e) => handleFieldChange('mainTitle', e.target.value)}
                          className="border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300 px-4 py-3"
                          placeholder="Enter main title..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="highlightedTitle" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Highlighted Title</Label>
                        <Input 
                          id="highlightedTitle" 
                          value={localData.highlightedTitle}
                          onChange={(e) => handleFieldChange('highlightedTitle', e.target.value)}
                          className="border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:border-purple-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300 px-4 py-3"
                          placeholder="Enter highlighted title..."
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
                      <div className="rounded-xl overflow-hidden border-2 border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                        <RichTextEditor
                          value={localData.description}
                          onEditorChange={(content) => handleFieldChange('description', content)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Points Card */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative bg-gradient-to-r from-slate-50 to-emerald-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
                    <CardTitle className="flex items-center space-x-3 text-xl text-slate-800 dark:text-slate-100">
                      <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full"></div>
                      <span>Investment Points</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative space-y-6 p-8">
                    <div className="grid gap-6">
                      {localData.investmentPoints.map(({point , index} : {point : any , index : any}) => (
                        <div 
                          key={index} 
                          className="group/point relative p-6 border-2 border-slate-200/60 dark:border-slate-600/60 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-700/80 dark:to-slate-800/80 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          
                          <div className="relative space-y-4">
                            <div className="flex items-center">
                              <h4 className="font-bold text-lg flex items-center space-x-2 text-slate-800 dark:text-slate-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span>Investment Point {index + 1}</span>
                              </h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</Label>
                                <Input 
                                  value={point?.title}
                                  onChange={(e) => handleInvestmentPointChange(index, 'title', e.target.value)}
                                  className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 focus:border-purple-500 transition-all duration-300"
                                  placeholder="Point title..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
                                <Textarea 
                                  value={point?.description}
                                  onChange={(e) => handleInvestmentPointChange(index, 'description', e.target.value)}
                                  className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 focus:border-emerald-500 transition-all duration-300 min-h-[80px]"
                                  placeholder="Describe this investment point..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images">
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative bg-gradient-to-r from-slate-50 to-violet-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
                    <CardTitle className="flex items-center space-x-3 text-xl text-slate-800 dark:text-slate-100">
                      <div className="w-2 h-8 bg-gradient-to-b from-violet-600 to-pink-600 rounded-full"></div>
                      <span>Section Images</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative p-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                      Manage the four showcase images displayed in your investment grid.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="group/image space-y-4">
                          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span>Image {index + 1}</span>
                          </Label>
                          
                          <div className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover/image:border-violet-400 dark:group-hover/image:border-violet-500 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 overflow-hidden transition-all duration-300 group-hover/image:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-pink-600/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                            {localData.images[index] ? (
                              <div className="relative w-full h-full group">
                                <Image 
                                  src={localData.images[index]} 
                                  alt={`Selected Image ${index + 1}`} 
                                  width={400} 
                                  height={225} 
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            ) : (
                              <div className="text-center space-y-2">
                                <ImagePlus className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto group-hover/image:text-violet-500 transition-colors duration-300" />
                                <span className="text-slate-500 dark:text-slate-400 font-medium">No Image Selected</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            className="w-full border-2 border-slate-200 dark:border-slate-600 hover:border-violet-500 dark:hover:border-violet-400 bg-white/80 dark:bg-slate-700/80 hover:bg-gradient-to-r hover:from-violet-50 hover:to-pink-50 dark:hover:from-violet-950/30 dark:hover:to-pink-950/30 rounded-2xl py-3 group/button transition-all duration-300" 
                            onClick={() => handleOpenSelector(index)}
                          >
                            <ImagePlus className="mr-2 h-4 w-4 group-hover/button:scale-110 transition-transform duration-300" />
                            <span className="font-medium">Change Image</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </BaseSectionManager>

        <AdvancedMediaSelector
          isOpen={isSelectorOpen}
          onOpenChange={setSelectorOpen}
          onSelect={handleImageSelect}
          mediaType="image"
          title={editingImageIndex !== null ? `Select Image ${editingImageIndex + 1}` : 'Select an Image'}
          selectedValue={selectedImageValue}
        />
      </>
    );
  }
}