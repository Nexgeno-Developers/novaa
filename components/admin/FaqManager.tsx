"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2, RefreshCw, Save, Image as ImageIcon, Sparkles, Images } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

import {
  fetchFaqData,
  saveFaqData,
  updateMainField,
  addFaqItem,
  removeFaqItem,
  updateFaqItem,
  reorderFaqs
} from '@/redux/slices/faqslice';

// Shadcn UI and Custom Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import RichTextEditor from '@/components/admin/Editor';
import { AdvancedMediaSelector } from '@/components/admin/AdvancedMediaSelector';
import BaseSectionManager from '@/components/admin/BaseSectionManager';
import Image from 'next/image';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order:number
}

interface FaqData {
  title: string;
  description: string;
  backgroundImage: string;
  faqs: FaqItem[];
}

interface FaqManagerProps {
  section: any; // Required
  onChange: (changes: any) => void; // Required
  showSaveButton?: boolean;
}

const FaqManagerContent = ({
  section,
  onChange,
  showSaveButton = true,
}: {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.faq);

  // Use refs to track initialization state like TestimonialsManager
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Default data structure
  const defaultData: FaqData = {
    title: "",
    description: "",
    backgroundImage: "",
    faqs: []
  };

  // Local state for FAQ data
  const [faqData, setFaqData] = useState<FaqData>(defaultData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local state for the media selector modal
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  // Memoize the onChange callback to prevent infinite re-renders
  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange && userHasInteractedRef.current) {
        onChange(changes);
      }
    },
    [onChange]
  );

  // Initial load - section data only (following TestimonialsManager pattern)
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content;
      setFaqData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    } else if (!section && !isInitializedRef.current) {
      // Fallback for standalone mode
      if (data) {
        setFaqData(data);
      } else {
        setFaqData(defaultData);
      }
      isInitializedRef.current = true;
    }
  }, [section, data]);

  // Load Redux data only in standalone mode
  useEffect(() => {
    if (!section && status === 'idle') {
      dispatch(fetchFaqData());
    }
  }, [dispatch, section, status]);

  // Notify parent only if user interacted (following TestimonialsManager pattern)
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: faqData });
      setHasUnsavedChanges(true);
    }
  }, [faqData]);

  // Handle Redux state updates for standalone mode
  useEffect(() => {
    if (!section && data && !initialDataSetRef.current) {
      setFaqData(data);
      initialDataSetRef.current = true;
    }
  }, [data, section]);

  // Memoize update functions to prevent unnecessary re-renders
  const updateFaqData = useCallback(
    (updates: Partial<FaqData>) => {
      userHasInteractedRef.current = true;
      setFaqData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleMainFieldUpdate = useCallback(
    (field: keyof FaqData, value: string) => {
      userHasInteractedRef.current = true;
      setFaqData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveChanges = async () => {
    try {
      if (section) {
        // Global mode - no direct save, just notify parent
        toast.success("Changes saved to page!");
        setHasUnsavedChanges(false);
      } else {
        // Standalone mode - use Redux
        await dispatch(saveFaqData(faqData)).unwrap();
        toast.success("FAQ data saved successfully!");
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error saving FAQ data:", error);
      toast.error("Failed to save FAQ data");
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(faqData.faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    userHasInteractedRef.current = true;
    setFaqData(prev => ({ ...prev, faqs: items }));
    
    if (!section) {
      // Only dispatch to Redux in standalone mode
      dispatch(reorderFaqs(items));
    }
  };
  
  const addNewFaq = () => {
    const newFaq: FaqItem = {
      _id: uuidv4(),
      question: "",
      answer: "",
      order: 0
    };
    
    userHasInteractedRef.current = true;
    setFaqData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
    
    if (!section) {
      // Only dispatch to Redux in standalone mode
      dispatch(addFaqItem());
    }
  };

  const handleRemoveFaq = (index: number) => {
    userHasInteractedRef.current = true;
    setFaqData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
    
    if (!section) {
      // Only dispatch to Redux in standalone mode
      dispatch(removeFaqItem(index));
    }
  };

  const handleUpdateFaqItem = (index: number, field: "question" | "answer", value: string) => {
    userHasInteractedRef.current = true;
    setFaqData(prev => ({
      ...prev,
      faqs: prev.faqs.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    
    if (!section) {
      // Only dispatch to Redux in standalone mode
      dispatch(updateFaqItem({ index, field, value }));
    }
  };

  const handleRefresh = () => {
    if (!section) {
      dispatch(fetchFaqData());
    }
    userHasInteractedRef.current = false;
    initialDataSetRef.current = false;
    setHasUnsavedChanges(false);
  };

  const handleImageSelect = (media: { url: string }) => {
    handleMainFieldUpdate('backgroundImage', media.url);
    setSelectorOpen(false);
  };
  
  if (status === 'loading' && !section && !faqData) {
    return <div className="p-8">Loading FAQ Manager...</div>;
  }

  if (status === 'failed' && !section) {
    return <div className="p-8">Could not load data. Try refreshing.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header - only show in standalone mode */}
      {showSaveButton && !section && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">FAQ Manager</h1>
            {hasUnsavedChanges && (
              <p className="text-sm text-orange-600 mt-1">
                You have unsaved changes
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className='bg-gray-200 cursor-pointer' 
              size="sm" 
              onClick={handleRefresh} 
              disabled={status === 'loading'}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              className='text-background cursor-pointer' 
              disabled={status === 'loading'}
            >
              <Save className="h-4 w-4 mr-2" />
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
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
            value="image"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Images className="w-4 h-4" />
            <span className="font-medium">Background Image</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Section Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={faqData.title} 
                  onChange={(e) => handleMainFieldUpdate('title', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <RichTextEditor 
                  value={faqData.description} 
                  onEditorChange={(content) => handleMainFieldUpdate('description', content)} 
                  id="faq-description"
                />
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-8" />

          <Card className='py-6'>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>FAQ Items</CardTitle>
              <Button variant="outline" size="sm" onClick={addNewFaq}>
                <Plus className="h-4 w-4 mr-2"/>
                Add FAQ
              </Button>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="faqs">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {faqData.faqs.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4"
                            >
                              <div 
                                {...provided.dragHandleProps} 
                                className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"
                              >
                                <GripVertical/>
                              </div>
                              <div className='flex-grow space-y-4'>
                                <div className="space-y-2">
                                  <Label>Question</Label>
                                  <Input 
                                    value={item.question} 
                                    onChange={(e) => handleUpdateFaqItem(index, 'question', e.target.value)} 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Answer</Label>
                                  <RichTextEditor 
                                    value={item.answer} 
                                    onEditorChange={(content) => handleUpdateFaqItem(index, 'answer', content)} 
                                    id={`faq-answer-${item._id}`}
                                  />
                                </div>
                              </div>
                              <div className="pt-2">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="cursor-pointer"
                                  onClick={() => handleRemoveFaq(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
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
        
        <TabsContent value="image" className="mt-4">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Section Background Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-64 rounded-lg border border-dashed flex items-center justify-center bg-gray-100 overflow-hidden">
                {faqData.backgroundImage ? (
                  <Image 
                    src={faqData.backgroundImage} 
                    alt="Background Preview" 
                    width={500} 
                    height={256} 
                    className="object-cover" 
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-300"/>
                )}
              </div>
              <Button 
                className="w-full cursor-pointer" 
                variant="outline" 
                onClick={() => setSelectorOpen(true)}
              >
                Select Background Image
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Advanced Media Selector */}
      <AdvancedMediaSelector
        isOpen={isSelectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleImageSelect}
        mediaType="image"
        title="Select Background Image"
        selectedValue={faqData.backgroundImage}
      />
    </div>
  );
};

// Main component - Global save mode only
export default function FaqManager({
  section,
  onChange,
  showSaveButton = false,
}: FaqManagerProps) {
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
      title="FAQ Section"
      description="Manage frequently asked questions"
    >
      <FaqManagerContent 
        section={section}
        onChange={onChange}
        showSaveButton={false} 
      />
    </BaseSectionManager>
  );
};