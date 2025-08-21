// // components/admin/TestimonialsManager.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Button,
} from "@/components/ui/button";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
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
import {
  Badge,
} from "@/components/ui/badge";
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
import { Plus, Edit, Trash2, GripVertical, Star, Save, Loader2, Sparkles, Images, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/Editor';
import {AdvancedMediaSelector} from '@/components/admin/AdvancedMediaSelector';
import {
  fetchTestimonials,
  updateTestimonialsContent,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
  selectTestimonials,
  clearError
} from '@/redux/slices/testimonialsSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

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

interface CloudinaryImage {
  secure_url: string;
}


const TestimonialsManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    content,
    testimonials,
    actionLoading
  } = useSelector(selectTestimonials);

  // console.log(loading , error , content , testimonials , actionLoading);

  // Content state
  const [contentForm, setContentForm] = useState({
    title: '',
    description: ''
  });

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
    name: '',
    role: '',
    rating: 5,
    quote: '',
    avatar: ''
  });

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'avatar' | null>(null);

  // Load data on mount
  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // Update form when content changes
  useEffect(() => {
    if (content) {
      setContentForm({
        title: content.title || '',
        description: content.description || ''
      });
    }
  }, [content]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleContentSave = async () => {
    try {
      await dispatch(updateTestimonialsContent(contentForm)).unwrap();
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleCreateTestimonial = async () => {
    if (!testimonialForm.name || !testimonialForm.role || !testimonialForm.quote || !testimonialForm.avatar) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await dispatch(createTestimonial(testimonialForm)).unwrap();
      toast.success('Testimonial created successfully!');
      resetTestimonialForm();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating testimonial:', error);
    }
  };

  const handleEditTestimonial = (testimonial: TestimonialItem) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating,
      quote: testimonial.quote,
      avatar: testimonial.avatar
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial || !testimonialForm.name || !testimonialForm.role || !testimonialForm.quote || !testimonialForm.avatar) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await dispatch(updateTestimonial({
        id: editingTestimonial.id,
        testimonialData: testimonialForm
      })).unwrap();
      toast.success('Testimonial updated successfully!');
      resetTestimonialForm();
      setIsEditDialogOpen(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await dispatch(deleteTestimonial(id)).unwrap();
      toast.success('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const resetTestimonialForm = () => {
    setTestimonialForm({
      name: '',
      role: '',
      rating: 5,
      quote: '',
      avatar: ''
    });
  };

  const handleDragEnd = async (result: { destination: { index: number; }; source: { index: number; }; }) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    try {
      await dispatch(reorderTestimonials(reorderedItems)).unwrap();
      toast.success('Testimonials reordered successfully!');
    } catch (error) {
      console.error('Error reordering testimonials:', error);
    }
  };

  const handleImageSelect = (imageUrl : CloudinaryImage) => {
    const {secure_url} = imageUrl
    console.log(currentImageField === 'avatar')
    if (currentImageField === 'avatar') {
      setTestimonialForm(prev => ({ ...prev, avatar: secure_url }));
    }
    setIsSelectorOpen(false);
    setCurrentImageField(null);
  };

  const openImageSelector = (field: 'avatar') => {
    setCurrentImageField(field);
    setIsSelectorOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading testimonials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials Manager</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className='bg-gray-200 cursor-pointer' size="sm" onClick={() => dispatch(fetchTestimonials())} disabled={loading}>
             Refresh
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           
          </Button>
           <Button 
                onClick={handleContentSave}
                disabled={actionLoading.content}
                className="text-background cursor-pointer"
              >
                {actionLoading.content ? (
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
          <Card className='py-6'>
            <CardHeader>
              <CardTitle>Section Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Section Title</Label>
                <RichTextEditor
                  value={contentForm.title}
                  onEditorChange={(content) => 
                    setContentForm(prev => ({ ...prev, title: content }))
                  }
                  id="testimonials-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Section Description</Label>
                <RichTextEditor
                  value={contentForm.description}
                  onEditorChange={(content) => 
                    setContentForm(prev => ({ ...prev, description: content }))
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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className='bg-primary text-background cursor-pointer'>
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
                        onChange={(e) => setTestimonialForm(prev => ({ 
                          ...prev, name: e.target.value 
                        }))}
                        placeholder="e.g., Mr. David Chen"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role & Location *</Label>
                      <Input
                        id="role"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm(prev => ({ 
                          ...prev, role: e.target.value 
                        }))}
                        placeholder="e.g., Business Magnate, Singapore"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    <Select
                      value={testimonialForm.rating.toString()}
                      onValueChange={(value) => setTestimonialForm(prev => ({ 
                        ...prev, rating: parseInt(value) 
                      }))}
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
                        setTestimonialForm(prev => ({ ...prev, quote: content }))
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
                        onClick={() => openImageSelector('avatar')}
                      >
                        {testimonialForm.avatar ? 'Change Image' : 'Select Image'}
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
className='cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300'
                    onClick={() => {
                      resetTestimonialForm();
                      setIsCreateDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTestimonial}
                    className='cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300'
                    disabled={actionLoading.create}
                  >
                    {actionLoading.create ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Testimonial'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {testimonials.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No testimonials found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className='bg-primary text-background cursor-pointer'>
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
                    {testimonials.map((testimonial, index) => (
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
                                ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
                                : ''
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
                                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                                    <Badge variant="secondary">{testimonial.role}</Badge>
                                    {renderStars(testimonial.rating)}
                                  </div>
                                  
                                  <div 
                                    className="text-gray-600 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: testimonial.quote }}
                                  />
                                  
                                  <div className="text-sm text-gray-500">
                                    Order: {testimonial.order + 1}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className='bg-gray-200 cursor-pointer'
                                    onClick={() => handleEditTestimonial(testimonial)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" className='cursor-pointer' variant="destructive">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this testimonial? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteTestimonial(testimonial.id)}
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
                  onChange={(e) => setTestimonialForm(prev => ({ 
                    ...prev, name: e.target.value 
                  }))}
                  placeholder="e.g., Mr. David Chen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role & Location *</Label>
                <Input
                  id="edit-role"
                  value={testimonialForm.role}
                  onChange={(e) => setTestimonialForm(prev => ({ 
                    ...prev, role: e.target.value 
                  }))}
                  placeholder="e.g., Business Magnate, Singapore"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <Select
                value={testimonialForm.rating.toString()}
                onValueChange={(value) => setTestimonialForm(prev => ({ 
                  ...prev, rating: parseInt(value) 
                }))}
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
                  setTestimonialForm(prev => ({ ...prev, quote: content }))
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
                  onClick={() => openImageSelector('avatar')}
                >
                  {testimonialForm.avatar ? 'Change Image' : 'Select Image'}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className='cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300'
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
              className='cursor-pointer bg-primary hover:bg-background text-background hover:text-primary transition-colors duration-300'
              disabled={actionLoading.update}
            >
              {actionLoading.update ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Testimonial'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Media Selector */}
      <AdvancedMediaSelector
        isOpen={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onSelect={handleImageSelect}
        mediaType="image"
        title="Select Client Avatar"
        selectedValue={testimonialForm.avatar}
      />
    </div>
  );
};

export default TestimonialsManager;

// components/admin/TestimonialsManager.tsx
// components/admin/TestimonialsManager.tsx
// "use client";

// import React, { useState, useEffect } from 'react';
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { Plus, Edit, Trash2, GripVertical, Star, Save, Loader2, Sparkles, Images } from 'lucide-react';
// import { toast } from 'sonner';
// import RichTextEditor from '@/components/admin/Editor';
// import { AdvancedMediaSelector } from '@/components/admin/AdvancedMediaSelector';

// // Import hooks and fully typed actions/types from your slice
// import {
//   fetchTestimonials,
//   updateTestimonialsContent,
//   createTestimonial,
//   updateTestimonial,
//   deleteTestimonial,
//   reorderTestimonials,
//   selectTestimonials,
//   clearError,
//   TestimonialItem,
//   TestimonialFormData
// } from '@/redux/slices/testimonialsSlice';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// const TestimonialsManager: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const {
//     loading,
//     error,
//     content,
//     testimonials,
//     actionLoading
//   } = useAppSelector(selectTestimonials);

//   // State for forms and dialogs
//   const [contentForm, setContentForm] = useState({ title: '', description: '' });
//   const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
//     name: '', role: '', rating: 5, quote: '', avatar: ''
//   });
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
//   const [isSelectorOpen, setIsSelectorOpen] = useState(false);

//   // Load data on mount and handle state updates from Redux
//   useEffect(() => {
//     dispatch(fetchTestimonials());
//   }, [dispatch]);

//   useEffect(() => {
//     if (content) {
//       setContentForm({ title: content.title || '', description: content.description || '' });
//     }
//   }, [content]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   // --- Action Handlers ---
//   const handleContentSave = async () => {
//     await dispatch(updateTestimonialsContent(contentForm)).unwrap()
//       .then(() => toast.success('Content updated successfully!'))
//       .catch((err) => toast.error(err || 'Failed to update content'));
//   };

//   const handleCreateTestimonial = async () => {
//     if (!testimonialForm.name || !testimonialForm.role || !testimonialForm.quote || !testimonialForm.avatar) {
//       toast.error('Please fill all required fields');
//       return;
//     }
//     await dispatch(createTestimonial(testimonialForm)).unwrap()
//       .then(() => {
//         toast.success('Testimonial created successfully!');
//         resetTestimonialForm();
//         setIsCreateDialogOpen(false);
//       })
//       .catch((err) => toast.error(err || 'Failed to create testimonial'));
//   };

//   const handleEditClick = (testimonial: TestimonialItem) => {
//     setEditingTestimonial(testimonial);
//     setTestimonialForm({
//       name: testimonial.name,
//       role: testimonial.role,
//       rating: testimonial.rating,
//       quote: testimonial.quote,
//       avatar: testimonial.avatar
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateTestimonial = async () => {
//     if (!editingTestimonial) return;
//     await dispatch(updateTestimonial({ id: editingTestimonial.id, testimonialData: testimonialForm })).unwrap()
//       .then(() => {
//         toast.success('Testimonial updated successfully!');
//         resetTestimonialForm();
//         setIsEditDialogOpen(false);
//       })
//       .catch((err) => toast.error(err || 'Failed to update testimonial'));
//   };

//   const handleDeleteTestimonial = async (id: string) => {
//     await dispatch(deleteTestimonial(id)).unwrap()
//       .then(() => toast.success('Testimonial deleted successfully!'))
//       .catch((err) => toast.error(err || 'Failed to delete testimonial'));
//   };

//   const handleDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const items = Array.from(testimonials);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     const reorderedItemsWithOrder = items.map((item, index) => ({ ...item, order: index }));
//     await dispatch(reorderTestimonials(reorderedItemsWithOrder)).unwrap()
//       .then(() => toast.success('Testimonials reordered successfully!'))
//       .catch((err) => toast.error(err || 'Failed to reorder testimonials'));
//   };

//   const handleImageSelect = (media: { secure_url: string }) => {
//     if (media.secure_url) {
//       setTestimonialForm(prev => ({ ...prev, avatar: media.secure_url }));
//     }
//     setIsSelectorOpen(false);
//   };
  
//   const resetTestimonialForm = () => {
//     setTestimonialForm({ name: '', role: '', rating: 5, quote: '', avatar: '' });
//     setEditingTestimonial(null);
//   };

//   // --- UI Render Functions ---
//   const renderStars = (rating: number) => (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         <span className="ml-2">Loading testimonials...</span>
//       </div>
//     );
//   }

//   // Reusable form content for both Create and Edit dialogs
//   const testimonialDialogContent = (
//     <div className="grid gap-4 py-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">Client Name *</Label>
//           <Input id="name" value={testimonialForm.name} onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Mr. David Chen" />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="role">Role & Location *</Label>
//           <Input id="role" value={testimonialForm.role} onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))} placeholder="e.g., Business Magnate, Singapore" />
//         </div>
//       </div>
//       <div className="space-y-2">
//         <Label>Rating *</Label>
//         <Select value={testimonialForm.rating.toString()} onValueChange={(value) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(value) }))}>
//           <SelectTrigger><SelectValue placeholder="Select rating" /></SelectTrigger>
//           <SelectContent>
//             {[5, 4, 3, 2, 1].map((rating) => (
//               <SelectItem key={rating} value={rating.toString()}><div className="flex items-center gap-2">{rating} {renderStars(rating)}</div></SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2">
//         <Label>Testimonial Quote *</Label>
//         <RichTextEditor value={testimonialForm.quote} onEditorChange={(content) => setTestimonialForm(prev => ({ ...prev, quote: content }))} id="testimonial-quote-editor" />
//       </div>
//       <div className="space-y-2">
//         <Label>Client Avatar *</Label>
//         <div className="flex items-center gap-4">
//           {testimonialForm.avatar && <img src={testimonialForm.avatar} alt="Avatar Preview" className="w-16 h-16 rounded-full object-cover border" />}
//           <Button type="button" variant="outline" onClick={() => setIsSelectorOpen(true)}>
//             {testimonialForm.avatar ? 'Change Image' : 'Select Image'}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Testimonials Manager</h1>

//       <Tabs defaultValue="content" className="w-full">
//         <TabsList className="grid w-full h-15 grid-cols-2">
//           <TabsTrigger value="content"><Sparkles className="w-4 h-4 mr-2" />Section Content</TabsTrigger>
//           <TabsTrigger value="testimonials"><Images className="w-4 h-4 mr-2" />Testimonials</TabsTrigger>
//         </TabsList>
        
//         {/* TAB 1: Section Content */}
//         <TabsContent value="content">
//           <Card className='mt-4 py-6'>
//             <CardHeader><CardTitle>Customize Section Header</CardTitle></CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Section Title</Label>
//                 <RichTextEditor value={contentForm.title} onEditorChange={(value) => setContentForm(prev => ({ ...prev, title: value }))} id="testimonials-title-editor" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Section Description</Label>
//                 <RichTextEditor value={contentForm.description} onEditorChange={(value) => setContentForm(prev => ({ ...prev, description: value }))} id="testimonials-desc-editor" />
//               </div>
//               <Button onClick={handleContentSave} disabled={actionLoading.content} className="w-full">
//                 {actionLoading.content ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Content</>}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* TAB 2: Testimonials List */}
//         <TabsContent value="testimonials">
//           <Card className='mt-4 py-6'>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Manage Testimonials</CardTitle>
//               <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//                 <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></DialogTrigger>
//                 <DialogContent className="sm:max-w-[600px]">
//                   <DialogHeader><DialogTitle>Create New Testimonial</DialogTitle></DialogHeader>
//                   {testimonialDialogContent}
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetTestimonialForm(); }}>Cancel</Button>
//                     <Button onClick={handleCreateTestimonial} disabled={actionLoading.create}>
//                       {actionLoading.create ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Testimonial'}
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent>
//               {testimonials.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500 mb-4">No testimonials found.</p>
//                   <Button onClick={() => setIsCreateDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Your First Testimonial</Button>
//                 </div>
//               ) : (
//                 <DragDropContext onDragEnd={handleDragEnd}>
//                   <Droppable droppableId="testimonials">
//                     {(provided) => (
//                       <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
//                         {testimonials.map((testimonial, index) => (
//                           <Draggable key={testimonial.id} draggableId={testimonial.id} index={index}>
//                             {(provided) => (
//                               <div ref={provided.innerRef} {...provided.draggableProps} className="border rounded-lg p-4 flex items-start gap-4 bg-white">
//                                 <div {...provided.dragHandleProps} className="cursor-grab p-2 pt-4"><GripVertical className="w-5 h-5 text-gray-400" /></div>
//                                 <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
//                                 <div className="flex-grow space-y-1">
//                                   <div className="flex items-center gap-4 flex-wrap">
//                                     <h3 className="font-semibold text-lg">{testimonial.name}</h3>
//                                     <Badge variant="secondary">{testimonial.role}</Badge>
//                                   </div>
//                                   {renderStars(testimonial.rating)}
//                                   <div className="text-sm text-gray-600 line-clamp-2" dangerouslySetInnerHTML={{ __html: testimonial.quote }} />
//                                 </div>
//                                 <div className="flex flex-col sm:flex-row items-center gap-2">
//                                   <Button size="icon" variant="outline" onClick={() => handleEditClick(testimonial)}><Edit className="w-4 h-4" /></Button>
//                                   <AlertDialog>
//                                     <AlertDialogTrigger asChild><Button size="icon" variant="destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
//                                     <AlertDialogContent>
//                                       <AlertDialogHeader><AlertDialogTitle>Delete Testimonial?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
//                                       <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDeleteTestimonial(testimonial.id)}>Delete</AlertDialogAction></AlertDialogFooter>
//                                     </AlertDialogContent>
//                                   </AlertDialog>
//                                 </div>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </DragDropContext>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Reusable Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader><DialogTitle>Edit Testimonial</DialogTitle></DialogHeader>
//           {testimonialDialogContent}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetTestimonialForm(); }}>Cancel</Button>
//             <Button onClick={handleUpdateTestimonial} disabled={actionLoading.update}>
//               {actionLoading.update ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : 'Update Testimonial'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
      
//       {/* Reusable Media Selector */}
//       <AdvancedMediaSelector isOpen={isSelectorOpen} onOpenChange={setIsSelectorOpen} onSelect={handleImageSelect} mediaType="image" title="Select Client Avatar" selectedValue={testimonialForm.avatar} />
//     </div>
//   );
// };

// export default TestimonialsManager;