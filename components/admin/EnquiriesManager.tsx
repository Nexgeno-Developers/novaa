"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux";
import {
  fetchEnquiries,
  deleteEnquiry,
  updateEnquiry,
  setFilters,
  clearError,
  Enquiry,
} from "@/redux/slices/enquirySlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Calendar,
  User,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { EnquiryUpdateData } from "@/redux/slices/enquirySlice";

const EnquiriesManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { enquiries, statusSummary, pagination, filters, loading, error } =
    useSelector((state: RootState) => state.enquiry);

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [editingEnquiry, setEditingEnquiry] = useState<{
    id: string;
    status: string;
    priority: string;
    notes: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchEnquiries(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status, page: 1 }));
  };

  const handlePriorityFilter = (priority: string) => {
    dispatch(setFilters({ priority, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleViewDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDetailDialogOpen(true);
  };

  const handleEditEnquiry = (enquiry: Enquiry) => {
    setEditingEnquiry({
      id: enquiry._id,
      status: enquiry.status,
      priority: enquiry.priority,
      notes: enquiry.notes || "",
    });
  };

  const handleUpdateEnquiry = async (editingEnquiry: EnquiryUpdateData) => {
    if (!editingEnquiry) return;

    try {
      await dispatch(updateEnquiry(editingEnquiry)).unwrap();
      toast.success("Enquiry updated successfully");
      setEditingEnquiry(null);
      dispatch(fetchEnquiries(filters));
    } catch (error: any) {
      toast.error(error.message || "Failed to update enquiry");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    try {
      await dispatch(deleteEnquiry(id)).unwrap();
      toast.success("Enquiry deleted successfully");
      setDeleteDialogId(null);
      dispatch(fetchEnquiries(filters));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete enquiry");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      new: "bg-blue-100 text-blue-800 border-blue-300",
      contacted: "bg-yellow-100 text-yellow-800 border-yellow-300",
      interested: "bg-green-100 text-green-800 border-green-300",
      closed: "bg-gray-100 text-gray-800 border-gray-300",
    };

    const icons: Record<string, React.ReactNode> = {
      new: <AlertCircle className="w-3 h-3" />,
      contacted: <Clock className="w-3 h-3" />,
      interested: <CheckCircle className="w-3 h-3" />,
      closed: <CheckCircle className="w-3 h-3" />,
    };

    return (
      <Badge className={`${variants[status]} flex items-center gap-1`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      high: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <Badge className={`${variants[priority]} flex items-center gap-1`}>
        <Star className="w-3 h-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6 -m-6 space-y-8 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
              Enquiries Hub
            </h1>
            <p className="text-slate-600 font-medium">
              Track and manage customer inquiries from your website
            </p>
          </div>
        </div>
        <Button
          onClick={() => dispatch(fetchEnquiries(filters))}
          className="bg-emerald-900 border-slate-200/60 text-white hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50 hover:text-primary"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          <span className="font-medium">Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Total Enquiries
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {statusSummary.total}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">
              New
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {statusSummary.new}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Contacted
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {statusSummary.contacted}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Interested
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {statusSummary.interested}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold text-slate-600">
              Closed
            </CardTitle>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">
              {statusSummary.closed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <Filter className="h-4 w-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">
              Filters & Search
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label
                htmlFor="search"
                className="text-sm font-semibold text-slate-600"
              >
                Search
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, country..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200"
                />
              </div>
            </div>

            <div className="w-full md:w-68">
              <Label className="text-sm font-semibold text-slate-600">
                Status
              </Label>
              <Select value={filters.status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200 cursor-pointer mt-2 w-full">
                  <SelectValue className="pb-1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Status
                  </SelectItem>
                  <SelectItem value="new" className="cursor-pointer">
                    New
                  </SelectItem>
                  <SelectItem value="contacted" className="cursor-pointer">
                    Contacted
                  </SelectItem>
                  <SelectItem value="interested" className="cursor-pointer">
                    Interested
                  </SelectItem>
                  <SelectItem value="closed" className="cursor-pointer">
                    Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Label className="text-sm font-semibold text-slate-600">
                Priority
              </Label>
              <Select
                value={filters.priority}
                onValueChange={handlePriorityFilter}
              >
                <SelectTrigger className="bg-white/60 border-slate-200/60 focus:bg-white transition-colors duration-200 cursor-pointer mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    All Priority
                  </SelectItem>
                  <SelectItem value="low" className="cursor-pointer">
                    Low
                  </SelectItem>
                  <SelectItem value="medium" className="cursor-pointer">
                    Medium
                  </SelectItem>
                  <SelectItem value="high" className="cursor-pointer">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Enquiries Overview
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 font-medium">
                  Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * filters.limit,
                    pagination.totalEnquiries
                  )}{" "}
                  of {pagination.totalEnquiries} enquiries
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No enquiries found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200/60 shadow-sm">
              <Table>
                <TableHeader className="bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg">
                  <TableRow className="border-slate-300/20">
                    <TableHead className="text-white font-semibold">
                      Name & Email
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Contact Info
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Location
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Priority
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow
                      key={enquiry._id}
                      className="hover:bg-slate-50/80 transition-colors duration-200 border-slate-200/40"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{enquiry.fullName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {enquiry.emailAddress}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {enquiry.phoneNo && (
                            <div className="text-sm flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {enquiry.phoneNo}
                            </div>
                          )}
                          <div className="text-sm flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {enquiry.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enquiry.location}</TableCell>
                      <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                      <TableCell>
                        {getPriorityBadge(enquiry.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(enquiry.createdAt)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {/* View Details Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white border-white/20 hover:border-blue-400 transition-all duration-200 cursor-pointer rounded-lg"
                            onClick={() => handleViewDetails(enquiry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {/* Edit Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-emerald-600 hover:text-white border-white/20 hover:border-emerald-400 transition-all duration-200 cursor-pointer rounded-lg"
                            onClick={() => handleEditEnquiry(enquiry)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white border-white/20 hover:border-red-400 transition-all duration-200 cursor-pointer rounded-lg"
                            onClick={() => setDeleteDialogId(enquiry._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60">
              <Button
                variant="outline"
                className="bg-white/60 border-slate-200/60 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <span className="font-medium">Previous</span>
              </Button>
              <span className="text-sm font-semibold text-slate-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                className="bg-white/60 border-slate-200/60 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                <span className="font-medium">Next</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enquiry Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl bg-sidebar">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              View complete enquiry information
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnquiry.fullName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnquiry.emailAddress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnquiry.phoneNo || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedEnquiry.location}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedEnquiry.location}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedEnquiry.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedEnquiry.priority)}
                  </div>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <Label className="text-sm font-medium">Message</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {selectedEnquiry.message}
                  </p>
                </div>
              )}

              {selectedEnquiry.notes && (
                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {selectedEnquiry.notes}
                  </p>
                </div>
              )}

              {selectedEnquiry.pageUrl && (
                <div>
                  <Label className="text-sm font-medium">Page URL</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    <a
                      href={selectedEnquiry.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {selectedEnquiry.pageUrl}
                    </a>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEnquiry.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEnquiry.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Enquiry Dialog */}
      <Dialog
        open={!!editingEnquiry}
        onOpenChange={() => setEditingEnquiry(null)}
      >
        <DialogContent className=" max-w-2xl bg-sidebar">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
            <DialogDescription>
              Update enquiry status, priority, and add notes
            </DialogDescription>
          </DialogHeader>

          {editingEnquiry && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status" className="pb-2">
                  Status
                </Label>
                <Select
                  value={editingEnquiry.status}
                  onValueChange={(value) =>
                    setEditingEnquiry({ ...editingEnquiry, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new" className="cursor-pointer">
                      New
                    </SelectItem>
                    <SelectItem value="contacted" className="cursor-pointer">
                      Contacted
                    </SelectItem>
                    <SelectItem value="interested" className="cursor-pointer">
                      Interested
                    </SelectItem>
                    <SelectItem value="closed" className="cursor-pointer">
                      Closed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="pb-2">
                  Priority
                </Label>
                <Select
                  value={editingEnquiry.priority}
                  onValueChange={(value) =>
                    setEditingEnquiry({ ...editingEnquiry, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-theme">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="pb-2">
                  Admin Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this enquiry..."
                  value={editingEnquiry.notes}
                  onChange={(e) =>
                    setEditingEnquiry({
                      ...editingEnquiry,
                      notes: e.target.value,
                    })
                  }
                  className="ring-2 ring-primary/20"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingEnquiry(null)}
                  className="bg-white/90 backdrop-blur-xl border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="font-semibold">Cancel</span>
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateEnquiry(editingEnquiry as EnquiryUpdateData)
                  }
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">Update Enquiry</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteDialogId}
        onOpenChange={() => setDeleteDialogId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              enquiry and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-white/90 backdrop-blur-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <span className="font-semibold">Cancel</span>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialogId && handleDeleteEnquiry(deleteDialogId)
              }
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="font-semibold">Delete Enquiry</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnquiriesManager;
