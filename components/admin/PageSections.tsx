"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Edit, MoreVertical, GripVertical, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  fetchPageSections,
  updateSectionsOrder,
  selectSections,
  selectSectionsLoading,
  updateSections,
} from "@/redux/slices/pageSlice";
import type { AppDispatch } from "@/redux";
import type { Section } from "@/redux/slices/pageSlice";

// Drag and drop imports
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Draggable component for each section row
function DraggableSection({
  section,
  index,
  isDraggable, // New prop to control draggable behavior
  children,
}: {
  section: Section;
  index: number;
  isDraggable: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLTableRowElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    // Only make the element draggable if the isDraggable prop is true
    if (!el || !isDraggable) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ index, _id: section._id }),
        onDragStart: () => setDragging(true),
        onDrop: () => {
          setDragging(false);
          setClosestEdge(null);
        },
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          const data = { index, _id: section._id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          const closestEdge = args.self.data.closestEdge as Edge | null;
          setClosestEdge(closestEdge);
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [index, section._id, isDraggable]); // Add isDraggable to dependency array

  // Conditionally apply classes for draggable items
  const draggableClasses = isDraggable
    ? "cursor-grab active:cursor-grabbing"
    : "bg-gray-50";

  return (
    <TableRow
      ref={ref}
      className={`relative transition-opacity ${
        dragging ? "opacity-40" : "opacity-100"
      } hover:bg-gray-50 ${draggableClasses}`}
    >
      {/* Drop Indicator - only show for draggable items */}
      {isDraggable && closestEdge && (
        <td
          colSpan={7} // Adjusted colSpan to cover all cells
          className={`absolute left-0 right-0 h-1 bg-blue-600 z-10 ${
            closestEdge === "top" ? "-top-0.5" : "bottom-0"
          }`}
        />
      )}
      {children}
    </TableRow>
  );
}

export default function PageSectionsList() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const pageSlug = params?.slug as string;
  const sections = useAppSelector(selectSections);
  const loading = useAppSelector(selectSectionsLoading);
  const [error, setError] = useState<string | null>(null);

  console.log("Sections" , sections)
  useEffect(() => {
    console.log(pageSlug)
    if (pageSlug) {
      dispatch(fetchPageSections(pageSlug));
    }
  }, [dispatch, pageSlug]);

  // Handle drag and drop reordering
  useEffect(() => {
    const reorderSections = async ({
      startIndex,
      finishIndex,
    }: {
      startIndex: number;
      finishIndex: number;
    }) => {
      const reorderedSections = Array.from(sections);
      const [moved] = reorderedSections.splice(startIndex, 1);
      reorderedSections.splice(finishIndex, 0, moved);

      // Update order values
      const updatedSections = reorderedSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      // Optimistically update local state
      dispatch(updateSections(updatedSections));

      try {
        // Update on server
        await dispatch(updateSectionsOrder(updatedSections)).unwrap();
        setError(null);
      } catch (err) {
        setError("Failed to update section order. Please refresh the page.");
        // Revert on error
        dispatch(updateSections(sections));
      }
    };

    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        // source.data._id will be undefined for non-draggable items, preventing drops
        if (!source.data._id) return;

        const startIndex = source.data.index as number;

        if (!location.current.dropTargets.length) {
          return;
        }

        const dropTarget = location.current.dropTargets[0];
        const indexOfTarget = dropTarget.data.index as number;
        const closestEdgeOfTarget = dropTarget.data.closestEdge as Edge | null;

        const finishIndex = getReorderDestinationIndex({
          startIndex,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        });

        if (startIndex !== finishIndex) {
          reorderSections({ startIndex, finishIndex });
        }
      },
    });
  }, [sections, dispatch]);

  const pageTitle =
    pageSlug?.charAt(0).toUpperCase() + pageSlug?.slice(1).replace("-", " ") ||
    "Page";

  const getSectionIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      navbar: "🧭",
      hero: "🎯",
      curatedCollection : "🏝️",
      about: "ℹ️",
      services: "⚙️",
      properties: "🏠",
      testimonials: "💬",
      faq: "❓",
      footer: "📄",
      contact: "📞",
      "why-invest": "📈",
      "investor-insights": "💡",
    };
    return icons[type] || "📄";
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pages" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Pages
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {pageTitle} Page Sections
        </h1>
        <p className="text-muted-foreground">
          Manage all sections for the {pageTitle.toLowerCase()} page. Drag and drop to reorder sections.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Sections Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Page Sections ({sections.length})</span>
            <Badge variant="outline" className="ml-2 text-background">
              {pageSlug}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading sections...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100/80">
                  <TableHead className="w-[40px] text-gray-900 font-semibold"></TableHead>
                  <TableHead className="w-[60px] text-gray-900 font-semibold">Order</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Section</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Type</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-900 font-semibold">Last Modified</TableHead>
                  <TableHead className="w-[100px] text-gray-900 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section, index) => {
                  // Determine if the current section should be draggable
                  const isDraggable = section.type !== 'navbar' && section.type !== 'footer';
                  
                  return (
                    <DraggableSection
                      key={section._id}
                      section={section}
                      index={index}
                      isDraggable={isDraggable} // Pass the prop
                    >
                      <TableCell>
                        {/* Only show the grip icon for draggable items */}
                        {isDraggable ? (
                          <GripVertical className="h-4 w-4 text-gray-400" />
                        ) : (
                          <div className="w-4 h-4" /> // Placeholder for alignment
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-center">
                        <Badge variant="outline" className="text-background w-8 h-6 flex items-center justify-center">
                          {section.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getSectionIcon(section.type)}</span>
                          <div>
                            <div className="font-medium">{section.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-background">
                          {section.type.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            section.status === "active" ? "default" : "secondary"
                          }
                          className={section.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {section.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(section.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/pages/${pageSlug}/${section.slug}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Section
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </DraggableSection>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!loading && sections.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-2">
                No sections found
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                This page doesn&apos;t have any configured sections yet
              </p>
              <Button className="text-background">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Section
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
