
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, Eye, Settings, AlertCircle, ArrowRight, ArrowBigRightDash, ArrowRightToLine, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  fetchSection,
  updateSection,
  selectCurrentSection,
  selectSectionLoading,
  clearCurrentSection,
} from '@/redux/slices/pageSlice';
import type { AppDispatch } from '@/redux';

// Import section-specific managers
import NavbarManager from '@/components/admin/NavbarManager';
import HeroManager from '@/components/admin/HomePageManager';
import AboutManager from '@/components/admin/AboutManager';
import PropertiesManager from '@/components/admin/PhuketPropertiesManager';
import WhyInvestManager from '@/components/admin/WhyInvestManager';
import TestimonialsManager from '@/components/admin/TestimonialsManager';
import AdvantageManager from '@/components/admin/AdvantageManager';
import FaqManager from '@/components/admin/FaqManager';
import InvestorInsightsManager from '@/components/admin/InvestorInsightsManager'
// import DefaultSectionManager from './section-managers/DefaultSectionManager';

export default function SectionManager() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const pageSlug = params?.slug as string;
  const sectionSlug = params?.section as string;

  const currentSection = useSelector(selectCurrentSection);
  const loading = useSelector(selectSectionLoading);

  const [isEnabled, setIsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (pageSlug && sectionSlug) {
      dispatch(fetchSection({ pageSlug, sectionSlug }));
    }

    return () => {
      dispatch(clearCurrentSection());
    };
  }, [dispatch, pageSlug, sectionSlug]);

  useEffect(() => {
    if (currentSection) {
      setIsEnabled(currentSection.settings.isVisible);
    }
  }, [currentSection]);

  const handleSave = async () => {
    if (!currentSection) return;

    setIsSaving(true);
    try {
      const updateData = {
        ...currentSection,
        settings: {
          ...currentSection.settings,
          isVisible: isEnabled,
        },
      };

      await dispatch(updateSection({
        pageSlug,
        sectionSlug,
        data: updateData
      })).unwrap();

      setHasUnsavedChanges(false);
      toast.success('Section updated successfully');
    } catch (error) {
      toast.error('Failed to update section');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionUpdate = (updatedSection: any) => {
    setHasUnsavedChanges(true);
    // The actual update will be handled by the specific section manager
  };

  const pageTitle = pageSlug?.charAt(0).toUpperCase() + pageSlug?.slice(1).replace('-', ' ') || 'Page';
  const sectionTitle = currentSection?.name || sectionSlug?.charAt(0).toUpperCase() + sectionSlug?.slice(1).replace('-', ' ') || 'Section';

  const getSectionIcon = (type?: string) => {
    const icons = {
      navbar: "🧭",
      hero: "🎯",
      about: "ℹ️",
      services: "⚙️",
      properties: "🏠",
      testimonials: "💬",
      faq: "❓",
      footer: "📄",
      contact: "📞",
      "why-invest": "📈",
      "investor-insights": "💡",
    };
    return icons[type as keyof typeof icons] || "📄";
  };

  const renderSectionManager = () => {
    if (!currentSection) return null;

    switch (currentSection.type) {
      case 'navbar':
        return <NavbarManager />;
      case 'hero':
        return <HeroManager />;
      case 'about':
        return <AboutManager />;
      case 'properties' : 
        return <PropertiesManager />;
      case 'why-invest':
        return <WhyInvestManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'faq':
        return <FaqManager />;
      case 'investor-insights':
        return <InvestorInsightsManager />;
      case 'advantages':
        return <AdvantageManager /> 
      // default:
      //   return <DefaultSectionManager section={currentSection} onUpdate={handleSectionUpdate} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading section...</span>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/pages/${pageSlug}`}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {pageTitle}
          </Link>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Section not found. The section may have been deleted or the URL is incorrect.
          </AlertDescription>
        </Alert>

        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link
          href="/admin/pages"
          className="text-muted-foreground hover:text-background transition-colors"
        >
          Pages
        </Link>
        <span className="text-muted-foreground"><ChevronRight /></span>
        <Link
          href={`/admin/pages/${pageSlug}`}
          className="text-muted-foreground hover:text-background transition-colors"
        >
          {pageTitle}
        </Link>
        <span className="text-muted-foreground"><ChevronRight /></span>
        <span className="text-background font-medium flex items-center">
          <span className="mr-2">{getSectionIcon(currentSection.type)}</span>
          {sectionTitle}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Link
              href={`/admin/pages/${pageSlug}`}
              className="flex items-center text-background hover:text-background/90 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to {pageTitle}
            </Link>
          </div>
          {/* <div className="flex items-center space-x-3 pt-6">
            <span className="text-2xl">{getSectionIcon(currentSection.type)}</span>
            <div>
              <h1 className="text-2xl font-bold">{sectionTitle}</h1>
              <p className="text-muted-foreground">
                Manage the {currentSection.type.replace('-', ' ')} section
              </p>
            </div>
            
          </div> */}
        </div>
        <div className="flex items-center space-x-2">

          <Badge variant="outline" className='text-background cursor-pointer'>
            Order: {currentSection.order}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Panel - Only show for non-navbar sections */}
        {currentSection.type !== 'navbar' && (
          <div>
            {/* <Card className='py-6'>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Section Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="section-enabled">Visible</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this section on the website
                    </p>
                  </div>
                  <Switch
                    id="section-enabled"
                    checked={isEnabled}
                    onCheckedChange={(checked) => {
                      setIsEnabled(checked);
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Section Status</Label>
                  <Badge className='text-background' variant={currentSection.status === 'active' ? "default" : "secondary"}>
                    {currentSection.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Section Type</Label>
                  <Badge variant="outline" className="capitalize text-background">
                    {currentSection.type.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label>Last Modified</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(currentSection.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </CardContent>
            </Card> */}

          {/* <Card className="mt-4 py-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-gray-200 cursor-pointer text-background">
                <Eye className="h-4 w-4 mr-2" />
                Preview Changes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-primary text-background hover:bg-primary/80 cursor-pointer"
                onClick={() => {
                  // Reset to original values
                  if (currentSection) {
                    setIsEnabled(currentSection.settings.isVisible);
                    setHasUnsavedChanges(false);
                    toast.info('Changes reverted');
                  }
                }}
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Revert Changes
              </Button>
            </CardContent>
          </Card> */}
        </div>)}

        {/* Content Editor */}
        <div className="lg:col-span-4">
          {renderSectionManager()}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You have unsaved changes. Don't forget to save your work!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}