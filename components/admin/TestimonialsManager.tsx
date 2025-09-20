"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, GripVertical, Star } from "lucide-react";
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
  section: any;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

const TestimonialsManagerContent = ({
  section,
  onChange,
}: {
  section: any;
  onChange: (changes: any) => void;
}) => {
  const [localData, setLocalData] = useState<TestimonialsData>({
    title: section?.content?.title || "",
    subtitle: section?.content?.subtitle || "",
    testimonials: section?.content?.testimonials || [],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState<TestimonialsData | null>(
    null
  );

  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
    name: "",
    role: "",
    rating: 5,
    quote: "",
    avatar: "",
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialItem | null>(null);
  const [isSelectorOpen, setSelectorOpen] = useState(false);

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
            className={`w-3 h-3 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Basic Content */}
      {/* grid grid-cols-1 md:grid-cols-2 gap-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
        <Label htmlFor="title">Section Title</Label>
        <div className="min-h-[80px]">
          <RichTextEditor
            value={localData.title}
            onEditorChange={(content) => handleContentUpdate("title", content)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subtitle">Section Subtitle</Label>
        <div className="min-h-[80px]">
          <RichTextEditor
            value={localData.subtitle}
            onEditorChange={(content) =>
              handleContentUpdate("subtitle", content)
            }
          />
        </div>
      </div>

      </div>
      {/* Testimonials Management */}

          <div className="flex justify-between items-center">
            <p className="text-sm">
              Testimonials ({localData.testimonials.length})
            </p>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm"                     className="cursor-pointer"
>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] admin-theme">
                <DialogHeader>
                  <DialogTitle>Create New Testimonial</DialogTitle>
                  <DialogDescription>
                    Add a new client testimonial to the section.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name" className="text-xs">
                        Client Name *
                      </Label>
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
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role" className="text-xs">
                        Role & Location *
                      </Label>
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
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Rating *</Label>
                      <Select
                        value={testimonialForm.rating.toString()}
                        onValueChange={(value) =>
                          setTestimonialForm((prev) => ({
                            ...prev,
                            rating: parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger className="text-sm">
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

                    <div>
                      <Label className="text-xs">Client Avatar *</Label>
                      <div className="flex items-center gap-3">
                        {testimonialForm.avatar && (
                          <img
                            src={testimonialForm.avatar}
                            alt="Selected avatar"
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                                              className="cursor-pointer"

                          onClick={() => setSelectorOpen(true)}
                        >
                          {testimonialForm.avatar ? "Change" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Testimonial Quote *</Label>
                    <div className="min-h-[100px]">
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
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                                        className="cursor-pointer"

                    onClick={() => {
                      resetTestimonialForm();
                      setIsCreateDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreateTestimonial}                     className="cursor-pointer"
>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>


        <div>
          {localData.testimonials.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm mb-3">No testimonials found</p>
              <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}                     className="cursor-pointer"
>
                <Plus className="w-4 h-4 mr-2" />
                Add First Testimonial
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="testimonials">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {localData.testimonials.map((testimonial, index) => (
                      <Draggable
                        key={testimonial.id}
                        draggableId={testimonial.id}
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
                                className="cursor-move p-1 hover:bg-gray-100 rounded"
                              >
                                <GripVertical className="w-3 h-3 text-gray-400" />
                              </div>

                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full object-cover border"
                              />

                              <div className="flex-grow space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-sm">
                                    {testimonial.name}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {testimonial.role}
                                  </Badge>
                                  {renderStars(testimonial.rating)}
                                </div>

                                <div
                                  className="text-xs text-gray-600 line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html: testimonial.quote,
                                  }}
                                />
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                                      className="cursor-pointer"

                                  onClick={() =>
                                    handleEditTestimonial(testimonial)
                                  }
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive"                     className="cursor-pointer"
>
                                      <Trash2 className="w-3 h-3" />
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
        </div>


      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] admin-theme">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Client Name *</Label>
                <Input
                  value={testimonialForm.name}
                  onChange={(e) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Role & Location *</Label>
                <Input
                  value={testimonialForm.role}
                  onChange={(e) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Rating *</Label>
                <Select
                  value={testimonialForm.rating.toString()}
                  onValueChange={(value) =>
                    setTestimonialForm((prev) => ({
                      ...prev,
                      rating: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
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
              <div>
                <Label className="text-xs">Avatar *</Label>
                <div className="flex items-center gap-3">
                  {testimonialForm.avatar && (
                    <img
                      src={testimonialForm.avatar}
                      alt="Selected avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setSelectorOpen(true)}
                  >
                    {testimonialForm.avatar ? "Change" : "Select"}
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Quote *</Label>
              <div className="min-h-[100px]">
                <RichTextEditor
                  value={testimonialForm.quote}
                  onEditorChange={(content) =>
                    setTestimonialForm((prev) => ({ ...prev, quote: content }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
                                  className="cursor-pointer"

              size="sm"
              onClick={() => {
                resetTestimonialForm();
                setIsEditDialogOpen(false);
                setEditingTestimonial(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdateTestimonial}                     className="cursor-pointer"
>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

export default function TestimonialsManager({
  section,
  onChange,
  showSaveButton = false,
}: TestimonialsManagerProps) {
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
