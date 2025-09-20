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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Loader2,
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

import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

type TestimonialFormData = Omit<ITestimonial, "_id">;
interface CloudinaryImage {
  secure_url: string;
}

interface InvestorInsightsManagerProps {
  section: any;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function InvestorInsightsManager({
  section,
  onChange,
  showSaveButton = false,
}: InvestorInsightsManagerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error, saving } = useSelector(
    (state: RootState) => state.investor
  );

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);
 
  const [contentForm, setContentForm] = useState<IInvestorInsightsContent>({
    title: section?.content?.title || "",
    subtitle: section?.content?.subtitle ||  "",
    description: section?.content?.description || "",
  });

  const [localTestimonials, setLocalTestimonials] = useState<ITestimonial[]>(
    []
  );

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

  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [selectedImageValue, setSelectedImageValue] = useState("");

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    testimonial: ITestimonial | null;
  }>({
    isOpen: false,
    testimonial: null,
  });

  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange && userHasInteractedRef.current) {
        onChange(changes);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content;

      setContentForm({
        title: sectionData?.title || "",
        subtitle: sectionData?.subtitle || "",
        description: sectionData?.description || "",
      });

      if (sectionData.testimonials) {
        setLocalTestimonials(sectionData.testimonials);
      }

      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    } else if (!section?.content && !initialDataSetRef.current) {
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

  useEffect(() => {
    if (!data && !loading && !section?.content) {
      dispatch(fetchInvestorInsights());
    }
  }, [dispatch, data, loading, section]);

  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      const combinedData = {
        title: contentForm.title,
        subtitle: contentForm.subtitle,
        description: contentForm.description,
        testimonials: localTestimonials,
      };
      onChange({ content: combinedData });
    }
  }, [contentForm, localTestimonials]);

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

  const handleContentChange = useCallback(
    (field: keyof IInvestorInsightsContent, value: string) => {
      updateContentForm({ [field]: value });
      dispatch(setLocalContent({ ...contentForm, [field]: value }));
    },
    [contentForm, updateContentForm, dispatch]
  );

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
        const updatedTestimonials = localTestimonials.map((t) =>
          t._id === editingTestimonial._id ? { ...t, ...testimonialForm } : t
        );
        updateTestimonials(updatedTestimonials);

        await dispatch(
          updateTestimonial({
            id: editingTestimonial._id,
            testimonial: testimonialForm,
          })
        ).unwrap();
        toast.success("Testimonial updated successfully!");
      } else {
        const newTestimonial: ITestimonial = {
          ...testimonialForm,
          _id: Date.now().toString(),
        };
        updateTestimonials([...localTestimonials, newTestimonial]);

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
        const updatedTestimonials = localTestimonials.filter(
          (t) => t._id !== deleteConfirmDialog.testimonial?._id
        );
        updateTestimonials(updatedTestimonials);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading investor insights...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              
              className="ml-auto cursor-pointer"
              onClick={() => dispatch(clearError())}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Basic Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Main Title</Label>
            <Input
              id="title"
              value={contentForm.title}
              onChange={(e) => handleContentChange("title", e.target.value)}
              placeholder="e.g., Insights for the"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Highlighted Title</Label>
            <Input
              id="subtitle"
              value={contentForm.subtitle}
              onChange={(e) => handleContentChange("subtitle", e.target.value)}
              placeholder="e.g., Discerning Investor"
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <div className="min-h-[120px]">
            <RichTextEditor
              value={contentForm.description}
              onEditorChange={(content) =>
                handleContentChange("description", content)
              }
            />
          </div>
        </div>

        {/* Testimonials */}

        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold">Testimonials ({localTestimonials.length})</p>
          <Button size="sm" onClick={handleAddTestimonial} className="cursor-pointer">
            <Plus className="mr-1 h-3 w-3" />
            Add
          </Button>
        </div>

        <div>
          <ScrollArea className="h-[400px] pr-2">
            {!localTestimonials || localTestimonials.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm mb-3">No testimonials found</p>
                <Button size="sm" onClick={handleAddTestimonial} className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Testimonial
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="investor-testimonials">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
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
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-3 border rounded bg-white ${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move pt-1"
                                  >
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>

                                  <img
                                    src={testimonial.src}
                                    alt={testimonial.content}
                                    className="w-12 h-12 rounded object-cover border flex-shrink-0"
                                  />

                                  <div className="flex-1 space-y-1 min-w-0">
                                    <h3 className="font-semibold text-sm truncate">
                                      {testimonial.content}
                                    </h3>
                                    <p className="text-xs text-gray-600 truncate">
                                      {testimonial.designation}
                                    </p>
                                    <div
                                      className="text-xs text-gray-500 line-clamp-2"
                                      dangerouslySetInnerHTML={{
                                        __html: testimonial.quote,
                                      }}
                                    />
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Order: {testimonial.order}
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleEditTestimonial(testimonial)
                                      }
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleDeleteTestimonial(testimonial)
                                      }
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
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
            )}
          </ScrollArea>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog
          open={isTestimonialDialogOpen}
          onOpenChange={setIsTestimonialDialogOpen}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto admin-theme">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
              </DialogTitle>
              <DialogDescription>
                Fill in the testimonial details. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Testimonial Title</Label>
                  <Input
                    value={testimonialForm.content}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="e.g., Phuket Tourism Market Report 2024"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Designation/Category</Label>
                  <Input
                    value={testimonialForm.designation}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        designation: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2024 Market Analysis"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Display Order</Label>
                  <Input
                    type="number"
                    value={testimonialForm.order}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="1"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Property Image</Label>
                  <Button
                    type="button"
                    onClick={() => setSelectorOpen(true)}
                    className="w-full mt-1 cursor-pointer"
                    size="sm"
                  >
                    {testimonialForm.src ? "Change Image" : "Select Image"}
                  </Button>
                  {testimonialForm.src && (
                    <img
                      src={testimonialForm.src}
                      alt="Selected"
                      className="mt-2 w-full h-24 rounded object-cover border"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs">Testimonial Quote/Description</Label>
                <RichTextEditor
                  value={testimonialForm.quote}
                  onEditorChange={(content) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      quote: content,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={() => setIsTestimonialDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="cursor-pointer"
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
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Save className="mr-1 h-3 w-3" />
                )}
                {editingTestimonial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
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
              <div className="py-3">
                <div className="flex items-center gap-3 p-2 border rounded">
                  <img
                    src={deleteConfirmDialog.testimonial.src}
                    alt={deleteConfirmDialog.testimonial.content}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {deleteConfirmDialog.testimonial.content}
                    </p>
                    <p className="text-xs text-gray-600">
                      {deleteConfirmDialog.testimonial.designation}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={() =>
                  setDeleteConfirmDialog({ isOpen: false, testimonial: null })
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="cursor-pointer"
                onClick={confirmDelete}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
