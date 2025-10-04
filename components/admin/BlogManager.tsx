// components/admin/BlogManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
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
  Search,
  Image as ImageIcon,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import { fetchBlogs, deleteBlog, Blog } from "@/redux/slices/blogsSlice";
import { fetchBlogCategories } from "@/redux/slices/blogCategoriesSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function BlogManager() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { blogs, loading, pagination } = useSelector(
    (state: RootState) => state.blogs
  );
  const { categories } = useSelector(
    (state: RootState) => state.blogCategories
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success("Blog deleted successfully");
      fetchBlogsData();
      setDeleteDialogId(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete blog");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Blog Manager
            </h1>
            <p className="text-slate-600 font-medium">
              Create and manage your blog content
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push("/admin/blogs/create")}
          className="bg-gradient-to-r cursor-pointer from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="h-4.w-4" />
          <span className="font-medium">Add Blog</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Search className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              Search & Filter Blogs
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px] ring-2 ring-primary/20 cursor-pointer">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="font-poppins">
                <SelectItem value="all" className="cursor-pointer">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id}
                    className="cursor-pointer font-poppins"
                  >
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] ring-2 ring-primary/20 cursor-pointer">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="font-poppins">
                <SelectItem value="all" className="cursor-pointer">
                  All Status
                </SelectItem>
                <SelectItem value="active" className="cursor-pointer">
                  Active
                </SelectItem>
                <SelectItem value="inactive" className="cursor-pointer">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blogs Table */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Blog Library
                </CardTitle>
                <span className="text-sm text-slate-500 font-medium">
                  {pagination.totalCount} total blogs
                </span>
              </div>
            </div>
          </div>
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
              <div className="overflow-x-auto rounded-xl border border-slate-200/60">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700">
                    <TableRow className="border-slate-300/20">
                      <TableHead className="text-white font-semibold">
                        Image
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Title
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Created
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Views
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
                    {blogs.map((blog) => (
                      <TableRow
                        key={blog._id}
                        className="hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40"
                      >
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
                          <Badge variant="outline" className="text-primary">
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
                              className="hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
                              onClick={() =>
                                router.push(`/admin/blogs/edit/${blog._id}`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialogId(blog._id)}
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
            <AlertDialogCancel className="cursor-pointer">
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
    </div>
  );
}
