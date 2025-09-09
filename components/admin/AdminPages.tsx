'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, MoreVertical, Edit, Eye, Filter, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchPages, setSearchTerm, setStatusFilter, selectFilteredPages, selectPagesLoading, selectSearchTerm } from '@/redux/slices/pageSlice';
import type { AppDispatch, RootState } from '@/redux';

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
    dispatch(setStatusFilter(value as 'all' | 'active' | 'inactive'));
  };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Pages Management</h1>
          <p className="text-muted-foreground">
            Manage all your website pages and their sections.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all" onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-[180px] cursor-pointer">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className=' admin-theme'>
            <SelectItem value="all" className='cursor-pointer'>All Status</SelectItem>
            <SelectItem value="active" className='cursor-pointer'>Active</SelectItem>
            <SelectItem value="inactive" className='cursor-pointer'>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pages Table */}
      <Card className="py-6 bg-purple-50/50 ring-2 ring-primary/20">
        <CardHeader>
          <CardTitle className='text-primary/90'>All Pages ({pages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading pages...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/80 hover:bg-primary/70">
                  <TableHead className=" text-white font-semibold">Sr. No.</TableHead>
                  <TableHead className="text-white font-semibold">Page</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  {/* <TableHead className="text-whitefont-semibold">Last Modified</TableHead> */}
                  <TableHead className="w-[100px] text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page, index) => (
                  <TableRow key={page._id} className="hover:bg-gray-50">
                    <TableCell  className="font-medium">{index + 1}</TableCell>
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
                        variant={page.status === 'active' ? 'default' : 'secondary'}
                        className={page.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
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
                          <Button variant="ghost" className="cursor-pointer text-primary/90 hover:text-primary/80" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='admin-theme'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/pages/${page.slug}`} className="flex items-center cursor-pointer">
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
          )}
          
          {!loading && pages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2">No pages found</div>
              <p className="text-muted-foreground text-sm mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first page'}
              </p>
              {!searchTerm && (
                <Button className="text-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Page
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}