// components/admin/CategoriesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/redux/slices/categoriesSlice";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useAppDispatch } from "@/redux/hooks";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

export default function CategoriesSection() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: "",
      isActive: true,
      order: categories.length,
    });
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setFormData({
      name: category.name,
      isActive: category.isActive,
      order: category.order,
    });
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory._id,
            data: formData,
          })
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success("Category created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        `Failed to ${editingCategory ? "update" : "create"} category`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order for all items
    items.forEach((item, index) => {
      if (item.order !== index) {
        dispatch(
          updateCategory({
            id: item._id,
            data: { ...item, order: index },
          })
        );
      }
    });
  };

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Categories Management
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="text-background cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-primary">
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter category name"
                    className="text-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryOrder" className='text-primary'>Order</Label>
                  <Input
                    id="categoryOrder"
                    type="number"
                    className='text-gray-300'
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Display order"
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="categoryActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <Label htmlFor="categoryActive" className='text-primary'>Active</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-300 hover:bg-gray-200 cursor-pointer"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-background bg-primary cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingCategory ? "Updating..." : "Creating..."}
                      </>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No categories found. Create your first category to get started.
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Table>
                    <TableHeader className="bg-gray-300">
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead className="text-background">Name</TableHead>
                        <TableHead className="text-background">Slug</TableHead>
                        <TableHead className="text-background">
                          Status
                        </TableHead>
                        <TableHead className="text-background">Order</TableHead>
                        <TableHead className="text-right text-background">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category, index) => (
                        <Draggable
                          key={category._id}
                          draggableId={category._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? "bg-muted" : ""}
                            >
                              <TableCell {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </TableCell>
                              <TableCell className="font-medium">
                                {category.name}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {category.slug}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className="text-background"
                                  variant={
                                    category.isActive ? "default" : "secondary"
                                  }
                                >
                                  {category.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>{category.order}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(category)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(category._id, category.name)
                                    }
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                    </TableBody>
                  </Table>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </CardContent>
    </Card>
  );
}
