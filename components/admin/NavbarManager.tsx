"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import {
  fetchNavbar,
  updateLogo,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch } from "@/redux/hooks";

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
import { AdvancedMediaSelector } from "./AdvancedMediaSelector";

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

// Draggable component for navbar items
function DraggableNavItem({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: NavbarItem;
  index: number;
  onEdit: (item: NavbarItem) => void;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
          className={`absolute left-2 right-2 h-1 bg-blue-600 rounded-full z-10 ${
            closestEdge === "top" ? "-top-1" : "-bottom-1"
          }`}
        />
      )}

      {/* Item Content */}
      <div
        className={`flex items-center space-x-4 p-4 border rounded-lg bg-white cursor-grab transition-opacity ${
          dragging ? "opacity-40" : "opacity-100"
        }`}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{item.label}</span>
            {!item.isActive && <Badge variant="secondary">Inactive</Badge>}
          </div>
          <span className="text-sm text-gray-500">{item.href}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-primary text-background cursor-pointer"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            onClick={() => onDelete(item._id!)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
  // const [logo setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [isLogoSelectorOpen, setIsLogoSelectorOpen] = useState(false);

  // Fetch navbar data on component mount
  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);

  // Handle drag and drop reordering
  useEffect(() => {
    const reorderItems = async ({
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

      // Update Redux state immediately for smooth UI
      dispatch(updateNavbarItems(updatedItems));

      // Then sync with backend
      try {
        await dispatch(updateNavbar({ items: updatedItems })).unwrap();
      } catch (error) {
        toast.error("Failed to save reorder");
        console.error("Reorder error:", error);
      }
    };

    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
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
          reorderItems({ startIndex, finishIndex });
        }
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
    if (!editingItem || !editingItem.label || !editingItem.href) return;

    setSaving(true);
    try {
      let updatedItems;
      if (editingItem._id) {
        // Editing existing item
        updatedItems = items.map((item) =>
          item._id === editingItem._id ? editingItem : item
        );
      } else {
        // Adding new item
        updatedItems = [
          ...items,
          { ...editingItem, _id: Date.now().toString() },
        ];
      }

      // Update Redux state
      dispatch(updateNavbarItems(updatedItems));

      // Sync with backend
      await dispatch(updateNavbar({ items: updatedItems })).unwrap();

      toast.success(editingItem._id ? "Item updated" : "New item added");

      setEditingItem(null);
      setShowAddForm(false);
    } catch (error) {
      toast.error("Failed to save item");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const updatedItems = items.filter((item) => item._id !== itemId);

      // Update Redux state
      dispatch(updateNavbarItems(updatedItems));

      // Sync with backend
      await dispatch(updateNavbar({ items: updatedItems })).unwrap();

      toast.success("Navigation item deleted");
    } catch (error) {
      toast.error("Failed to delete item");
      console.error("Delete error:", error);
    }
  };

  // ✅ Advanced Media Selector logo update
  const handleLogoSelect = async (media: { url: string; alt?: string }) => {
    try {
      await dispatch(updateNavbar({ logo: media })).unwrap();
      toast.success("Logo updated successfully");
    } catch (error) {
      toast.error("Failed to update logo");
      console.error("Logo update error:", error);
    }
  };

  // const handleLogoUpload = async () => {
  //   if (!logoFile) return;

  //   setSaving(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", logoFile);

  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const result = await response.json();

  //     if (result.success) {
  //       const newLogo = { url: result.url, alt: "Logo" };
  //       await dispatch(updateNavbar({ logo: newLogo })).unwrap();
  //       setLogoFile(null);
  //       toast.success("Logo uploaded successfully");
  //     } else {
  //       toast.error("Logo upload failed");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to upload logo");
  //     console.error('Upload error:', error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleLogoChange = async (field: 'url' | 'alt', value: string) => {
  //   try {
  //     const updatedLogo = {
  //       ...logo,
  //       [field]: value
  //     };

  //     await dispatch(updateNavbar({ logo: updatedLogo })).unwrap();
  //   } catch (error) {
  //     toast.error(`Failed to update logo ${field}`);
  //     console.error('Logo update error:', error);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading navbar...</span>
      </div>
    );
  }

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
          <CardTitle>Logo Settings</CardTitle>
          <CardDescription>
            Manage your website logo and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Show current logo */}
          {logo && logo.url && (
            <div className="flex items-center space-x-4">
              <img
                src={logo.url}
                alt="Current Logo"
                className="h-12 w-auto border rounded"
              />
              <span className="text-sm text-gray-600">Current logo</span>
            </div>
          )}

          {/* Button to open Advanced Media Selector */}
          <div className="pt-4">
            <Label>Select Logo</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Button
                onClick={() => setIsLogoSelectorOpen(true)}
                className="flex items-center space-x-2 text-background cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Choose from Media</span>
              </Button>
            </div>
          </div>

          {/* Advanced Media Selector */}
          <AdvancedMediaSelector
            isOpen={isLogoSelectorOpen}
            onOpenChange={setIsLogoSelectorOpen}
            onSelect={(media) => {
              dispatch(updateNavbar({ logo: { url: media.secure_url } }));
            }}
            mediaType="image"
            title="Select Logo"
            selectedValue={logo?.url}
          />
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="py-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Navigation Items</CardTitle>
            <CardDescription>
              Manage your website navigation menu. Drag to reorder items.
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
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No navigation items yet
              </p>
              <Button onClick={handleAddItem} className="text-background">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <DraggableNavItem
                  key={item._id || index}
                  item={item}
                  index={index}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          )}
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
              {editingItem?._id
                ? "Edit Navigation Item"
                : "Add New Navigation Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">
                Label
              </Label>
              <Input
                value={editingItem?.label || ""}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, label: e.target.value } : null
                  )
                }
                placeholder="e.g., Home, About, Contact"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">
                URL
              </Label>
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
              <Switch
                id={`is-active-${editingItem?._id || "new"}`}
                checked={editingItem?.isActive || false}
                onCheckedChange={(checked) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, isActive: checked } : null
                  )
                }
              />
              <Label
                htmlFor={`is-active-${editingItem?._id || "new"}`}
                className="text-sm text-gray-700"
              >
                Active (visible in navigation)
              </Label>
            </div>
          </div>

          <DialogFooter className="flex space-x-2 mt-4">
            <Button
              onClick={handleSaveItem}
              disabled={saving || !editingItem?.label || !editingItem?.href}
              className="bg-primary text-background cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Item"}
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
