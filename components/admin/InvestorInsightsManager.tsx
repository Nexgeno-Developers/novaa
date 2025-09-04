"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux";
import {
  fetchInvestorInsights,
  updateInvestorInsightsContent,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  clearError,
  setLocalContent,
  ITestimonial,
  IInvestorInsightsContent,
} from "@/redux/slices/investorInsightsSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

// Import shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  GripVertical,
  Eye,
  RefreshCw,
  Loader2,
  Sparkles,
  Images,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Import custom components
import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

type TestimonialFormData = Omit<ITestimonial, "_id">;
interface CloudinaryImage {
  secure_url: string;
}

interface InvestorInsightsManagerProps {
  section: any; // Required for global mode
  onChange: (changes: any) => void; // Required for global mode
  showSaveButton?: boolean;
}

// Default data structure
const defaultInvestorData = {
  content: {
    title: "",
    subtitle: "",
    description: "",
  },
  testimonials: [],
  isActive: true,
};

export default function InvestorInsightsManager({
  section,
  onChange,
  showSaveButton = false,
}: InvestorInsightsManagerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, saving } = useSelector(
    (state: RootState) => state.investor
  );

  // Use refs to track initialization state like PhuketPropertiesManager
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Local state for content
  const [contentForm, setContentForm] = useState<IInvestorInsightsContent>({
    title: "",
    subtitle: "",
    description: "",
  });

  // Local state for testimonials (derived from section or Redux)
  const [localTestimonials, setLocalTestimonials] = useState<ITestimonial[]>(
    []
  );

  // Testimonial states
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<ITestimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
    quote: "",
    content: "",
    designation: "",
    src: "",
    order: 0,
  });

  // Media selector states
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [selectedImageValue, setSelectedImageValue] = useState("");

  // Delete confirmation dialog
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    testimonial: ITestimonial | null;
  }>({
    isOpen: false,
    testimonial: null,
  });

  // Memoize the onChange callback to prevent infinite re-renders
  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange && userHasInteractedRef.current) {
        onChange(changes);
      }
    },
    [onChange]
  );

  // Initial load - section data first, then Redux fallback
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      // console.log("inside if")
      const sectionData = section.content;

      console.log("Section investor data ", sectionData);

      // If data is already flat, just set it directly
      setContentForm({
        title: sectionData.content.title || "",
        subtitle: sectionData.content.subtitle || "",
        description: sectionData.content.description || "",
      });

      if (sectionData.testimonials) {
        setLocalTestimonials(sectionData.testimonials);
      }

      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    } else if (!section?.content && !initialDataSetRef.current) {
      console.log("inside else");
      if (data?.content) {
        setContentForm(data?.content);
      }
      if (data?.testimonials) {
        setLocalTestimonials(data.testimonials);
      }
      if (data || !loading) {
        initialDataSetRef.current = true;
        isInitializedRef.current = true;
      }
    }
  }, [section, data, loading]);

  // Fetch Redux data if not available and not loading
  useEffect(() => {
    if (!data && !loading && !section?.content) {
      dispatch(fetchInvestorInsights());
    }
  }, [dispatch, data, loading, section]);

  // Notify parent only when user has interacted and data is initialized
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      const combinedData = {
        content: contentForm,
        testimonials: localTestimonials,
      };
      onChange({ content: combinedData });
    }
  }, [contentForm, localTestimonials]);

  // console.log("Content Form ", contentForm);

  // Memoized update functions to prevent unnecessary re-renders
  const updateContentForm = useCallback(
    (updates: Partial<IInvestorInsightsContent>) => {
      userHasInteractedRef.current = true;
      setContentForm((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateTestimonials = useCallback((testimonials: ITestimonial[]) => {
    userHasInteractedRef.current = true;
    setLocalTestimonials(testimonials);
  }, []);

  // Handle content form changes
  const handleContentChange = useCallback(
    (field: keyof IInvestorInsightsContent, value: string) => {
      updateContentForm({ [field]: value });
      // Also update Redux for real-time preview
      dispatch(setLocalContent({ ...contentForm, [field]: value }));
    },
    [contentForm, updateContentForm, dispatch]
  );

  const handleSaveContent = async () => {
    try {
      await dispatch(updateInvestorInsightsContent(contentForm)).unwrap();
      toast.success("Content updated successfully!");
    } catch (error) {
      toast.error("Failed to save content!");
      console.error("Failed to save content:", error);
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(fetchInvestorInsights());
    userHasInteractedRef.current = false;
    initialDataSetRef.current = false;
  }, [dispatch]);

  // Handle testimonial form
  const resetTestimonialForm = useCallback(() => {
    setTestimonialForm({
      quote: "",
      content: "",
      designation: "",
      src: "",
      order: 0,
    });
    setEditingTestimonial(null);
    setSelectedImageValue("");
  }, []);

  const handleAddTestimonial = useCallback(() => {
    resetTestimonialForm();
    setTestimonialForm((prev) => ({
      ...prev,
      order: localTestimonials.length + 1,
    }));
    setIsTestimonialDialogOpen(true);
  }, [localTestimonials.length, resetTestimonialForm]);

  const handleEditTestimonial = useCallback((testimonial: ITestimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      quote: testimonial.quote,
      content: testimonial.content,
      designation: testimonial.designation,
      src: testimonial.src,
      order: testimonial.order,
    });
    setSelectedImageValue(testimonial.src);
    setIsTestimonialDialogOpen(true);
  }, []);

  const handleImageSelect = useCallback((imageUrl: CloudinaryImage) => {
    setTestimonialForm((prev) => ({ ...prev, src: imageUrl.secure_url }));
    setSelectedImageValue(imageUrl.secure_url);
    setSelectorOpen(false);
  }, []);

  const handleSaveTestimonial = useCallback(async () => {
    if (
      !testimonialForm.quote ||
      !testimonialForm.content ||
      !testimonialForm.designation ||
      !testimonialForm.src
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingTestimonial?._id) {
        // Update existing testimonial
        const updatedTestimonials = localTestimonials.map((t) =>
          t._id === editingTestimonial._id ? { ...t, ...testimonialForm } : t
        );
        updateTestimonials(updatedTestimonials);

        // Also update Redux
        await dispatch(
          updateTestimonial({
            id: editingTestimonial._id,
            testimonial: testimonialForm,
          })
        ).unwrap();
        toast.success("Testimonial updated successfully!");
      } else {
        // Add new testimonial
        const newTestimonial: ITestimonial = {
          ...testimonialForm,
          _id: Date.now().toString(), // Temporary ID
        };
        updateTestimonials([...localTestimonials, newTestimonial]);

        // Also add to Redux
        await dispatch(addTestimonial(testimonialForm)).unwrap();
        toast.success("Testimonial added successfully!");
      }

      setIsTestimonialDialogOpen(false);
      resetTestimonialForm();
    } catch (error) {
      toast.error("Failed to save testimonial");
      console.error("Failed to save testimonial:", error);
    }
  }, [
    testimonialForm,
    editingTestimonial,
    localTestimonials,
    updateTestimonials,
    dispatch,
    resetTestimonialForm,
  ]);

  const handleDeleteTestimonial = useCallback((testimonial: ITestimonial) => {
    setDeleteConfirmDialog({
      isOpen: true,
      testimonial,
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteConfirmDialog.testimonial?._id) {
      try {
        // Remove from local state
        const updatedTestimonials = localTestimonials.filter(
          (t) => t._id !== deleteConfirmDialog.testimonial?._id
        );
        updateTestimonials(updatedTestimonials);

        // Also remove from Redux
        await dispatch(
          deleteTestimonial(deleteConfirmDialog.testimonial._id)
        ).unwrap();
        toast.success("Testimonial deleted successfully!");
        setDeleteConfirmDialog({ isOpen: false, testimonial: null });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
        toast.error("Failed to delete testimonial");
      }
    }
  }, [
    deleteConfirmDialog.testimonial,
    localTestimonials,
    updateTestimonials,
    dispatch,
  ]);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(localTestimonials);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedTestimonials = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      updateTestimonials(updatedTestimonials);

      try {
        await dispatch(reorderTestimonials(updatedTestimonials)).unwrap();
        toast.success("Testimonials reordered successfully!");
      } catch (error) {
        console.error("Failed to reorder testimonials:", error);
        toast.error("Failed to reorder testimonials");
      }
    },
    [localTestimonials, updateTestimonials, dispatch]
  );
  // console.log("Local testimonials", localTestimonials);
  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Require section prop for global save mode
  if (!section || !onChange) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-600">
          This manager can only be used within the global page management
          system.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (loading && !initialDataSetRef.current) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading investor insights...</span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => dispatch(clearError())}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full h-15 grid-cols-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-2 shadow-lg">
            <TabsTrigger
              value="content"
              className="flex cursor-pointer items-center py-2 space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Section Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="flex cursor-pointer items-center space-x-2 data-[state=inactive]:text-background data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Images className="w-4 h-4" />
              <span className="font-medium">Animated Testimonials</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Section Content Management</CardTitle>
                <CardDescription>
                  Edit the main content that appears on the left side of the
                  Investor Insights section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="pb-2">
                        Main Title
                      </Label>
                      <Input
                        id="title"
                        value={contentForm.title}
                        onChange={(e) =>
                          handleContentChange("title", e.target.value)
                        }
                        placeholder="e.g., Insights for the"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle" className="pb-2">
                        Highlighted Title
                      </Label>
                      <Input
                        id="subtitle"
                        value={contentForm.subtitle}
                        onChange={(e) =>
                          handleContentChange("subtitle", e.target.value)
                        }
                        placeholder="e.g., Discerning Investor"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Description</Label>
                      <div className="mt-2">
                        <RichTextEditor
                          value={contentForm.description}
                          onEditorChange={(content) =>
                            handleContentChange("description", content)
                          }
                          id="investor-insights-description"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card className="py-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Animated Testimonials Management</CardTitle>
                  <CardDescription>
                    Manage the animated testimonial cards that display property
                    insights
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddTestimonial}
                  className="text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {!localTestimonials || localTestimonials.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No testimonials found. Add your first testimonial to get
                      started.
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="investor-testimonials">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {localTestimonials
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((testimonial, index) => (
                                <Draggable
                                  key={testimonial._id}
                                  draggableId={testimonial._id as string}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`transition-all duration-200 py-6 ${
                                        snapshot.isDragging
                                          ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50"
                                          : ""
                                      }`}
                                    >
                                      <CardContent className="pt-6 flex items-start gap-4">
                                        {/* Drag handle */}
                                        <div
                                          {...provided.dragHandleProps}
                                          className="flex flex-col items-center pt-2 cursor-move"
                                        >
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                          <Badge
                                            variant="outline"
                                            className="mt-2 text-xs text-background"
                                          >
                                            {testimonial.order}
                                          </Badge>
                                        </div>

                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                          <img
                                            src={testimonial.src}
                                            alt={testimonial.content}
                                            className="w-20 h-20 rounded-lg object-cover border"
                                          />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-2">
                                          <h3 className="font-semibold text-lg">
                                            {testimonial.content}
                                          </h3>
                                          <p className="text-sm text-muted-foreground">
                                            {testimonial.designation}
                                          </p>
                                          <p className="text-sm line-clamp-3">
                                            {testimonial.quote}
                                          </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="bg-gray-200 cursor-pointer"
                                            onClick={() =>
                                              handleEditTestimonial(testimonial)
                                            }
                                          >
                                            <Edit2 className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              handleDeleteTestimonial(
                                                testimonial
                                              )
                                            }
                                            className="bg-gray-200 cursor-pointer text-destructive hover:text-destructive"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Testimonial Dialog */}
        <Dialog
          open={isTestimonialDialogOpen}
          onOpenChange={setIsTestimonialDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </DialogTitle>
              <DialogDescription>
                Fill in the testimonial details. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="testimonial-content"
                    className="pb-1 text-primary"
                  >
                    Testimonial Title
                  </Label>
                  <Input
                    id="testimonial-content"
                    className="text-gray-300"
                    value={testimonialForm.content}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="e.g., Phuket Tourism Market Report 2024"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="testimonial-designation"
                    className="pb-1 text-primary"
                  >
                    Designation/Category
                  </Label>
                  <Input
                    id="testimonial-designation"
                    value={testimonialForm.designation}
                    className="text-gray-300"
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        designation: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2024 Market Analysis"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="testimonial-order"
                    className="pb-1 text-primary"
                  >
                    Display Order
                  </Label>
                  <Input
                    id="testimonial-order"
                    type="number"
                    className="text-gray-300"
                    value={testimonialForm.order}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label className="text-primary">Property Image</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectorOpen(true)}
                      className="w-full bg-gray-200 cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {testimonialForm.src ? "Change Image" : "Select Image"}
                    </Button>
                    {testimonialForm.src && (
                      <img
                        src={testimonialForm.src}
                        alt="Selected"
                        className="mt-3 w-full h-32 rounded-lg object-cover border"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Quote Editor */}
              <div className="space-y-4">
                <div>
                  <Label className="text-primary">
                    Testimonial Quote/Description
                  </Label>
                  <div className="mt-2">
                    <RichTextEditor
                      value={testimonialForm.quote}
                      onEditorChange={(content) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          quote: content,
                        }))
                      }
                      id="testimonial-quote"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 cursor-pointer"
                onClick={() => setIsTestimonialDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="text-background cursor-pointer"
                onClick={handleSaveTestimonial}
                disabled={
                  saving ||
                  !testimonialForm.quote ||
                  !testimonialForm.content ||
                  !testimonialForm.designation ||
                  !testimonialForm.src
                }
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingTestimonial ? "Update" : "Create"} Testimonial
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmDialog.isOpen}
          onOpenChange={(open) =>
            !open &&
            setDeleteConfirmDialog({ isOpen: false, testimonial: null })
          }
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this testimonial? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteConfirmDialog.testimonial && (
              <div className="py-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <img
                    src={deleteConfirmDialog.testimonial.src}
                    alt={deleteConfirmDialog.testimonial.content}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {deleteConfirmDialog.testimonial.content}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deleteConfirmDialog.testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  setDeleteConfirmDialog({ isOpen: false, testimonial: null })
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete Testimonial"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Advanced Media Selector */}
        <AdvancedMediaSelector
          isOpen={isSelectorOpen}
          onOpenChange={setSelectorOpen}
          onSelect={handleImageSelect}
          mediaType="image"
          title="Select Testimonial Image"
          selectedValue={selectedImageValue}
        />
      </div>
    );
  };

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="Investor Insights"
      description="Manage investor insights section content and testimonials"
    >
      {renderContent()}
    </BaseSectionManager>
  );
}
