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
import { Loader2, X } from "lucide-react";
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
    items: section?.content?.items as CategoryItems || {} as CategoryItems,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );
  const { projects, loading: projectsLoading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
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

  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: formData });
    }
  }, [formData]);

  const handleInputChange = (field: string, value: any) => {
    userHasInteractedRef.current = true;
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onChange && initialDataSetRef.current) {
      onChange({ content: updatedData });
    }
  };

  const categoryProjects = selectedCategory
    ? projects.filter(
        (project) =>
          project.category._id === selectedCategory && project.isActive
      )
    : [];

  const selectedProjects = selectedCategory
    ? formData.items[selectedCategory] || []
    : [];

  const handleProjectToggle = (project: any, isSelected: boolean) => {
    userHasInteractedRef.current = true;
    const updatedItems = { ...formData.items };

    if (!updatedItems[selectedCategory]) {
      updatedItems[selectedCategory] = [];
    }

    if (isSelected) {
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
      updatedItems[selectedCategory] = updatedItems[selectedCategory].filter(
        (p) => p._id !== project._id
      );
    }

    if (updatedItems[selectedCategory].length === 0) {
      delete updatedItems[selectedCategory];
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

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
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const totalSelectedProjects = Object.values(formData.items).reduce(
    (total, categoryProjects) => total + categoryProjects.length,
    0
  );

  const sectionContent = (
    <div className="space-y-4">
      {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Section title"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={categoriesLoading}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="admin-theme">
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
            <div className="flex flex-col items-center space-x-2">
              {/* <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              /> */}
              <Label htmlFor="isActive">Active</Label>
              <Badge variant="outline">
                Total: {totalSelectedProjects}
              </Badge>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <div className="min-h-[150px]">
              <Editor
                value={formData.description}
                onEditorChange={(content) =>
                  handleInputChange("description", content)
                }
              />
            </div>
          </div>

      {/* Project Selection */}
      {selectedCategory && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm">
                Projects in {categories.find((c) => c._id === selectedCategory)?.name}
              </CardTitle>
              <Badge variant="secondary">
                {selectedProjects.length} selected (max 9)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : categoryProjects.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No projects found
              </div>
            ) : (
              <ScrollArea className="h-40 w-full">
                <div className="space-y-2">
                  {categoryProjects.map((project) => {
                    const isSelected = selectedProjects.some(
                      (p) => p._id === project._id
                    );
                    return (
                      <div
                        key={project._id}
                        className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleProjectToggle(project, checked as boolean)
                          }
                        />
                        {project.images?.[0] && (
                          <img
                            src={project.images[0]}
                            alt={project.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {project.price} • {project.location}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selected Projects */}
      {totalSelectedProjects > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Projects</CardTitle>
          </CardHeader> 
          <CardContent>
            <div className="space-y-3">
              {Object.entries(formData.items).map(([categoryId, projects]) => {
                const category = categories.find((c) => c._id === categoryId);
                if (!category) return null;

                return (
                  <div key={categoryId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">{category.name}</Label>
                      <Badge variant="outline" className="text-xs">
                        {projects.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                      {projects.map((project) => (
                        <div
                          key={project._id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {project.images?.[0] && (
                              <img
                                src={project.images[0]}
                                alt={project.name}
                                className="w-6 h-6 object-cover rounded"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">
                                {project.name}
                              </p>
                              <p className="text-muted-foreground truncate">
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
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
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

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange || (() => {})}
      showSaveButton={showSaveButton}
      title="Curated Collection"
      description="Manage curated collection content and projects"
    >
      {sectionContent}
    </BaseSectionManager>
  );
}