"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux';
import { fetchFooterData, updateFooterData, FooterData } from '@/redux/slices/footerSlice';
import { Book, Copyright, Images, Loader2, Sparkles } from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

// Custom Components
import MediaSelectButton from '@/components/admin/MediaSelectButton';
import Editor from '@/components/admin/Editor';
import {toast} from 'sonner';

const FooterManagerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.footer);

  const [formData, setFormData] = useState<FooterData | null>(null);

  useEffect(() => {
    dispatch(fetchFooterData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Handle nested object updates
   const handleNestedInputChange = <T extends keyof FooterData>(
    section: T,
    field: keyof FooterData[T],
    value: string
  ) => {
    setFormData(prev => {
      if (!prev) return null;
      const currentSection = prev[section];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  // Handle simple input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // Handle CTA button lines array
  const handleCtaButtonChange = (value: string) => {
    const lines = value.split('\n').filter(line => line.trim());
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, ctaButtonLines: lines };
    });
  };

  // Handle quick links changes
  const handleQuickLinkChange = (index: number, field: 'label' | 'url', value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedLinks = [...prev.quickLinks.links];
      updatedLinks[index][field] = value;
      return {
        ...prev,
        quickLinks: {
          ...prev.quickLinks,
          links: updatedLinks
        }
      };
    });
  };
  
  // Handle social links changes
  const handleSocialLinkChange = (index: number, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedLinks = [...prev.socials.links];
      updatedLinks[index].url = value;
      return {
        ...prev,
        socials: {
          ...prev.socials,
          links: updatedLinks
        }
      };
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      await dispatch(updateFooterData(formData)).unwrap();
      toast.success("Footer has been updated.")
    } catch (error) {
      toast.error("Failed to update footer.");
    }
  };

  if (!formData || (status === 'loading' && !data)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Footer Manager</h1>
        <Button onClick={handleSubmit} disabled={status === 'loading'} className='text-background cursor-pointer'>
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="tagline">

        <TabsList className="grid w-full h-15 grid-cols-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
          <TabsTrigger
            value="tagline"
            className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Tagline</span>
          </TabsTrigger>
          <TabsTrigger
            value="backgrounds"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Images className="w-4 h-4" />
            <span className="font-medium">Backgrounds</span>
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Book className="w-4 h-4" />
            <span className="font-medium">Content Columns</span>
          </TabsTrigger>
          <TabsTrigger
            value="copyright"
            className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
          >
            <Copyright className="w-4 h-4" />
            <span className="font-medium">Copyright</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tagline">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Footer Tagline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input 
                  value={formData.tagline.title} 
                  onChange={e => handleNestedInputChange('tagline', 'title', e.target.value)} 
                  placeholder="Title" 
                />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input 
                  value={formData.tagline.subtitle} 
                  onChange={e => handleNestedInputChange('tagline', 'subtitle', e.target.value)} 
                  placeholder="Subtitle" 
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={formData.tagline.description} 
                  onChange={e => handleNestedInputChange('tagline', 'description', e.target.value)} 
                  placeholder="Description" 
                />
              </div>
              <div>
                <Label>CTA Button Lines (one per line)</Label>
                <Textarea 
                  value={formData.ctaButtonLines.join('\n')} 
                  onChange={e => handleCtaButtonChange(e.target.value)} 
                  placeholder="Explore&#10;Your Future&#10;Home" 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backgrounds">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Background Images</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MediaSelectButton 
              key={"bg-image-one"}
                label="Background Image 1 (Top-Left)" 
                mediaType="image" 
                value={formData.bgImageOne} 
                onSelect={url => setFormData({...formData, bgImageOne: url})} 
              />
              <MediaSelectButton 
              key={"bg-image-two"}
                label="Background Image 2 (Middle)" 
                mediaType="image" 
                value={formData.bgImageTwo} 
                onSelect={url => setFormData({...formData, bgImageTwo: url})} 
              />
              <MediaSelectButton 
              key={"bg-image-three"}
                label="Background Image 3 (Bottom-Right)" 
                mediaType="image" 
                value={formData.bgImageThree} 
                onSelect={url => setFormData({...formData, bgImageThree: url})} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About Us */}
            <Card className='py-6'>
              <CardHeader>
                <CardTitle>About Us Column</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input 
                    value={formData.about.title} 
                    onChange={e => handleNestedInputChange('about', 'title', e.target.value)} 
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Editor 
                    value={formData.about.description} 
                    onEditorChange={content => handleNestedInputChange('about', 'description', content)} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className='py-6'>
              <CardHeader>
                <CardTitle>Quick Links Column</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input 
                    value={formData.quickLinks.title} 
                    onChange={e => handleNestedInputChange('quickLinks', 'title', e.target.value)} 
                    placeholder="Quick Links"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Links</Label>
                  {formData.quickLinks.links.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        value={link.label} 
                        onChange={e => handleQuickLinkChange(index, 'label', e.target.value)} 
                        placeholder="Label" 
                      />
                      <Input 
                        value={link.url} 
                        onChange={e => handleQuickLinkChange(index, 'url', e.target.value)} 
                        placeholder="URL (e.g., /about-us)" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact & Socials */}
            <Card className='py-6'>
              <CardHeader>
                <CardTitle>Contact Column</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Contact Phone</Label>
                  <Input 
                    value={formData.contact.phone} 
                    onChange={e => handleNestedInputChange('contact', 'phone', e.target.value)} 
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input 
                    value={formData.contact.email} 
                    onChange={e => handleNestedInputChange('contact', 'email', e.target.value)} 
                    placeholder="Email Address"
                  />
                </div>
                <div>
                  <Label>Social Media Section Title</Label>
                  <Input 
                    value={formData.socials.title} 
                    onChange={e => handleNestedInputChange('socials', 'title', e.target.value)} 
                    placeholder="Follow on"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  {formData.socials.links.map((link, index) => (
                    <div key={link.name} className="space-y-1">
                      <Label className="capitalize">{link.name}</Label>
                      <Input 
                        value={link.url} 
                        onChange={e => handleSocialLinkChange(index, e.target.value)} 
                        placeholder={`${link.name} URL`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="copyright">
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Copyright Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                name="copyrightText" 
                value={formData.copyrightText} 
                onChange={handleInputChange} 
                placeholder="Copyright text with HTML allowed"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FooterManagerPage;