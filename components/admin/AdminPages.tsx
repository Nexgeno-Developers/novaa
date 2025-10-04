"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MoreVertical,
  Edit,
  Eye,
  Filter,
  Plus,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  fetchPages,
  setSearchTerm,
  setStatusFilter,
  selectFilteredPages,
  selectPagesLoading,
  selectSearchTerm,
} from "@/redux/slices/pageSlice";
import type { AppDispatch, RootState } from "@/redux";

export default function AdminPagesList() {
  const dispatch = useDispatch<AppDispatch>();
  const pages = useSelector(selectFilteredPages);
  const loading = useSelector(selectPagesLoading);
  const searchTerm = useSelector(selectSearchTerm);

  useEffect(() => {
    dispatch(fetchPages());
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleStatusFilterChange = (value: string) => {
    dispatch(setStatusFilter(value as "all" | "active" | "inactive"));
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Pages Hub
            </h1>
            <p className="text-slate-600 font-medium">
              Manage website pages and their content sections
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Search className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              Search & Filter Pages
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200"
              />
            </div>
            <Select defaultValue="all" onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[180px] bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200 cursor-pointer">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="admin-theme">
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

      {/* Pages Table */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Website Pages
                </CardTitle>
                <span className="text-sm text-slate-500 font-medium">
                  {pages.length} total pages
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">
                Loading pages...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200/60">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700">
                  <TableRow className="border-slate-300/20">
                    <TableHead className="text-white font-semibold">
                      Sr. No.
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Page
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="w-[100px] text-white font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page, index) => (
                    <TableRow
                      key={page._id}
                      className="hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{page.title}</div>
                          {/* <div className="text-sm text-muted-foreground">/{page.slug}</div> */}
                          {/* {page.description && (
                          <div className="text-sm text-muted-foreground mt-1">{page.description}</div>
                        )} */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 font-medium ${
                            page.status === "active"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {page.status}
                        </Badge>
                      </TableCell>
                      {/* <TableCell className="text-muted-foreground">
                      {formatDate(page.updatedAt)}
                    </TableCell> */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
                              size="sm"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="admin-theme"
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/pages/${page.slug}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2 hover:text-white" />
                                Manage Sections
                              </Link>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Page
                          </DropdownMenuItem> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && pages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2">
                No pages found
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first page"}
              </p>
              {!searchTerm && (
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Create Your First Page</span>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
