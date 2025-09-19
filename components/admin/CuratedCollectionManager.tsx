"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Plus,
  X,
  Image as ImageIcon,
  SparklesIcon,
} from "lucide-react";
import { RootState } from "@/redux";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import { fetchProjects } from "@/redux/slices/projectsSlice";
import Editor from "@/components/admin/Editor";
import BaseSectionManager from "./BaseSectionManager";
import { useAppDispatch } from "@/redux/hooks";

interface CuratedCollectionManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}

interface SelectedProject {
  _id: string;
  name: string;
  price: string;
  images: string[];
  location: string;
  description: string;
  badge?: string;
  category: {
    _id: string;
    name: string;
  };
}

interface CategoryItems {
  [categoryId: string]: SelectedProject[];
}

export default function CuratedCollectionManager({
  section,
  onChange,
  showSaveButton = true,
}: CuratedCollectionManagerProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: section?.content?.title || "",
    description: section?.content?.description || "",
    isActive: section?.content?.isActive || true,
    items: section?.content?.items as CategoryItems || {} as CategoryItems, // Changed from array to object with category mapping
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Use refs to track initialization state
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  // Get categories and projects from Redux
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const { projects, loading: projectsLoading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    // Load related data only once
    if (!isInitializedRef.current) {
      dispatch(fetchCategories());
      dispatch(fetchProjects());
      isInitializedRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = {
        title: section.content.title || "",
        description: section.content.description || "",
        isActive: section.content.isActive ?? true,
        items: section.content.items || {},
      };

      setFormData(sectionData);
      initialDataSetRef.current = true;
    }
  }, [section]);

  // Only notify parent of changes after user interaction
  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: formData });
    }
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    // Mark that user has interacted with the form
    userHasInteractedRef.current = true;

    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);

    // Call onChange immediately if user has interacted and data is initialized
    if (onChange && initialDataSetRef.current) {
      onChange({ content: updatedData });
    }
  };

  // Get projects for selected category
  const categoryProjects = selectedCategory
    ? projects.filter(
        (project) =>
          project.category._id === selectedCategory && project.isActive
      )
    : [];

  // Get selected projects for current category
  const selectedProjects = selectedCategory
    ? formData.items[selectedCategory] || []
    : [];

  // Handle project selection
  const handleProjectToggle = (project: any, isSelected: boolean) => {
    userHasInteractedRef.current = true;

    const updatedItems = { ...formData.items };

    if (!updatedItems[selectedCategory]) {
      updatedItems[selectedCategory] = [];
    }

    if (isSelected) {
      // Add project
      updatedItems[selectedCategory] = [
        ...updatedItems[selectedCategory],
        {
          _id: project._id,
          name: project.name,
          price: project.price,
          images: project.images,
          location: project.location,
          description: project.description,
          badge: project.badge,
          category: project.category,
        },
      ];
    } else {
      // Remove project
      updatedItems[selectedCategory] = updatedItems[selectedCategory].filter(
        (p) => p._id !== project._id
      );
    }

    // Clean up empty categories
    if (updatedItems[selectedCategory].length === 0) {
      delete updatedItems[selectedCategory];
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Remove project from category
  const handleRemoveProject = (categoryId: string, projectId: string) => {
    userHasInteractedRef.current = true;

    const updatedItems = { ...formData.items };
    if (updatedItems[categoryId]) {
      updatedItems[categoryId] = updatedItems[categoryId].filter(
        (p) => p._id !== projectId
      );

      if (updatedItems[categoryId].length === 0) {
        delete updatedItems[categoryId];
      }
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Get total selected projects count
  const totalSelectedProjects = Object.values(formData.items).reduce(
    (total, categoryProjects) => total + categoryProjects.length,
    0
  );

  const sectionContent = (
    <div className="space-y-6">
      {/* Main Content Settings */}
      <Card className="pb-6 bg-purple-50/30 ring-2 ring-primary/20">
        <CardHeader className="flex items-center bg-gradient-to-r py-6 from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <SparklesIcon className="h-5 w-5 text-blue-600" />

          <CardTitle className="text-gray-900">Content Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-primary/90">
                  Section Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter section title"
                  className="bg-gray-50/50"
                />
                <p className="text-xs text-muted-foreground">
                  You can use HTML tags for styling (e.g., &lt;span
                  class="text-black"&gt;)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Section Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-primary/90">
                Description
              </Label>
              <div className="min-h-[200px]">
                <Editor
                  value={formData.description}
                  onEditorChange={(content) =>
                    handleInputChange("description", content)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Selection */}
      <Card className="pb-6 bg-gray-50/50 ring-2 ring-primary/20">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2 py-6">
          <CardTitle className="text-primary/90">Project Selection</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select projects to display in the curated collection by category
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-primary/90">
                  Categories
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="admin-theme">
                    {categories
                      .filter((cat) => cat.isActive)
                      .map((category) => (
                        <SelectItem
                          key={category._id}
                          value={category._id}
                          className="cursor-pointer"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm text-primary/90">
                  Total Selected: {totalSelectedProjects} projects
                </Badge>
              </div>
            </div>

            {/* Projects Selection for Selected Category */}
            {selectedCategory && (
              <div className="space-y-4 admin-theme">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-primary/90">
                    Projects in{" "}
                    {categories.find((c) => c._id === selectedCategory)?.name}
                  </Label>
                  <Badge variant="secondary">
                    {selectedProjects.length} selected
                  </Badge>
                </div>

                {projectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading projects...</span>
                  </div>
                ) : categoryProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active projects found in this category
                  </div>
                ) : (
                  <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-gray-50/50  ring-2 ring-primary/20">
                    <div className="space-y-3">
                      {categoryProjects.map((project) => {
                        const isSelected = selectedProjects.some(
                          (p) => p._id === project._id
                        );

                        return (
                          <div
                            key={project._id}
                            className="flex items-start space-x-3 p-3 border rounded-lg bg-purple-50/30 hover:bg-purple-50/50"
                          >
                            <Checkbox
                              checked={isSelected}
                              className="cursor-pointer"
                              onCheckedChange={(checked) =>
                                handleProjectToggle(project, checked as boolean)
                              }
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium truncate">
                                    {project.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {project.location}
                                  </p>
                                  <p className="text-xs font-medium text-primary">
                                    {project.price}
                                  </p>
                                </div>

                                {project.images &&
                                  project.images.length > 0 && (
                                    <div className="flex-shrink-0 ml-3">
                                      <img
                                        src={project.images[0]}
                                        alt={project.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    </div>
                                  )}
                              </div>

                              {project.badge && (
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1 text-primary"
                                >
                                  {project.badge}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Projects Summary */}
      {totalSelectedProjects > 0 && (
        <Card className="pb-6 admin-theme ring-2 ring-primary/20">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2 py-6">
            <CardTitle className="text-primary/90">
              Selected Projects Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Review all selected projects across categories
            </p>
            
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive pb-2">
              You can only select max 9 projects in each category to show on
              curated collection
            </p>
            <div className="space-y-4">
              {Object.entries(formData.items).map(([categoryId, projects]) => {
                const category = categories.find((c) => c._id === categoryId);
                if (!category) return null;

                return (
                  <div key={categoryId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-primary/90">
                        {category.name}
                      </h4>
                      <Badge variant="secondary" className="text-primary/90">
                        {projects.length} project
                        {projects.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {project.images && project.images.length > 0 && (
                              <img
                                src={project.images[0]}
                                alt={project.name}
                                className="w-8 h-8 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate">
                                {project.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {project.price}
                              </p>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveProject(categoryId, project._id)
                            }
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Only render within BaseSectionManager for global save mode
  return (
    <BaseSectionManager
      section={section}
      onChange={onChange || (() => {})}
      showSaveButton={showSaveButton}
      title="Curated Collection"
      description="Manage the curated collection section content, categories, and project overview."
    >
      {sectionContent}
    </BaseSectionManager>
  );
}