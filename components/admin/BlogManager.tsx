// components/admin/BlogManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Image as ImageIcon,
  Calendar,
  Eye,
  Check,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  Blog,
} from "@/redux/slices/blogsSlice";
import {
  fetchBlogCategories,
  BlogCategory,
} from "@/redux/slices/blogCategoriesSlice";
import { useAppDispatch } from "@/redux/hooks";
import Editor from "@/components/admin/Editor";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import { cn } from "@/lib/utils";

export default function BlogManager() {
  const dispatch = useAppDispatch();
  const { blogs, loading, error, pagination } = useSelector(
    (state: RootState) => state.blogs
  );
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    image: "",
    category: "",
    categoryName: "",
    isActive: true,
    order: 0,
    tags: [] as string[],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [] as string[],
    },
    author: {
      name: "NOVAA Admin",
      avatar: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  useEffect(() => {
    fetchBlogsData();
  }, [currentPage, selectedCategory, statusFilter, searchTerm]);

  const fetchBlogsData = useCallback(() => {
    dispatch(
      fetchBlogs({
        page: currentPage,
        limit: 10,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      })
    );
  }, [dispatch, currentPage, selectedCategory, statusFilter, searchTerm]);

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
      content: "",
      image: "",
      category: "",
      categoryName: "",
      isActive: true,
      order: blogs.length,
      tags: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
      author: {
        name: "NOVAA Admin",
        avatar: "",
      },
    });
    setEditingBlog(null);
    setTagInput("");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (blog: Blog) => {
  setFormData({
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    content: blog.content,
    image: blog.image,
    category: blog.category._id,
    categoryName: blog.categoryName,
    isActive: blog.isActive,
    order: blog.order,
    tags: blog.tags || [],
    seo: {
      metaTitle: blog.seo?.metaTitle || "",
      metaDescription: blog.seo?.metaDescription || "",
      keywords: blog.seo?.keywords || [],
    },
    author: blog.author || {
      name: "NOVAA Admin",
      avatar: "",
    },
  });
  setEditingBlog(blog);
  setIsDialogOpen(true);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Please enter a blog slug");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a blog description");
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Please add blog content");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!formData.image) {
      toast.error("Please select a blog image");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategoryObj = categories.find(
        (cat) => cat._id === formData.category
      );

      if (!selectedCategoryObj) {
        toast.error("Invalid category selected.");
        setIsSubmitting(false);
        return;
      }

      const blogData = {
        ...formData,
        category: formData.category,
        categoryName: selectedCategoryObj.title,
      };

      if (editingBlog) {
        await dispatch(
          updateBlog({
            id: editingBlog._id,
            data: blogData,
          })
        ).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await dispatch(createBlog(blogData)).unwrap();
        toast.success("Blog created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchBlogsData();
    } catch (error: any) {
      toast.error(
        error || `Failed to ${editingBlog ? "update" : "create"} blog`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        toast.success("Blog deleted successfully");
        fetchBlogsData();
      } catch (error: any) {
        toast.error(error || "Failed to delete blog");
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug when title changes
    if (field === "title" && !editingBlog) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
        seo: {
          ...prev.seo,
          metaTitle: value,
        },
      }));
    }
  };

const handleNestedInputChange = (
  parent: string,
  field: string,
  value: any
) => {
  setFormData((prev) => ({
    ...prev,
    [parent]: {
      ...(prev[parent as keyof typeof prev] as object),
      [field]: value,
    },
  }));
};

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeywordAdd = () => {
    if (tagInput.trim() && !formData.seo.keywords.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, tagInput.trim()],
        },
      }));
      setTagInput("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) && cat.isActive
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="text-background cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingBlog ? "Edit Blog" : "Add New Blog"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blogTitle" className="text-primary">
                    Blog Title *
                  </Label>
                  <Input
                    id="blogTitle"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter blog title"
                    className="text-gray-300"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogSlug" className="text-primary">
                    Blog Slug *
                  </Label>
                  <Input
                    id="blogSlug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="blog-slug"
                    className="text-gray-300"
                    required
                  />
                  <p className="text-xs text-gray-300">
                    URL-friendly version of the title
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="blogDescription" className="text-primary">
                    Blog Description *
                  </Label>
                  <Textarea
                    id="blogDescription"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of the blog (will be shown in blog list)"
                    className="text-gray-300"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary">Category *</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className="w-full justify-between text-gray-300"
                      >
                        {formData.category
                          ? categories.find(
                              (cat) => cat._id === formData.category
                            )?.title
                          : "Select category..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories
                            .filter((cat) => cat.isActive)
                            .map((category) => (
                              <CommandItem
                                className="text-background"
                                key={category._id}
                                value={category.title}
                                onSelect={() => {
                                  handleInputChange("category", category._id);
                                  setCategoryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.category === category._id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {category.title}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogOrder" className="text-primary">
                    Display Order
                  </Label>
                  <Input
                    id="blogOrder"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    className="text-gray-300"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <MediaSelectButton
                  onSelect={handleImageSelect}
                  value={formData.image}
                  label="Select Blog Image"
                  mediaType="image"
                />
                {/* {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Selected blog image"
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )} */}
              </div>

              <div className="space-y-2">
                <Label className="text-primary">Blog Content *</Label>
                <div className="min-h-[300px]">
                  <Editor
                    value={formData.content}
                    onEditorChange={(content) =>
                      handleInputChange("content", content)
                    }
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2">
                <Label className="text-primary">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="text-gray-300 mt-[2px]"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    size="lg"
                    className="text-background"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* SEO Section */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-primary">
                  SEO Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle" className="text-primary">
                      Meta Title
                    </Label>
                    <Input
                      id="metaTitle"
                      value={formData.seo.metaTitle}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "seo",
                          "metaTitle",
                          e.target.value
                        )
                      }
                      className="text-gray-300"
                      placeholder="SEO title for search engines"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorName" className="text-primary">
                      Author Name
                    </Label>
                    <Input
                      id="authorName"
                      value={formData.author.name}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "author",
                          "name",
                          e.target.value
                        )
                      }
                      className="text-gray-300"
                      placeholder="Author name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="metaDescription" className="text-primary">
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.seo.metaDescription}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "seo",
                          "metaDescription",
                          e.target.value
                        )
                      }
                      className="text-gray-300"
                      placeholder="SEO description for search engines"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="blogActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label htmlFor="blogActive" className="text-primary">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-background cursor-pointer bg-gray-200"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="text-background cursor-pointer">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingBlog ? "Updating..." : "Creating..."}
                    </>
                  ) : editingBlog ? (
                    "Update Blog"
                  ) : (
                    "Create Blog"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="py-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Blogs
            <span className="text-sm font-normal text-muted-foreground">
              {pagination.totalCount} total blogs
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {pagination.totalCount === 0
                ? "No blogs found. Create your first blog to get started."
                : "No blogs match your filters."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-300">
                    <TableRow>
                      <TableHead className="text-background">Image</TableHead>
                      <TableHead className="text-background">Title</TableHead>
                      <TableHead className="text-background">
                        Category
                      </TableHead>
                      <TableHead className="text-background">Created</TableHead>
                      <TableHead className="text-background">Views</TableHead>
                      <TableHead className="text-background">Status</TableHead>
                      <TableHead className="text-right text-background">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                            {blog.image ? (
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium line-clamp-2 max-w-xs">
                              {blog.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {blog.readTime}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-background">
                            {blog.categoryName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(blog.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            {blog.views || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="text-background"
                            variant={blog.isActive ? "default" : "secondary"}
                          >
                            {blog.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-background"
                              onClick={() => openEditDialog(blog)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(blog._id, blog.title)}
                              className="text-destructive hover:text-destructive"
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={!pagination.hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
