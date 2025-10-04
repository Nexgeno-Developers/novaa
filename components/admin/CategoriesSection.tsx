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
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  GripVertical,
  Tags,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  optimisticReorder,
} from "@/redux/slices/categoriesSlice";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useAppDispatch } from "@/redux/hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleDragEnd = async (result: any) => {
    console.log("🎯 Drag ended:", result);

    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    console.log("📦 Creating reordered array...");

    const reorderedCategories = Array.from(categories);
    const [movedItem] = reorderedCategories.splice(sourceIndex, 1);
    reorderedCategories.splice(destinationIndex, 0, movedItem);

    const updatedCategories = reorderedCategories.map((item, index) => ({
      ...item,
      order: index,
    }));

    console.log("✅ Dispatching optimistic update...");
    dispatch(optimisticReorder(updatedCategories));

    try {
      console.log("🚀 Calling reorderCategories...");
      await dispatch(reorderCategories(updatedCategories)).unwrap();
      toast.success("Categories reordered successfully");
    } catch (error) {
      console.error("❌ Reorder failed:", error);
      toast.error("Failed to save category order");
      dispatch(fetchCategories());
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                Project Categories
              </CardTitle>
              <p className="text-slate-600 font-medium text-sm">
                Manage project categories and organize your portfolio
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Add Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl admin-theme">
              <DialogHeader>
                <DialogTitle className="text-primary">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-primary ">
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter category name"
                    className="text-gray-900"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryOrder" className="text-primary">
                    Order
                  </Label>
                  <Input
                    id="categoryOrder"
                    type="number"
                    className="text-gray-900"
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
                  <Label htmlFor="categoryActive" className="text-primary">
                    Active
                  </Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-300 hover:bg-gray-300/50 hover:text-primary cursor-pointer"
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
        </div>
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
                    <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700">
                      <TableRow className="border-slate-300/20">
                        <TableHead className="w-8"></TableHead>
                        <TableHead className="text-white font-semibold">
                          Name
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Slug
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          URL
                        </TableHead>
                        <TableHead className="text-white font-semibold">
                          Order
                        </TableHead>
                        <TableHead className="text-right text-white font-semibold">
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
                              className={`hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40 ${
                                snapshot.isDragging
                                  ? "bg-slate-100/80 shadow-lg"
                                  : ""
                              }`}
                            >
                              <TableCell {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </TableCell>
                              <TableCell className="font-semibold text-slate-800 py-4">
                                {category.name}
                              </TableCell>
                              <TableCell className="text-slate-500 py-4">
                                <code className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono border border-indigo-200/50">
                                  {category.slug}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`px-3 py-1 font-medium ${
                                    category.isActive
                                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-700 border border-slate-200"
                                  }`}
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
                                    className="hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
                                    onClick={() => openEditDialog(category)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setDeleteDialogId(category._id)
                                    }
                                    className="hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
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
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogId}
        onOpenChange={() => setDeleteDialogId(null)}
      >
        <AlertDialogContent className="admin-theme">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project category and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogId && handleDelete(deleteDialogId)}
              className="bg-destructive text-foreground cursor-pointer hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
