"use client";

import { useState, useEffect, ProfilerProps } from "react";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/redux/slices/projectsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import Editor from "@/components/admin/Editor";
// Fixed import - changed from MediaSelectorButton to MediaMultiSelectButton
import MediaMultiSelectButton from "@/components/admin/MediaMultiSelectButton";
import { useAppDispatch } from "@/redux/hooks";

interface Project {
  _id: string;
  name: string;
  price: string;
  images: string[];
  location: string;
  description: string;
  badge: string;
  category: {
    _id: string;
    name: string;
  };
  categoryName: string;
  isActive: boolean;
  order: number;
}

export default function ProjectsManager() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [] as string[],
    location: "",
    description: "",
    badge: "",
    category: "",
    categoryName: "",
    isActive: true,
    order: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      images: [],
      location: "",
      description: "",
      badge: "",
      category: "",
      categoryName: "",
      isActive: true,
      order: projects.length,
    });
    setEditingProject(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      price: project.price,
      images: project.images,
      location: project.location,
      description: project.description,
      badge: project.badge || "",
      category: project.category._id,
      categoryName: project.categoryName,
      isActive: project.isActive,
      order: project.order,
    });
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategoryObj = categories.find(
        (cat) => cat._id === formData.category
      );

      // Ensure a category was found to avoid errors
      if (!selectedCategoryObj) {
        toast.error("Invalid category selected.");
        setIsSubmitting(false);
        return;
      }

      const projectData = {
        ...formData,
        // Replace the string ID with the full category object
        category: {
          _id: selectedCategoryObj._id,
          name: selectedCategoryObj.name,
        },
        categoryName: selectedCategoryObj.name,
      };

      if (editingProject) {
        // This call will now be correct
        await dispatch(
          updateProject({
            id: editingProject._id,
            data: projectData,
          })
        ).unwrap();
        toast.success("Project updated successfully");
      } else {
        // Create new project - THIS WAS MISSING!
        await dispatch(createProject(projectData)).unwrap();
        toast.success("Project created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editingProject ? "update" : "create"} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesSelect = (selectedImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: selectedImages,
    }));
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="text-background cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectPrice">Price *</Label>
                  <Input
                    id="projectPrice"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., ₹ 4.8 Cr"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectLocation">Location *</Label>
                  <Input
                    id="projectLocation"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectBadge">Badge (Optional)</Label>
                  <Input
                    id="projectBadge"
                    value={formData.badge}
                    onChange={(e) => handleInputChange("badge", e.target.value)}
                    placeholder="e.g., Elora, Featured"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectCategory">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat.isActive)
                        .map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectOrder">Display Order</Label>
                  <Input
                    id="projectOrder"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Images *</Label>
                <MediaMultiSelectButton
                  onImagesSelect={handleImagesSelect}
                  selectedImages={formData.images}
                  multiple={true}
                  label="Select Project Images"
                  mediaType="image"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description *</Label>
                <div className="min-h-[200px]">
                  <Editor
                    value={formData.description}
                    onEditorChange={(content) =>
                      handleInputChange("description", content)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="projectActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label htmlFor="projectActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingProject ? "Updating..." : "Creating..."}
                    </>
                  ) : editingProject ? (
                    "Update Project"
                  ) : (
                    "Create Project"
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
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
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <span className="text-sm font-normal text-muted-foreground">
              {filteredProjects.length} of {projects.length} projects
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {projects.length === 0
                ? "No projects found. Create your first project to get started."
                : "No projects match your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-300">
                  <TableRow >
                    <TableHead className="text-background">Image</TableHead>
                    <TableHead className="text-background">Name</TableHead>
                    <TableHead className="text-background">Category</TableHead>
                    <TableHead className="text-background">Location</TableHead>
                    <TableHead className="text-background">Price</TableHead>
                    <TableHead className="text-background">Status</TableHead>
                    <TableHead className="text-right text-background">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell>
                        <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                          {project.images[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.name}
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
                          <div className="font-medium">{project.name}</div>
                          {project.badge && (
                            <Badge variant="outline" className="text-primary mt-1 text-xs">
                              {project.badge}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{project.categoryName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.location}
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.price}
                      </TableCell>
                      <TableCell>
                        <Badge className="text-background"
                          variant={project.isActive ? "default" : "secondary"}
                        >
                          {project.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-background"
                            onClick={() => openEditDialog(project as any)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(project._id, project.name)
                            }
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
