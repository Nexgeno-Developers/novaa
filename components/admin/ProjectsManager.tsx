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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
  RefreshCw,
  AlertCircle,
  Building2,
  Home,
  Copy,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux";
import { fetchProjects, deleteProject, cloneProject } from "@/redux/slices/projectsSlice";
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

  const handleClone = async (id: string) => {
    try {
      const result = await dispatch(cloneProject(id)).unwrap();
      toast.success(`Project cloned as "${result.name}"`);
    } catch (error) {
      toast.error("Failed to clone project");
    }
  };

  const handleRefresh = () => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Project Portfolio
            </h1>
            <p className="text-slate-600 font-medium">
              Manage your real estate ventures and property listings
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="bg-primary/90 text-white border-slate-200/60 hover:bg-primary/80 hover:shadow-sm transition-all duration-200 cursor-pointer"
            disabled={loading || categoriesLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading || categoriesLoading ? "animate-spin" : ""
              }`}
            />
            <span className="font-medium">Refresh</span>
          </Button>
          <Button
            onClick={handleCreateNew}
            size="sm"
            className="bg-gradient-to-r cursor-pointer from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Add Project</span>
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

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
              <Search className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              Search & Filter Projects
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="relative col-span-12 sm:col-span-8">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200"
                />
              </div>
              <div className="col-span-12 sm:col-span-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200 cursor-pointer">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Project Inventory
                </CardTitle>
                <span className="text-sm text-slate-500 font-medium">
                  {filteredProjects.length} of {projects.length} projects
                </span>
              </div>
            </div>
          </div>
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
              <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-200/60">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700">
                    <TableRow className="border-slate-300/20">
                      <TableHead className="text-white font-semibold">
                        Image
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Location
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Price
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
                    {filteredProjects.map((project) => (
                      <TableRow
                        key={project._id}
                        className="hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40"
                      >
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
                              className="hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
                              onClick={() => handleEdit(project._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogId(project._id)}
                              className="hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-slate-200 transition-all duration-200 cursor-pointer"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="admin-theme">
                                <DropdownMenuItem
                                  onClick={() => handleClone(project._id)}
                                  className="cursor-pointer"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Clone Project
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                    className="p-4 bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300"
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
                              className="hover:bg-emerald-500 hover:text-white transition-all duration-200 h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogId(project._id)}
                              className="hover:bg-red-500 hover:text-white transition-all duration-200 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-slate-200 transition-all duration-200 h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="admin-theme">
                                <DropdownMenuItem
                                  onClick={() => handleClone(project._id)}
                                  className="cursor-pointer"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Clone Project
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
              project and remove it from our servers.
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