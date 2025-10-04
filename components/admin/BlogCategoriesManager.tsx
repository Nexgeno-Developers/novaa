"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  ArrowUpDown,
  BookOpen,
  Tags,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchBlogCategories,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  BlogCategory,
} from "@/redux/slices/blogCategoriesSlice";
import { useAppDispatch } from "@/redux/hooks";

export default function BlogCategoriesManager() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.blogCategories
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    isActive: true,
    order: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      isActive: true,
      order: categories.length,
    });
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: BlogCategory) => {
    setFormData({
      title: category.title,
      slug: category.slug,
      description: category.description || "",
      isActive: category.isActive,
      order: category.order,
    });
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a category title");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Please enter a category slug");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await dispatch(
          updateBlogCategory({
            id: editingCategory._id,
            data: formData,
          })
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createBlogCategory(formData)).unwrap();
        toast.success("Category created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(
        error || `Failed to ${editingCategory ? "update" : "create"} category`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBlogCategory(id)).unwrap();
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete category");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug when title changes
    if (field === "title" && !editingCategory) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
            <Tags className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Blog Categories
            </h1>
            <p className="text-slate-600 font-medium">
              Organize and manage your content categories
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto admin-theme">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryTitle" className="text-primary">
                    Category Title *
                  </Label>
                  <Input
                    id="categoryTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter category title"
                    required
                    className="text-black ring-2 ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categorySlug" className="text-primary">
                    Category Slug *
                  </Label>
                  <Input
                    id="categorySlug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="category-slug"
                    required
                    className="text-black ring-2 ring-primary/20"
                  />
                  <p className="text-xs text-gray-200">
                    URL-friendly version of the title (automatically generated)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="categoryDescription" className="text-primary">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of the category"
                    rows={3}
                    className="text-black ring-2 ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryOrder" className="text-primary">
                    Display Order
                  </Label>
                  <Input
                    id="categoryOrder"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    min="0"
                    className="text-black ring-2 ring-primary/20"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="categoryActive"
                    checked={formData.isActive}
                    className="cursor-pointer"
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="categoryActive" className="text-primary">
                    Active
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-300 hover:bg-gray-300/50 text-gray-800 hover:text-black cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-background cursor-pointer"
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

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Search className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              Search Categories
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Category Library
                </CardTitle>
                <span className="text-sm text-slate-500 font-medium">
                  {filteredCategories.length} of {categories.length} categories
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {categories.length === 0
                ? "No categories found. Create your first category to get started."
                : "No categories match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200/60">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700">
                  <TableRow className="border-slate-300/20">
                    <TableHead className="text-white font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Slug
                    </TableHead>
                    <TableHead className="text-background font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Order
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-white font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow
                      key={category._id}
                      className="hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40"
                    >
                      <TableCell>
                        <div className="font-medium">{category.title}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs">
                        <div className="truncate">
                          {category.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                          {category.order}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="text-background"
                          variant={category.isActive ? "default" : "secondary"}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
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
                            onClick={() => setDeleteDialogId(category._id)}
                            className="hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
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
              blog category and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className=" cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogId && handleDelete(deleteDialogId)}
              className="bg-destructive text-background cursor-pointer hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
