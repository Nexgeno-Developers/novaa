"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux";
import { fetchProjects, deleteProject } from "@/redux/slices/projectsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
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

interface InitialData {
  projects: Project[];
  categories: Array<{
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
    order: number;
  }>;
}

interface ProjectsManagerProps {
  initialData?: InitialData;
}

export default function ProjectsManager({ initialData }: ProjectsManagerProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state: RootState) => state.categories);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // If we have initial data, use it to populate the store
    if (initialData) {
      dispatch({
        type: "adminProjects/fetchProjects/fulfilled",
        payload: initialData.projects,
      });
      dispatch({
        type: "adminCategories/fetchCategories/fulfilled",
        payload: initialData.categories,
      });
    } else {
      // Simple, efficient data loading without retry logic
      dispatch(fetchProjects());
      dispatch(fetchCategories());
    }
  }, [dispatch, initialData]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateNew = () => {
    router.push("/admin/projects/create");
  };

  const handleEdit = (projectId: string) => {
    router.push(`/admin/projects/edit/${projectId}`);
  };

  const handleRefresh = () => {
    // Simple refresh without await - let Redux handle the loading states
    dispatch(fetchProjects());
    dispatch(fetchCategories());
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Enhanced for mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary/90 truncate">
            Projects Manager
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 hidden sm:block">
            Manage your real estate projects and listings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-primary border-primary/20 hover:bg-primary/10 cursor-pointer"
            disabled={loading || categoriesLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading || categoriesLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleCreateNew}
            size="sm"
            className="w-full sm:w-auto text-background cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {(error || categoriesError) && (
        <Card className="py-4 bg-destructive/10 border-destructive/20">
          <CardContent className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error || categoriesError}</span>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="ml-auto text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters - Enhanced for mobile */}
      <Card className="py-4 sm:py-6 bg-sidebar ring-2 ring-primary/20">
        <CardContent className="font-poppins">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 ring-2 ring-primary/20"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px] ring-2 ring-primary/20 cursor-pointer">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="admin-theme">
                <SelectItem value="all" className="cursor-pointer">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
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
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="py-6 bg-sidebar ring-2 ring-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <span className="text-sm font-normal text-muted-foreground">
              {filteredProjects.length} of {projects.length} projects
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || categoriesLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <div className="text-center">
                <div>Loading Projects....</div>
                {categoriesLoading && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Loading categories...
                  </div>
                )}
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {projects.length === 0
                ? "No projects found. Create your first project to get started."
                : "No projects match your filters."}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-primary/90">
                    <TableRow>
                      <TableHead className="text-background">Image</TableHead>
                      <TableHead className="text-background">Name</TableHead>
                      <TableHead className="text-background">
                        Category
                      </TableHead>
                      <TableHead className="text-background">
                        Location
                      </TableHead>
                      <TableHead className="text-background">Price</TableHead>
                      <TableHead className="text-background">Status</TableHead>
                      <TableHead className="text-right text-background">
                        Actions
                      </TableHead>
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
                              <Badge
                                variant="outline"
                                className="text-primary mt-1 text-xs"
                              >
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
                          <Badge
                            className="text-background"
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
                              className="text-primary hover:text-primary/90 cursor-pointer"
                              onClick={() => handleEdit(project._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogId(project._id)}
                              className="text-destructive hover:text-destructive cursor-pointer"
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

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredProjects.map((project) => (
                  <Card
                    key={project._id}
                    className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-900 truncate">
                              {project.name}
                            </h3>
                            <p className="text-sm text-slate-600 truncate">
                              {project.location}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {project.categoryName}
                              </Badge>
                              <Badge
                                variant={
                                  project.isActive ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {project.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-slate-900 mt-1">
                              {project.price}
                            </p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(project._id)}
                              className="text-primary hover:text-primary/90 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogId(project._id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
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
              blog and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-50 hover:text-primary cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogId && handleDelete(deleteDialogId)}
              className="bg-destructive text-white cursor-pointer hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
