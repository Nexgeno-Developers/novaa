// components/admin/ProjectsSection.tsx
"use client";

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { RootState } from '@/redux';
import Link from 'next/link';

export default function ProjectsSection() {
  const { projects } = useSelector((state: RootState) => state.projects);
  const { categories } = useSelector((state: RootState) => state.categories);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter projects based on search and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeProjects = filteredProjects.filter(project => project.isActive);
  const inactiveProjects = filteredProjects.filter(project => !project.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Projects Overview</span>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {activeProjects.length} Active • {inactiveProjects.length} Inactive
            </div>
            <Link href="/admin/projects">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage All
              </Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Projects</p>
                <p className="text-2xl font-bold text-green-700">{activeProjects.length}</p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Inactive Projects</p>
                <p className="text-2xl font-bold text-orange-700">{inactiveProjects.length}</p>
              </div>
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⏸</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Projects</p>
                <p className="text-2xl font-bold text-blue-700">{projects.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">#</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {projects.length === 0 
              ? "No projects found. Create your first project to get started."
              : "No projects match your filters."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProjects.slice(0, 12).map((project) => (
              <div 
                key={project._id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100 relative">
                  {project.images[0] ? (
                    <img 
                      src={project.images[0]} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant={project.isActive ? 'default' : 'secondary'} className="text-xs">
                      {project.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-xs bg-white/90">
                      {project.categoryName}
                    </Badge>
                  </div>
                  
                  {/* Project Badge */}
                  {project.badge && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {project.badge}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Images Count */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      +{project.images.length - 1} more
                    </div>
                  )}
                </div>
                
                <div className="p-3">
                  <h4 className="font-semibold text-sm truncate mb-1">{project.name}</h4>
                  <p className="text-xs text-muted-foreground truncate mb-2">{project.location}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">{project.price}</span>
                    <span className="text-xs text-muted-foreground">#{project.order}</span>
                  </div>
                  
                  {/* Description preview */}
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description.replace(/<[^>]*>/g, '').substring(0, 80)}
                      {project.description.length > 80 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredProjects.length > 12 && (
          <div className="text-center pt-4">
            <Link href="/admin/projects">
              <Button variant="outline">
                View All {filteredProjects.length} Projects
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}