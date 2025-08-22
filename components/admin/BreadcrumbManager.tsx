// app/admin/breadcrumb-management/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux';
import { fetchBreadcrumbData, updateBreadcrumbData } from '@/redux/slices/breadcrumbSlice';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {toast} from 'sonner'

// Custom Components
import MediaSelectButton from '@/components/admin/MediaSelectButton';
import Editor from '@/components/admin/Editor';
import { Images, Loader2, Sparkles } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

  const manageablePages = [
  { slug: 'about-us', label: 'About Us' },
  { slug: 'contact-us', label: 'Contact Us' },
  { slug: 'project', label: 'Project' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'blog-detail', label: 'Blog Detail' },
  // Add more pages here
];

const BreadcrumbManagerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.breadcrumb);

  // State to track which page is being edited
  const [selectedSlug, setSelectedSlug] = useState(manageablePages[0].slug);

  // Local state to manage form changes before saving
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    backgroundImageUrl: '',
  });

  // Fetch initial data on component mount
   useEffect(() => {
    if (selectedSlug) {
      dispatch(fetchBreadcrumbData(selectedSlug));
    }
  }, [dispatch, selectedSlug]);

  // When Redux data is loaded, populate the local form state
  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        description: data.description,
        backgroundImageUrl: data.backgroundImageUrl,
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleMediaSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, backgroundImageUrl: url }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateBreadcrumbData({ slug: selectedSlug, data: formData })).unwrap();
      toast.success("Breadcrumb settings have been updated")
    } catch (error) {
      toast.error("Failed to update settings. Please try again.")
    }
  };

 if (status === 'loading' && (!data || data?.pageSlug !== selectedSlug)) {
      return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Breadcrumb Manager</h1>
          <p className="text-muted-foreground">Manage the global breadcrumb section shown on top of pages.</p>
        </div>
        <Button onClick={handleSubmit} disabled={status === 'loading'} className='bg-primary text-background cursor-pointer'>
          {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>

      <Card className='py-6'>
        <CardHeader>
          <CardTitle>Select Page to Edit</CardTitle>
          <CardDescription>Choose which page's breadcrumb you want to configure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {manageablePages.map(page => (
                <SelectItem key={page.slug} value={page.slug}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="w-full">
         <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
          <TabsTrigger
            value="content"
            className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Content</span>
          </TabsTrigger>
          <TabsTrigger
            value="background"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Images className="w-4 h-4" />
            <span className="font-medium">Background Image</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Section Content</CardTitle>
              <CardDescription>Update the title and description for the breadcrumb section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., About Our Company"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Editor
                  value={formData.description}
                  onEditorChange={handleEditorChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Background Image</CardTitle>
              <CardDescription>Select a new background image for the section from your media library.</CardDescription>
            </CardHeader>
            <CardContent>
              <MediaSelectButton
                label="Section Background"
                mediaType="image"
                value={formData.backgroundImageUrl}
                onSelect={handleMediaSelect}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BreadcrumbManagerPage;