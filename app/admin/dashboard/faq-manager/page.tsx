// app/admin/faq-management/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAppDispatch , useAppSelector } from '@/redux/hooks';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Plus, Trash2, RefreshCw, Save, Image as ImageIcon, Sparkles, Images } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
import {AdvancedMediaSelector} from '@/components/admin/AdvancedMediaSelector';
import Image from 'next/image';

const FaqManager = () => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.faq);

  // Local state for the media selector modal
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFaqData());
    }
  }, [status, dispatch]);

  const handleSaveChanges = () => {
    if (data) {
      dispatch(saveFaqData(data));
    }
  };

  const handleOnDragEnd = (result: DropResult) => {

    console.log("result " , result)
    if (!result.destination || !data) return;
    const items = Array.from(data.faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderFaqs(items));
  };
  
  const addNewFaq = () => {
    dispatch(addFaqItem());
  };

  const handleImageSelect = (media: { url: string }) => {
    dispatch(updateMainField({ field: 'backgroundImage', value: media.url }));
    setSelectorOpen(false);
  };
  
  if (status === 'loading' && !data) {
    return <div className="p-8">Loading FAQ Manager...</div>;
  }

  if (status === 'failed' || !data) {
    return <div className="p-8">Could not load data. Try refreshing.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdvancedMediaSelector
        isOpen={isSelectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleImageSelect}
        mediaType="image"
        title="Select Background Image"
        selectedValue={data.backgroundImage}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">FAQ Manager</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className='bg-gray-200' size="icon" onClick={() => dispatch(fetchFaqData())} disabled={status === 'loading'}>
            <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleSaveChanges} className='text-background cursor-pointer' disabled={status === 'loading'}>
            <Save className="h-4 w-4 mr-2" />
            {status === 'loading' ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

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
            <CardHeader><CardTitle>Section Header</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={data.title} onChange={(e) => dispatch(updateMainField({field: 'title', value: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <RichTextEditor value={data.description} onEditorChange={(content) => dispatch(updateMainField({field: 'description', value: content}))} />
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
                      {data.faqs.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4">
                              <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab pt-2">
                                <GripVertical/>
                              </div>
                              <div className='flex-grow space-y-4'>
                                <div className="space-y-2">
                                  <Label>Question</Label>
                                  <Input value={item.question} onChange={(e) => dispatch(updateFaqItem({index, field: 'question', value: e.target.value}))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Answer</Label>
                                  <RichTextEditor value={item.answer} onEditorChange={(content) => dispatch(updateFaqItem({index, field: 'answer', value: content}))} />
                                </div>
                              </div>
                              <div className="pt-2">
                                  <Button variant="destructive" size="icon" onClick={() => dispatch(removeFaqItem(index))}>
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
            <Card>
                <CardHeader><CardTitle>Section Background Image</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full h-64 rounded-lg border border-dashed flex items-center justify-center bg-gray-100 overflow-hidden">
                        {data.backgroundImage ? <Image src={data.backgroundImage} alt="Background Preview" width={500} height={256} className="object-cover" /> : <ImageIcon className="h-16 w-16 text-gray-300"/>}
                    </div>
                    <Button className="w-full" variant="outline" onClick={() => setSelectorOpen(true)}>Select Background Image</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FaqManager;