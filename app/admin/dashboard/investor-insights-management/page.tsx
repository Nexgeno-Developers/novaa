// components/admin/dashboard/investor-insights-management/InvestorInsightsManager.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  ImagePlay,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Import custom components
import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";

interface TestimonialFormData extends Omit<ITestimonial, "_id"> {}

interface CloudinaryImage {
  secure_url: string;
}

const InvestorInsightsManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, saving } = useSelector(
    (state: RootState) => state.investor
  );

  // Content state
  const [contentForm, setContentForm] = useState<IInvestorInsightsContent>({
    mainTitle: "",
    highlightedTitle: "",
    description: "",
  });

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

  useEffect(() => {
    dispatch(fetchInvestorInsights());
  }, [dispatch]);

  useEffect(() => {
    if (data?.content) {
      setContentForm(data.content);
    }
  }, [data]);

  // Handle content form changes
  const handleContentChange = (
    field: keyof IInvestorInsightsContent,
    value: string
  ) => {
    const updatedContent = { ...contentForm, [field]: value };
    setContentForm(updatedContent);
    dispatch(setLocalContent(updatedContent));
  };

  const handleSaveContent = async () => {
    try {
      await dispatch(updateInvestorInsightsContent(contentForm)).unwrap();
      toast.success("Content updated successfully!");
    } catch (error) {
      toast.error("Failed to saved content!");

      console.error("Failed to save content:", error);
    }
  };

  // Handle testimonial form
  const resetTestimonialForm = () => {
    setTestimonialForm({
      quote: "",
      content: "",
      designation: "",
      src: "",
      order: 0,
    });
    setEditingTestimonial(null);
    setSelectedImageValue("");
  };

  const handleAddTestimonial = () => {
    try {
      resetTestimonialForm();
      setTestimonialForm((prev) => ({
        ...prev,
        order: data?.testimonials ? data.testimonials.length + 1 : 1,
      }));
      setIsTestimonialDialogOpen(true);
      toast.success("Testimonial added successfully!");
    } catch (error) {
      toast.error("Error creating testimonial");
      console.error("Error creating testimonial:", error);
    }
  };

  const handleEditTestimonial = (testimonial: ITestimonial) => {
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
  };

  const handleImageSelect = (imageUrl: CloudinaryImage) => {
    console.log("Image Url", imageUrl);
    setTestimonialForm((prev) => ({ ...prev, src: imageUrl.secure_url }));
    setSelectedImageValue(imageUrl.secure_url);
    setSelectorOpen(false);
  };

  const handleSaveTestimonial = async () => {
    if (
      !testimonialForm.quote ||
      !testimonialForm.content ||
      !testimonialForm.designation ||
      !testimonialForm.src
    ) {
      return;
    }

    try {
      if (editingTestimonial?._id) {
        await dispatch(
          updateTestimonial({
            id: editingTestimonial._id,
            testimonial: testimonialForm,
          })
        ).unwrap();
        toast.success("Testimonial updated successfully!");
      } else {
        toast.success("Testimonial added successfully!");

        await dispatch(addTestimonial(testimonialForm)).unwrap();
      }

      setIsTestimonialDialogOpen(false);
      resetTestimonialForm();
    } catch (error) {
      toast.error("Failed to save testimonial");

      console.error("Failed to save testimonial:", error);
    }
  };

  const handleDeleteTestimonial = (testimonial: ITestimonial) => {
    setDeleteConfirmDialog({
      isOpen: true,
      testimonial,
    });
  };

  const confirmDelete = async () => {
    if (deleteConfirmDialog.testimonial?._id) {
      try {
        await dispatch(
          deleteTestimonial(deleteConfirmDialog.testimonial._id)
        ).unwrap();
        toast.success("Testimonial deleted successfully!");
        setDeleteConfirmDialog({ isOpen: false, testimonial: null });
      } catch (error) {
        console.error("Failed to delete testimonial:", error);
      }
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !data?.testimonials) return;

    const items = Array.from(data.testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedTestimonials = items.map((item, index) => ({
      ...item,
      order: index, // keep 0-based (consistent with backend)
    }));

    try {
      await dispatch(reorderTestimonials(updatedTestimonials)).unwrap();
      toast.success("Investor testimonials reordered!");
    } catch (error) {
      console.error("Failed to reorder testimonials:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Insights Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage content and testimonials for the Investor Insights section
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-gray-200 cursor-pointer"
            onClick={() => dispatch(fetchInvestorInsights())}
            disabled={loading}
          >
            Refresh
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={handleSaveContent}
            disabled={saving}
            className="text-background cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </>
            )}
          </Button>
        </div>
      </div>
      <Badge
        className="bg-primary text-background"
        variant={data?.isActive ? "default" : "secondary"}
      >
        {data?.isActive ? "Active" : "Inactive"}
      </Badge>

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
                    <Label htmlFor="mainTitle" className="pb-2">
                      Main Title
                    </Label>
                    <Input
                      id="mainTitle"
                      value={contentForm.mainTitle}
                      onChange={(e) =>
                        handleContentChange("mainTitle", e.target.value)
                      }
                      placeholder="e.g., Insights for the"
                    />
                  </div>

                  <div>
                    <Label htmlFor="highlightedTitle" className="pb-2">
                      Highlighted Title
                    </Label>
                    <Input
                      id="highlightedTitle"
                      value={contentForm.highlightedTitle}
                      onChange={(e) =>
                        handleContentChange("highlightedTitle", e.target.value)
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
              <Button onClick={handleAddTestimonial} className="text-background cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {!data?.testimonials || data.testimonials.length === 0 ? (
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
                          {data.testimonials
                            .slice()
                            .sort((a, b) => a.order - b.order)
                            .map((testimonial, index) => (
                              <Draggable
                                key={testimonial._id}
                                draggableId={testimonial._id}
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
                                            handleDeleteTestimonial(testimonial)
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
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
            <DialogDescription>
              Fill in the testimonial details. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="testimonial-content" className="pb-1 text-primary">Testimonial Title</Label>
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
                <Label htmlFor="testimonial-designation" className="pb-1 text-primary">
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
                <Label htmlFor="testimonial-order" className="pb-1 text-primary">Display Order</Label>
                <Input
                  id="testimonial-order"
                  type="number"
                  className='text-gray-300'
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
                <Label className="text-primary">Testimonial Quote/Description</Label>
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
          !open && setDeleteConfirmDialog({ isOpen: false, testimonial: null })
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
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

export default InvestorInsightsManager;
