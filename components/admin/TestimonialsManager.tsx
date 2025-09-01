"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Star,
  Save,
  Loader2,
  Sparkles,
  Images,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import BaseSectionManager from "@/components/admin/BaseSectionManager";
import {
  fetchTestimonials,
  updateTestimonialsContent,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  selectTestimonials,
  clearError,
} from "@/redux/slices/testimonialsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
  order: number;
  isActive: boolean;
}

interface TestimonialFormData {
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
}

interface TestimonialsData {
  content: {
    title: string;
    description: string;
  };
  testimonials: TestimonialItem[];
}

interface TestimonialsManagerProps {
  section: any; // Required
  onChange: (changes: any) => void; // Required
  showSaveButton?: boolean;
}

const TestimonialsManagerContent = ({
  section,
  onChange,
  showSaveButton = true,
}: {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, content, testimonials, actionLoading } =
    useAppSelector(selectTestimonials);

  // Use refs to track initialization state like PhuketPropertiesManager
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Default data structure
  const defaultData: TestimonialsData = {
    content: {
      title: "",
      description: "",
    },
    testimonials: [],
  };

  // Local state for testimonials data
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData>(defaultData);

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
    name: "",
    role: "",
    rating: 5,
    quote: "",
    avatar: "",
  });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
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

  // Initial load - section data only (following PhuketPropertiesManager pattern)
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content;
      setTestimonialsData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    } else if (!section && !isInitializedRef.current) {
      // Fallback for standalone mode
      if (content && testimonials) {
        setTestimonialsData({
          content: {
            title: content.title || "",
            description: content.description || "",
          },
          testimonials: testimonials || [],
        });
      } else {
        setTestimonialsData(defaultData);
      }
      isInitializedRef.current = true;
    }
  }, [section, content, testimonials]);

  // Load Redux data only in standalone mode
  useEffect(() => {
    if (!section) {
      dispatch(fetchTestimonials());
    }
  }, [dispatch, section]);

  // Notify parent only if user interacted (following PhuketPropertiesManager pattern)
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: testimonialsData });
    }
  }, [testimonialsData]);

  // Handle Redux state updates for standalone mode
  useEffect(() => {
    if (!section && content && testimonials && !initialDataSetRef.current) {
      setTestimonialsData({
        content: {
          title: content.title || "",
          description: content.description || "",
        },
        testimonials: testimonials || [],
      });
      initialDataSetRef.current = true;
    }
  }, [content, testimonials, section]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Memoize update functions to prevent unnecessary re-renders
  const updateTestimonialsData = useCallback(
    (updates: Partial<TestimonialsData>) => {
      userHasInteractedRef.current = true;
      setTestimonialsData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleContentUpdate = useCallback(
    (field: string, value: string) => {
      userHasInteractedRef.current = true;
      setTestimonialsData((prev) => ({
        ...prev,
        content: { ...prev.content, [field]: value },
      }));
    },
    []
  );

const handleContentSave = async () => {
  try {
    if (section) {
      // Global mode - data is already being saved via parent onChange
      // Just show success message since parent handles the actual saving
      toast.success("Changes will be saved with the page!");
    } else {
      // Standalone mode - use Redux
      await dispatch(updateTestimonialsContent(testimonialsData.content)).unwrap();
      toast.success("Content updated successfully!");
    }
  } catch (error) {
    if (!section) {
      console.error("Error updating content:", error);
      toast.error("Failed to save content");
    }
  }
};

  const handleRefresh = () => {
    if (!section) {
      dispatch(fetchTestimonials());
    }
    userHasInteractedRef.current = false;
    initialDataSetRef.current = false;
  };

  const handleCreateTestimonial = async () => {
    if (
      !testimonialForm.name ||
      !testimonialForm.role ||
      !testimonialForm.quote ||
      !testimonialForm.avatar
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (section) {
        // Global mode - update local state
        const newTestimonial: TestimonialItem = {
          id: Date.now().toString(),
          ...testimonialForm,
          order: testimonialsData.testimonials.length,
          isActive: true,
        };
        
        userHasInteractedRef.current = true;
        setTestimonialsData((prev) => ({
          ...prev,
          testimonials: [...prev.testimonials, newTestimonial],
        }));
        
        toast.success("Testimonial created successfully!");
      } else {
        // Standalone mode - use Redux
        await dispatch(createTestimonial(testimonialForm)).unwrap();
        toast.success("Testimonial created successfully!");
      }
      
      resetTestimonialForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating testimonial:", error);
    }
  };

  const handleEditTestimonial = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating,
      quote: testimonial.quote,
      avatar: testimonial.avatar,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTestimonial = async () => {
    if (
      !editingTestimonial ||
      !testimonialForm.name ||
      !testimonialForm.role ||
      !testimonialForm.quote ||
      !testimonialForm.avatar
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (section) {
        // Global mode - update local state
        userHasInteractedRef.current = true;
        setTestimonialsData((prev) => ({
          ...prev,
          testimonials: prev.testimonials.map((item) =>
            item.id === editingTestimonial.id
              ? { ...item, ...testimonialForm }
              : item
          ),
        }));
        
        toast.success("Testimonial updated successfully!");
      } else {
        // Standalone mode - use Redux
        await dispatch(
          updateTestimonial({
            id: editingTestimonial.id,
            testimonialData: testimonialForm,
          })
        ).unwrap();
        toast.success("Testimonial updated successfully!");
      }
      
      resetTestimonialForm();
      setIsEditDialogOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error("Error updating testimonial:", error);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      if (section) {
        // Global mode - update local state
        userHasInteractedRef.current = true;
        setTestimonialsData((prev) => ({
          ...prev,
          testimonials: prev.testimonials.filter((item) => item.id !== id),
        }));
        
        toast.success("Testimonial deleted successfully!");
      } else {
        // Standalone mode - use Redux
        await dispatch(deleteTestimonial(id)).unwrap();
        toast.success("Testimonial deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      name: "",
      role: "",
      rating: 5,
      quote: "",
      avatar: "",
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const currentTestimonials = section ? testimonialsData.testimonials : testimonials;
    const items = Array.from(currentTestimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    try {
      if (section) {
        // Global mode - update local state
        userHasInteractedRef.current = true;
        setTestimonialsData((prev) => ({
          ...prev,
          testimonials: reorderedItems,
        }));
        
        toast.success("Testimonials reordered successfully!");
      } else {
        // Standalone mode - use Redux
        await dispatch(reorderTestimonials(reorderedItems)).unwrap();
        toast.success("Testimonials reordered successfully!");
      }
    } catch (error) {
      console.error("Error reordering testimonials:", error);
    }
  };

  const handleAvatarSelect = (media: { url: string }) => {
    setTestimonialForm((prev) => ({ ...prev, avatar: media.url }));
    setSelectorOpen(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Get current testimonials based on mode
  const currentTestimonials = section ? testimonialsData.testimonials : testimonials || [];
  const currentContent = section ? testimonialsData.content : { title: content?.title || "", description: content?.description || "" };

  if (loading && !section) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading testimonials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - only show in standalone mode */}
      {showSaveButton && !section && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Testimonials Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-gray-200 cursor-pointer"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleContentSave}
              disabled={actionLoading?.content}
              className="text-background cursor-pointer"
            >
              {actionLoading?.content ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="content" className="w-full">
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
            <span className="font-medium">Testimonials</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <RichTextEditor
                  value={currentContent.title}
                  onEditorChange={(content) =>
                    handleContentUpdate("title", content)
                  }
                  id="testimonials-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Section Description</Label>
                <RichTextEditor
                  value={currentContent.description}
                  onEditorChange={(content) =>
                    handleContentUpdate("description", content)
                  }
                  id="testimonials-description"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manage Testimonials</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-primary text-background cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Testimonial</DialogTitle>
                  <DialogDescription>
                    Add a new client testimonial to the section.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name *</Label>
                      <Input
                        id="name"
                        value={testimonialForm.name}
                        onChange={(e) =>
                          setTestimonialForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Mr. David Chen"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role & Location *</Label>
                      <Input
                        id="role"
                        value={testimonialForm.role}
                        onChange={(e) =>
                          setTestimonialForm((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        placeholder="e.g., Business Magnate, Singapore"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    <Select
                      value={testimonialForm.rating.toString()}
                      onValueChange={(value) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          rating: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              {rating} {renderStars(rating)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Testimonial Quote *</Label>
                    <RichTextEditor
                      value={testimonialForm.quote}
                      onEditorChange={(content) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          quote: content,
                        }))
                      }
                      id="create-testimonial-quote"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Client Avatar *</Label>
                    <div className="flex items-center gap-4">
                      {testimonialForm.avatar && (
                        <img
                          src={testimonialForm.avatar}
                          alt="Selected avatar"
                          className="w-16 h-16 rounded-full object-cover border"
                        />
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectorOpen(true)}
                      >
                        {testimonialForm.avatar
                          ? "Change Image"
                          : "Select Image"}
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    className="cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300"
                    onClick={() => {
                      resetTestimonialForm();
                      setIsCreateDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTestimonial}
                    className="cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300"
                    disabled={actionLoading?.create}
                  >
                    {actionLoading?.create ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Testimonial"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {currentTestimonials.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No testimonials found</p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary text-background cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Testimonial
                </Button>
              </CardContent>
            </Card>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="testimonials">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {currentTestimonials.map((testimonial, index) => (
                      <Draggable
                        key={testimonial.id}
                        draggableId={testimonial.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging
                                ? "shadow-lg ring-2 ring-blue-500 ring-opacity-50"
                                : ""
                            }`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move p-2 hover:bg-gray-100 rounded"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-400" />
                                </div>

                                <div className="flex-shrink-0">
                                  <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                  />
                                </div>

                                <div className="flex-grow space-y-2">
                                  <div className="flex items-center gap-4">
                                    <h3 className="font-semibold text-lg">
                                      {testimonial.name}
                                    </h3>
                                    <Badge variant="secondary">
                                      {testimonial.role}
                                    </Badge>
                                    {renderStars(testimonial.rating)}
                                  </div>

                                  <div
                                    className="text-gray-600 line-clamp-3"
                                    dangerouslySetInnerHTML={{
                                      __html: testimonial.quote,
                                    }}
                                  />

                                  <div className="text-sm text-gray-500">
                                    Order: {testimonial.order + 1}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-gray-200 cursor-pointer"
                                    onClick={() =>
                                      handleEditTestimonial(testimonial)
                                    }
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="cursor-pointer"
                                        variant="destructive"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete Testimonial
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this
                                          testimonial? This action cannot be
                                          undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteTestimonial(
                                              testimonial.id
                                            )
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
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
        </TabsContent>
      </Tabs>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Client Name *</Label>
                <Input
                  id="edit-name"
                  value={testimonialForm.name}
                  onChange={(e) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Mr. David Chen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role & Location *</Label>
                <Input
                  id="edit-role"
                  value={testimonialForm.role}
                  onChange={(e) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  placeholder="e.g., Business Magnate, Singapore"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <Select
                value={testimonialForm.rating.toString()}
                onValueChange={(value) =>
                  setTestimonialForm((prev) => ({
                    ...prev,
                    rating: parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        {rating} {renderStars(rating)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Testimonial Quote *</Label>
              <RichTextEditor
                value={testimonialForm.quote}
                onEditorChange={(content) =>
                  setTestimonialForm((prev) => ({ ...prev, quote: content }))
                }
                id="edit-testimonial-quote"
              />
            </div>

            <div className="space-y-2">
              <Label>Client Avatar *</Label>
              <div className="flex items-center gap-4">
                {testimonialForm.avatar && (
                  <img
                    src={testimonialForm.avatar}
                    alt="Selected avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectorOpen(true)}
                >
                  {testimonialForm.avatar ? "Change Image" : "Select Image"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300"
              onClick={() => {
                resetTestimonialForm();
                setIsEditDialogOpen(false);
                setEditingTestimonial(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTestimonial}
              className="cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300"
              disabled={actionLoading?.update}
            >
              {actionLoading?.update ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Testimonial"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Media Selector */}
      <AdvancedMediaSelector
        isOpen={isSelectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleAvatarSelect}
        mediaType="image"
        title="Select Client Avatar"
        selectedValue={testimonialForm.avatar}
      />
    </div>
  );
};

// Main component - Global save mode only
export default function TestimonialsManager({
  section,
  onChange,
  showSaveButton = false,
}: TestimonialsManagerProps) {
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

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="Testimonials"
      description="Manage testimonials section content and reviews"
    >
      <TestimonialsManagerContent 
        section={section}
        onChange={onChange} 
        showSaveButton={false} 
      />
    </BaseSectionManager>
  );
}