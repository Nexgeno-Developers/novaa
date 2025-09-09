"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  Save,
  RefreshCw,
  ArrowUpDown,
  Plus,
  Settings,
  Eye,
  EyeOff,
  AlertCircle,
  Undo2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  fetchPageSections,
  updateSectionsOrder,
  selectSections,
  selectSectionsLoading,
  selectError,
  clearError,
  updateSections,
} from "@/redux/slices/pageSlice";
import type { AppDispatch, RootState } from "@/redux";
import type { Section } from "@/redux/slices/pageSlice";

// Import your section managers
import AboutManager from "@/components/admin/AboutManager";
import FaqManager from "@/components/admin/FaqManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import WhyInvestManager from "@/components/admin/WhyInvestManager";
import InvestorInsightsManager from "@/components/admin/InvestorInsightsManager";
import PhuketPropertiesManager from "@/components/admin/PhuketPropertiesManager";
import HomePageManager from "@/components/admin/HomePageManager";
import NovaaAdvantageManager from "@/components/admin/AdvantageManager";
import CuratedCollectionManager from "@/components/admin/CuratedCollectionManager";
import BreadcrumbManager from "@/components/admin/BreadcrumbManager";
import OurStoryManager from "@/components/admin/OurStoryManager";
import ContactManager from "@/components/admin/ContactManager";
import BlogSectionManager from "@/components/admin/BlogSectionManager";

interface PageSectionsProps {
  pageSlug: string;
}

interface SectionChanges {
  [sectionId: string]: any;
}

const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
  // Home Page Managers
  hero: HomePageManager,
  about: AboutManager,
  collection: CuratedCollectionManager,
  "phuket-properties": PhuketPropertiesManager,
  "why-invest": WhyInvestManager,
  advantage: NovaaAdvantageManager,
  faq: FaqManager,
  testimonials: TestimonialsManager,
  insights: InvestorInsightsManager,

  // About US Manager
  breadcrumb: BreadcrumbManager,
  "our-story": OurStoryManager,

  // Contact Us Manager
  contact: ContactManager,

  // Blog Manager
  blog: BlogSectionManager, // You'll need to create this component
};

export default function PageSections({ pageSlug }: PageSectionsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const sections = useSelector(selectSections);
  const loading = useSelector(selectSectionsLoading);
  const error = useSelector(selectError);

  const [hasChanges, setHasChanges] = useState(false);
  const [sectionChanges, setSectionChanges] = useState<SectionChanges>({});
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [originalSections, setOriginalSections] = useState<Section[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [sectionsInitialized, setSectionsInitialized] = useState(false); // Track if sections are fully loaded

  // Show floating button after scrolling
  useEffect(() => {
    const toggleVisibility = () => {
      const mainContainer = document.querySelector("main");
      const scrollTop = mainContainer
        ? mainContainer.scrollTop
        : window.pageYOffset;

      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const mainContainer = document.querySelector("main");
    const scrollElement = mainContainer || window;

    scrollElement.addEventListener("scroll", toggleVisibility);
    return () => scrollElement.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Load sections on mount
  useEffect(() => {
    if (pageSlug) {
      dispatch(fetchPageSections(pageSlug));
    }
  }, [dispatch, pageSlug]);

  // Store original sections for discard functionality and mark as initialized
  useEffect(() => {
    if (sections.length > 0 && !sectionsInitialized) {
      setOriginalSections(JSON.parse(JSON.stringify(sections)));
      setSectionsInitialized(true);
      // Reset any false positive changes on initial load
      setHasChanges(false);
      setSectionChanges({});
    }
  }, [sections, sectionsInitialized]);

  // Handle section changes - only after sections are initialized
  const handleSectionChange = useCallback(
    (sectionId: string, changes: any) => {
      // Only track changes after sections are fully initialized
      if (!sectionsInitialized) {
        return;
      }

      setSectionChanges((prev) => {
        const newChanges = {
          ...prev,
          [sectionId]: { ...prev[sectionId], ...changes },
        };

        // Only set hasChanges to true if there are actually changes
        const hasActualChanges = Object.keys(newChanges).length > 0;
        setHasChanges(hasActualChanges);

        return newChanges;
      });
    },
    [sectionsInitialized]
  );

  // Global save functionality
  // const handleGlobalSave = async () => {
  //   if (!hasChanges || Object.keys(sectionChanges).length === 0) {
  //     toast.info("No changes to save");
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     // Save each modified section
  //     const savePromises = Object.entries(sectionChanges).map(
  //       async ([sectionId, changes]) => {
  //         const section = sections.find((s) => s._id === sectionId);
  //         if (!section) return null;

  //         const response = await fetch(
  //           `/api/cms/sections/${encodeURIComponent(
  //             pageSlug
  //           )}/${encodeURIComponent(section.slug)}`,
  //           {
  //             method: "PUT",
  //             headers: { "Content-Type": "application/json" },
  //             credentials: "include",
  //             body: JSON.stringify(changes),
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error(`Failed to save ${section.name}`);
  //         }

  //         return response.json();
  //       }
  //     );

  //     await Promise.all(savePromises);

  //     // Reset changes state
  //     setSectionChanges({});
  //     setHasChanges(false);
  //     setOriginalSections(JSON.parse(JSON.stringify(sections)));

  //     toast.success("All changes saved successfully!");

  //     // Refresh sections
  //     dispatch(fetchPageSections(pageSlug));
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     toast.error("Failed to save changes");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handleGlobalSave = async () => {
  if (!hasChanges || Object.keys(sectionChanges).length === 0) {
    toast.info("No changes to save");
    return;
  }

  setIsSaving(true);

  try {
    // Save each modified section
    const savePromises = Object.entries(sectionChanges).map(
      async ([sectionId, changes]) => {
        const section = sections.find((s) => s._id === sectionId);
        if (!section) return null;

        const response = await fetch(
          `/api/cms/sections/${encodeURIComponent(
            pageSlug
          )}/${encodeURIComponent(section.slug)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(changes),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to save ${section.name}`);
        }

        return response.json();
      }
    );

    await Promise.all(savePromises);

    // IMPORTANT: Reset changes state BEFORE refreshing
    // This prevents child components from losing data during refresh
    setSectionChanges({});
    setHasChanges(false);
    
    toast.success("All changes saved successfully!");

    // Refresh sections AFTER resetting state
    await dispatch(fetchPageSections(pageSlug));
    
    // Update original sections for discard functionality
    setTimeout(() => {
      setOriginalSections(JSON.parse(JSON.stringify(sections)));
    }, 100); // Small delay to ensure sections are updated

  } catch (error) {
    console.error("Save error:", error);
    toast.error("Failed to save changes");
  } finally {
    setIsSaving(false);
  }
};

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchPageSections(pageSlug));
      setSectionChanges({});
      setHasChanges(false);
      setSectionsInitialized(false); // Reset initialization flag
      toast.success("Page refreshed successfully!");
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Failed to refresh page");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Discard changes functionality
  const handleDiscardChanges = () => {
    setSectionChanges({});
    setHasChanges(false);
    dispatch(updateSections(originalSections));
    toast.success("Changes discarded successfully!");
  };

  // Save section order
  const handleSaveOrder = async () => {
    try {
      await dispatch(updateSectionsOrder(sections));
      setIsOrderModalOpen(false);
      toast.success("Section order updated successfully!");
    } catch (error) {
      console.error("Order save error:", error);
      toast.error("Failed to update section order");
    }
  };

  // Render section manager
  const renderSectionManager = (section: Section) => {
    const SectionComponent =
      sectionComponentMap[section.type] || sectionComponentMap[section.slug];

    if (!SectionComponent) {
      return (
        <div className="p-4 bg-gray-50 rounded border border-dashed border-gray-300">
          <div className="flex items-center justify-center text-gray-500">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            
           {section.name === "Project Content" ? <span>You can manage {section.name} from Project Management </span> :  <span>Manager for {section.name} coming soon...</span>}
          </div>
        </div>
      );
    }

    return (
      <SectionComponent
        section={section}
        onChange={(changes: any) => handleSectionChange(section._id, changes)}
        showSaveButton={false} // Hide individual save buttons
      />
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="py-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md py-6">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Sections
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => dispatch(clearError())} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize text-primary">
            {pageSlug.replace(/-/g, " ")} Page Management
          </h1>
          <p className="text-muted-foreground">
            Manage all sections for the {pageSlug} page.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Only show discard button if there are actual changes */}
          {hasChanges && Object.keys(sectionChanges).length > 0 && (
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Undo2 className="h-4 w-4 mr-2" />
              Discard Changes
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="bg-primary/90 text-gray-100 hover:bg-primary/80 cursor-pointer"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            className="bg-primary/90 text-gray-100 hover:bg-primary/80 cursor-pointer"
            onClick={() => setIsOrderModalOpen(true)}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Change Order
          </Button>
        </div>
      </div>

      {/* Change Indicator - only show if there are actual changes */}
      {hasChanges && Object.keys(sectionChanges).length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800">
              You have unsaved changes. Don't forget to save your work!
            </span>
          </div>
        </div>
      )}

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="py-6">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No sections found</h3>
              <p className="text-sm">
                This page doesn't have any sections configured yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section._id} className="overflow-hidden py-6">
              <CardContent className="pt-0">
                {renderSectionManager(section)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Save Button - only show if there are actual changes */}
      {(hasChanges && Object.keys(sectionChanges).length > 0) || isVisible ? (
        <div className="fixed bottom-6 right-18 z-50">
          <div className="flex flex-col space-y-2">
            {/* Unsaved changes indicator */}
            {hasChanges && Object.keys(sectionChanges).length > 0 && (
              <div className="bg-background text-primary text-xs px-2 py-1 rounded-full text-center shadow-lg animate-pulse">
                Unsaved changes
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleGlobalSave}
              disabled={
                !hasChanges ||
                Object.keys(sectionChanges).length === 0 ||
                isSaving
              }
              size="lg"
              className={`
                shadow-lg hover:shadow-xl transition-all duration-200 
                ${
                  hasChanges && Object.keys(sectionChanges).length > 0
                    ? "bg-primary text-background cursor-pointer"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }
                ${isSaving ? "animate-pulse" : "hover:scale-105"}
                 h-10 px-10
              `}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save All
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Change Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-lg admin-theme">
          <DialogHeader>
            <DialogTitle>Change Section Order</DialogTitle>
            <DialogDescription>
              Drag and drop to reorder the sections on your page.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[500px]">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;

                const oldIndex = sections.findIndex((s) => s._id === active.id);
                const newIndex = sections.findIndex((s) => s._id === over.id);

                const reordered = [...sections];
                const [moved] = reordered.splice(oldIndex, 1);
                reordered.splice(newIndex, 0, moved);

                // Update order field
                const updated = reordered.map((section, i) => ({
                  ...section,
                  order: i + 1,
                }));

                dispatch(updateSections(updated));
                setHasChanges(true);
              }}
            >
              <SortableContext
                items={sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 p-1">
                  {sections.map((section, index) => (
                    <SortableItem
                      key={section._id}
                      section={section}
                      index={index}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOrderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveOrder} disabled={!hasChanges}>
              Save Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableItem({ section, index }: { section: Section; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex items-center p-3 border rounded-lg bg-white shadow-sm cursor-grab active:cursor-grabbing"
    >
      <span className="text-sm font-medium text-muted-foreground min-w-[20px] mr-3">
        {index + 1}.
      </span>

      <div className="flex items-center justify-between flex-1">
        <div className="flex flex-col">
          <span className="font-medium text-sm">{section.name}</span>
          <span className="text-xs text-muted-foreground">{section.slug}</span>
        </div>

        <Badge
          variant={section.status === "active" ? "default" : "secondary"}
          className="text-xs flex items-center space-x-1"
        >
          {section.settings.isVisible ? (
            <Eye className="h-2.5 w-2.5" />
          ) : (
            <EyeOff className="h-2.5 w-2.5" />
          )}
          <span>{section.type}</span>
        </Badge>
      </div>
    </div>
  );
}
