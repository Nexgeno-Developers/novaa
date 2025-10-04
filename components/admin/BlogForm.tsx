// components/admin/BlogForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import { createBlog, updateBlog, Blog } from "@/redux/slices/blogsSlice";
import { fetchBlogCategories } from "@/redux/slices/blogCategoriesSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Editor from "@/components/admin/Editor";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import { cn } from "@/lib/utils";

interface BlogFormProps {
  blog?: Blog | null;
  isEdit?: boolean;
}

export default function BlogForm({ blog, isEdit = false }: BlogFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

  useEffect(() => {
    dispatch(fetchBlogCategories());
  }, [dispatch]);

  useEffect(() => {
    if (blog && isEdit) {
      setFormData({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        content: blog.content,
        image: blog.image,
        category:
          typeof blog.category === "object" ? blog.category._id : blog.category,
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
    }
  }, [blog, isEdit]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "title" && !isEdit) {
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

      if (isEdit && blog) {
        await dispatch(
          updateBlog({
            id: blog._id,
            data: blogData,
          })
        ).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await dispatch(createBlog(blogData)).unwrap();
        toast.success("Blog created successfully");
      }
      router.push("/admin/blogs");
    } catch (error: any) {
      toast.error(error || `Failed to ${isEdit ? "update" : "create"} blog`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/blogs")}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
        <h1 className="text-3xl font-bold text-primary/90">
          {isEdit ? "Edit Blog" : "Create New Blog"}
        </h1>
      </div>

      <Card className="bg-sidebar ring-2 ring-primary/20">
        <CardContent className="pt-6">
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
                  className="text-gray-900"
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
                  className="text-gray-900"
                  required
                />
                <p className="text-xs text-gray-900">
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
                  className="text-gray-900"
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
                      className="w-full justify-between text-gray-900"
                    >
                      {formData.category
                        ? categories.find(
                            (cat) => cat._id === formData.category
                          )?.title
                        : "Select category..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 admin-theme">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories
                          .filter((cat) => cat.isActive)
                          .map((category) => (
                            <CommandItem
                              className="text-primary"
                              key={category._id}
                              value={category.title}
                              onSelect={() => {
                                handleInputChange("category", category._id);
                                setCategoryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary/90",
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
                  className="text-gray-900"
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
            </div>

            <div className="space-y-2">
              <Label className="text-primary">Blog Content *</Label>
              <div>
                <Editor
                  value={formData.content}
                  onEditorChange={(content) =>
                    handleInputChange("content", content)
                  }
                  height={500}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="text-gray-900 mt-[2px]"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="lg"
                  className="text-background cursor-pointer"
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
                    className="text-gray-900"
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
                      handleNestedInputChange("author", "name", e.target.value)
                    }
                    className="text-gray-900"
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
                    className="text-gray-900"
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
              <Label htmlFor="blogActive" className="text-primary">
                Active
              </Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blogs")}
                className="text-background hover:text-primary hover:bg-gray-100 cursor-pointer bg-gray-400"
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
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : isEdit ? (
                  "Update Blog"
                ) : (
                  "Create Blog"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
