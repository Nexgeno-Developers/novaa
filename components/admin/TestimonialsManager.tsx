"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Book,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

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
  subtitle: string;
  title: string;
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
}: {
  section: any;
  onChange: (changes: any) => void;
}) => {
  // Local state for section-based management
  const [localData, setLocalData] = useState<TestimonialsData>({
    title: section?.content?.title || "",
    subtitle: section?.content?.subtitle || "",
    testimonials: section?.content?.testimonials || [],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState<TestimonialsData | null>(
    null
  );

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
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialItem | null>(null);
  const [isSelectorOpen, setSelectorOpen] = useState(false);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content) {
      const newData = {
        title: section.content.title || "",
        subtitle: section.content.subtitle || "",
        testimonials: section.content.testimonials || [],
      };
      setLocalData(newData);
      setOriginalData(JSON.parse(JSON.stringify(newData)));
    }
  }, [section]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [hasLocalChanges]);

  const handleContentUpdate = useCallback((field: string, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasLocalChanges(true);
  }, []);

  const handleCreateTestimonial = () => {
    if (
      !testimonialForm.name ||
      !testimonialForm.role ||
      !testimonialForm.quote ||
      !testimonialForm.avatar
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const newTestimonial: TestimonialItem = {
      id: Date.now().toString(),
      ...testimonialForm,
      order: localData.testimonials.length,
      isActive: true,
    };

    setLocalData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial],
    }));
    setHasLocalChanges(true);

    toast.success("Testimonial created successfully!");
    resetTestimonialForm();
    setIsCreateDialogOpen(false);
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

  const handleUpdateTestimonial = () => {
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

    setLocalData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((item) =>
        item.id === editingTestimonial.id
          ? { ...item, ...testimonialForm }
          : item
      ),
    }));
    setHasLocalChanges(true);

    toast.success("Testimonial updated successfully!");
    resetTestimonialForm();
    setIsEditDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    setLocalData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((item) => item.id !== id),
    }));
    setHasLocalChanges(true);

    toast.success("Testimonial deleted successfully!");
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(localData.testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setLocalData((prev) => ({
      ...prev,
      testimonials: reorderedItems,
    }));
    setHasLocalChanges(true);

    toast.success("Testimonials reordered successfully!");
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

  return (
    <div className="space-y-6">
      {/* <Tabs defaultValue="content" className="w-full">
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

        <TabsContent value="content" className="space-y-6"> */}
      <Card className="pb-6 ring-2 ring-primary/20 bg-indigo-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <CardTitle className="flex items-center text-gray-800 py-6">
            <Book className="h-5 w-5 mr-2 text-blue-600" />
            Section Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-primary/90">
              Section Title
            </Label>
            <RichTextEditor
              value={localData.title}
              onEditorChange={(content) =>
                handleContentUpdate("title", content)
              }
              id="testimonials-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-primary/90">
              Section Subtitle
            </Label>
            <RichTextEditor
              value={localData.subtitle}
              onEditorChange={(content) =>
                handleContentUpdate("subtitle", content)
              }
              id="testimonials-subtitle"
            />
          </div>
        </CardContent>
      </Card>
      {/* </TabsContent> */}

      {/* <TabsContent value="testimonials" className="space-y-6"> */}
      {/* <Card className="pb-6 ring-2 ring-primary/20 bg-gray-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <CardTitle className="flex items-center text-gray-800 py-6">
            <Image className="h-5 w-5 mr-2 text-blue-600" />
            Manage Testimonials
          </CardTitle>
        </CardHeader> */}
      <Card className="pb-6 ring-2 ring-primary/20 bg-purple-50/30">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <div className="flex items-center">
            <Image className="h-5 w-5 mr-2 text-blue-600" />

            <h2 className="text-xl font-semibold">Manage Testimonials</h2>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild className="flex">
              <Button className="bg-primary text-background cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] admin-theme">
              <DialogHeader>
                <DialogTitle className="text-primary/90">Create New Testimonial</DialogTitle>
                <DialogDescription>
                  Add a new client testimonial to the section.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-primary/90">Client Name *</Label>
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
                    <Label htmlFor="role" className="text-primary/90">Role & Location *</Label>
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
                  <Label className="text-primary/90">Rating *</Label>
                  <Select
                    value={testimonialForm.rating.toString()}
                    onValueChange={(value) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        rating: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="ring-2 ring-primary/20 cursor-pointer">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent className="admin-theme">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            {rating} {renderStars(rating)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-primary/90">Testimonial Quote *</Label>
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
                  <Label className="text-primary/90">Client Avatar *</Label>
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
                      className="cursor-pointer "
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
                    setIsCreateDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTestimonial}
                  className="cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300"
                >
                  Create Testimonial
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {localData.testimonials.length === 0 ? (
          <Card className="py-6">
            <CardContent className="text-center py-8">
              <p className="text-primary/90 mb-4">No testimonials found</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-primary/90 cursor-pointer"
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
                  className="space-y-4 px-6"
                >
                  {localData.testimonials.map((testimonial, index) => (
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
                                  <h3 className="font-semibold text-lg text-primary/90">
                                    {testimonial.name}
                                  </h3>
                                  <Badge variant="secondary" className="text-primary/90">
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
                                  <AlertDialogContent className="admin-theme">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-primary/90">
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
                                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
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
      </Card>
      {/* </TabsContent>
        
      </Tabs> */}

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] admin-theme">
          <DialogHeader>
            <DialogTitle className="text-primary/90">Edit Testimonial</DialogTitle>
            <DialogDescription>
              Update the testimonial information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-primary/90">Client Name *</Label>
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
                <Label htmlFor="edit-role" className="text-primary/90">Role & Location *</Label>
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
              <Label className="text-primary/90">Rating *</Label>
              <Select
                value={testimonialForm.rating.toString()}
                onValueChange={(value) =>
                  setTestimonialForm((prev) => ({
                    ...prev,
                    rating: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="cursor-pointer ring-2 ring-primary/20">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="admin-theme">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        {rating} {renderStars(rating)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-primary/90">Testimonial Quote *</Label>
              <RichTextEditor
                value={testimonialForm.quote}
                onEditorChange={(content) =>
                  setTestimonialForm((prev) => ({ ...prev, quote: content }))
                }
                id="edit-testimonial-quote"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-primary/90">Client Avatar *</Label>
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
                  className="cursor-pointer border-indigo-200 border-2"
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
            >
              Update Testimonial
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
      <TestimonialsManagerContent section={section} onChange={onChange} />
    </BaseSectionManager>
  );
}
