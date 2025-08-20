"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import {
  fetchNavbar,
  updateNavbar,
  updateNavbarItems,
} from "@/redux/slices/navbarSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, GripVertical, Upload, Save } from "lucide-react";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Imports for @atlaskit/pragmatic-drag-and-drop
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
import { useAppDispatch } from "@/redux/hooks";

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

// A dedicated component for each draggable item to encapsulate D&D logic
function DraggableItem({
  item,
  index,
  children,
}: {
  item: NavbarItem;
  index: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // This combines the draggable and drop target functionality for the item
    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ index, _id: item._id }),
        onDragStart: () => setDragging(true),
        onDrop: () => {
          setDragging(false);
          setClosestEdge(null);
        },
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          const data = { index, _id: item._id };
          // Attaches the closest edge to the data, used for showing a drop indicator
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
  }, [index, item._id]);

  return (
    <div ref={ref} className="relative">
      {/* Drop Indicator */}
      {closestEdge && (
        <div
          className={`absolute left-2 right-2 h-1 bg-blue-600 rounded-full ${
            closestEdge === "top" ? "-top-1" : "-bottom-1"
          }`}
        />
      )}
      {/* Item Content */}
      <div
        className={`transition-opacity ${
          dragging ? "opacity-40" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function NavbarManager() {
  const dispatch = useAppDispatch();
  const { logo, items, loading, error } = useSelector(
    (state: RootState) => state.navbar
  );
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);

  // Main useEffect for handling drag-and-drop logic
  useEffect(() => {
    // This function reorders the items in the state and dispatches the update
    const reorderAndSave = async ({
      startIndex,
      finishIndex,
    }: {
      startIndex: number;
      finishIndex: number;
    }) => {
      const reorderedItems = Array.from(items);
      const [moved] = reorderedItems.splice(startIndex, 1);
      reorderedItems.splice(finishIndex, 0, moved);

      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      dispatch(updateNavbarItems(updatedItems));
      await dispatch(updateNavbar({ items: updatedItems }));
    };

    // Monitor for drops on elements
    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        const startIndex = source.data.index as number;

        // If not dropping on a valid target, do nothing
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

        reorderAndSave({ startIndex, finishIndex });
      },
    });
  }, [items, dispatch]);

  const handleAddItem = () => {
    const newItem: NavbarItem = {
      label: "",
      href: "",
      order: items.length + 1,
      isActive: true,
    };
    setEditingItem(newItem);
    setShowAddForm(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;

    setSaving(true);
    try {
      let updatedItems;
      if (editingItem._id) {
        updatedItems = items.map((item) =>
          item._id === editingItem._id ? editingItem : item
        );
      } else {
        updatedItems = [
          ...items,
          { ...editingItem, _id: Date.now().toString() },
        ];
      }

      dispatch(updateNavbarItems(updatedItems));
      await dispatch(updateNavbar({ items: updatedItems }));

      toast.success(editingItem._id ? "Item updated" : "New item added");

      setEditingItem(null);
      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to save item");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    toast.success("Navbar Items deleted successfully");
    const updatedItems = items.filter((item) => item._id !== itemId);
    dispatch(updateNavbarItems(updatedItems));
    await dispatch(updateNavbar({ items: updatedItems }));
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", logoFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        const newLogo = { url: result.url, alt: "Novaa Real Estate Logo" };
        await dispatch(updateNavbar({ logo: newLogo }));
        setLogoFile(null);
        toast.success("Logo uploaded successfully");
      } else {
        toast.error("Logo upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("Editing Item", editingItem);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navbar Management</h1>
        <p className="text-gray-600">Manage your website navigation and logo</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Logo Management */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload and manage your website logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logo && (
            <div className="flex items-center space-x-4">
              <img
                src={logo.url}
                alt={logo.alt}
                className="h-12 w-auto border rounded"
              />
              <span className="text-sm text-gray-600">Current logo</span>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Input
              type="file"
              accept="image/*"
              className="text-background"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            <Button
              onClick={handleLogoUpload}
              disabled={!logoFile || saving}
              className="flex items-center space-x-2 text-background hover:cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="py-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Navigation Items</CardTitle>
            <CardDescription>
              Manage your website navigation menu
            </CardDescription>
          </div>
          <Button
            onClick={handleAddItem}
            className="flex items-center space-x-2 text-background cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item, index) => (
              <DraggableItem key={item._id || index} item={item} index={index}>
                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-white cursor-grab">
                  <GripVertical className="h-4 w-4 text-gray-400" />

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.label}</span>
                      {!item.isActive && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{item.href}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-primary text-background cursor-pointer"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-[#FF0800] hover:bg-[#E23D28] cursor-pointer"
                      onClick={() => handleDeleteItem(item._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DraggableItem>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Item Modal */}
      <Dialog
        open={!!(editingItem || showAddForm)}
        onOpenChange={() => {
          setEditingItem(null);
          setShowAddForm(false);
        }}
      >
        <DialogContent className="bg-background text-primary border-background">
          <DialogHeader>
            <DialogTitle>
              {editingItem?._id ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 pb-2">
                Label
              </label>
              <Input
                value={editingItem?.label || ""}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, label: e.target.value } : null
                  )
                }
                className="no-selection-highlight"
                placeholder="e.g., Home, About, Contact"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                URL
              </label>
              <Input
                value={editingItem?.href || ""}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, href: e.target.value } : null
                  )
                }
                placeholder="e.g., /, /about, /contact"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`is-active-checkbox-${editingItem?._id || "new"}`}
                checked={editingItem?.isActive || false}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, isActive: e.target.checked } : null
                  )
                }
                className="rounded"
              />
              <label
                htmlFor={`is-active-checkbox-${editingItem?._id || "new"}`}
                className="text-sm text-gray-500"
              >
                Active
              </label>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 mt-4">
            <Button
              onClick={handleSaveItem}
              disabled={saving}
              className="bg-primary text-background cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setEditingItem(null);
                setShowAddForm(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
