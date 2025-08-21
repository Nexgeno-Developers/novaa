"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { AppDispatch, RootState } from '@/redux'; // Assuming store is the correct path
import { fetchWhyInvestData, updateWhyInvestData } from '@/redux/slices/whyInvestSlice';
import { MediaItem } from '@/redux/slices/mediaSlice';
import RichTextEditor from '@/components/admin/Editor';
import { AdvancedMediaSelector } from '@/components/admin/AdvancedMediaSelector'; // Using your new component
import Image from 'next/image';

// ShadCN UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';``
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Trash2, PlusCircle, ImagePlus, Save, Sparkles, Target, Images } from 'lucide-react';

type FormData = {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  investmentPoints: {
    icon: string;
    title: string;
    description: string;
  }[];
  images: string[];
};

export default function WhyInvestManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.whyInvest);

  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    defaultValues: {
      mainTitle: '',
      highlightedTitle: '',
      description: '',
      investmentPoints: [],
      images: ['', '', '', ''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'investmentPoints',
  });

  // Fetch initial data and reset the form
  useEffect(() => {
    dispatch(fetchWhyInvestData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleOpenSelector = (index: number) => {
    setEditingImageIndex(index);
    setSelectorOpen(true);
  };

  const handleImageSelect = (media: MediaItem) => {
    if (editingImageIndex !== null) {
      setValue(`images.${editingImageIndex}`, media.secure_url, { shouldDirty: true });
    }
    setEditingImageIndex(null);
    // The AdvancedMediaSelector will close itself via onOpenChange
  };
  
  const onSubmit = (formData: FormData) => {
    dispatch(updateWhyInvestData(formData));
  };
  
  if (status === 'loading' && !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-600/20 animate-pulse mx-auto"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Loading Content</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Preparing your management interface...</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedImageValue = editingImageIndex !== null ? watch(`images.${editingImageIndex}`) : undefined;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
        <div className="container">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 relative space-y-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Why Invest Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Configure your investment proposition content
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleSubmit(onSubmit)} 
              disabled={status === 'loading'}
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {status === 'loading' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Save className="mr-2 h-5 w-5" />
              )}
              <span className="font-semibold">Save Changes</span>
            </Button>
          </div>
          
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                          {...register('mainTitle')} 
                          className="border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300 px-4 py-3"
                          placeholder="Enter main title..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="highlightedTitle" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Highlighted Title</Label>
                        <Input 
                          id="highlightedTitle" 
                          {...register('highlightedTitle')} 
                          className="border-2 border-slate-200/60 dark:border-slate-600/60 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm focus:border-purple-500 focus:bg-white dark:focus:bg-slate-700 transition-all duration-300 px-4 py-3"
                          placeholder="Enter highlighted title..."
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
                      <div className="rounded-xl overflow-hidden border-2 border-slate-200/60 dark:border-slate-600/60 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm">
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <RichTextEditor
                              value={field.value}
                              onEditorChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Points Card */}
                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative bg-gradient-to-r from-slate-50 to-emerald-50/50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3 text-xl text-slate-800 dark:text-slate-100">
                        <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-blue-600 rounded-full"></div>
                        <span>Investment Points</span>
                      </CardTitle>
                      <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                        {fields.length} Points
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-6 p-8">
                    <div className="grid gap-6">
                      {fields.map((field, index) => (
                        <div 
                          key={field.id} 
                          className="group/point relative p-6 border-2 border-slate-200/60 dark:border-slate-600/60 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-700/80 dark:to-slate-800/80 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                          
                          <div className="relative space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-lg flex items-center space-x-2 text-slate-800 dark:text-slate-100">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span>Investment Point {index + 1}</span>
                              </h4>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="opacity-0 group-hover/point:opacity-100 transition-all duration-300 bg-red-500 hover:bg-red-600 shadow-lg rounded-xl"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Icon URL</Label>
                                <Input 
                                  {...register(`investmentPoints.${index}.icon`)} 
                                  className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 focus:border-blue-500 transition-all duration-300"
                                  placeholder="/icons/example.svg"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</Label>
                                <Input 
                                  {...register(`investmentPoints.${index}.title`)} 
                                  className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 focus:border-purple-500 transition-all duration-300"
                                  placeholder="Point title..."
                                />
                              </div>
                              <div className="space-y-2 md:col-span-1">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</Label>
                                <Textarea 
                                  {...register(`investmentPoints.${index}.description`)} 
                                  className="border border-slate-200 dark:border-slate-600 rounded-xl bg-white/80 dark:bg-slate-700/80 focus:border-emerald-500 transition-all duration-300 min-h-[80px]"
                                  placeholder="Describe this investment point..."
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append({ icon: '/icons/capital.svg', title: '', description: '' })}
                      className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gradient-to-r from-white/50 to-slate-50/50 dark:from-slate-700/50 dark:to-slate-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-2xl py-6 group transition-all duration-300"
                    >
                      <PlusCircle className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" /> 
                      <span className="font-semibold">Add New Investment Point</span>
                    </Button>
                  </CardContent>
                </Card>
              </form>
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
                          <Controller
                            name={`images.${index}`}
                            control={control}
                            render={({ field }) => (
                              field.value ? (
                                <div className="relative w-full h-full group">
                                  <Image 
                                    src={field.value} 
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
                              )
                            )}
                          />
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
      </div>

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