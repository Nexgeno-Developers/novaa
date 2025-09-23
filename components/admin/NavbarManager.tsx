"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { fetchNavbar, updateNavbar } from "@/redux/slices/navbarSlice";
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
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Upload,
  Save,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface SubmenuItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  submenu?: SubmenuItem[];
}

interface NavbarState {
  logo: { url: string; alt?: string } | null;
  items: NavbarItem[];
}

// Draggable component for main nav items
function DraggableNavItem({
  item,
  index,
  onEdit,
  onDelete,
  onAddSubmenu,
  onEditSubmenu,
  onDeleteSubmenu,
  expandedItems,
  toggleExpanded,
}: {
  item: NavbarItem;
  index: number;
  onEdit: (item: NavbarItem) => void;
  onDelete: (id: string) => void;
  onAddSubmenu: (parentId: string) => void;
  onEditSubmenu: (parentId: string, submenu: SubmenuItem) => void;
  onDeleteSubmenu: (parentId: string, submenuId: string) => void;
  expandedItems: Set<string>;
  toggleExpanded: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedItems.has(item._id || "");

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
    <div>
      <div ref={ref} className="relative">
        {closestEdge && (
          <div
            className={`absolute left-2 right-2 h-1 bg-blue-600 rounded-full z-10 ${
              closestEdge === "top" ? "-top-1" : "-bottom-1"
            }`}
          />
        )}
        <div
          className={`flex items-center space-x-4 p-4 border rounded-lg bg-white ring-2 ring-primary/10 cursor-grab transition-opacity ${
            dragging ? "opacity-40" : "opacity-100"
          }`}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
          
          {/* Expand/Collapse Button */}
          {hasSubmenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(item._id || "")}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{item.label}</span>
              {!item.isActive && <Badge variant="secondary">Inactive</Badge>}
              {hasSubmenu && (
                <Badge variant="outline" className="text-xs">
                  {item.submenu?.length} submenu items
                </Badge>
              )}
            </div>
            <span className="text-sm text-gray-500">{item.href}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer"
              onClick={() => onAddSubmenu(item._id!)}
              title="Add Submenu"
            >
              <Plus className="h-4 w-4" />
            </Button>
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

      {/* Submenu Items */}
      {hasSubmenu && isExpanded && (
        <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
          {item.submenu?.map((submenuItem, subIndex) => (
            <div
              key={submenuItem._id || subIndex}
              className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{submenuItem.label}</span>
                  {!submenuItem.isActive && (
                    <Badge variant="secondary" className="text-xs">Inactive</Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">{submenuItem.href}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-primary text-background cursor-pointer"
                  onClick={() => onEditSubmenu(item._id!, submenuItem)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                  onClick={() => onDeleteSubmenu(item._id!, submenuItem._id!)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavbarManager() {
  const dispatch = useAppDispatch();
  const {
    logo: initialLogo,
    items: initialItems,
    loading,
    error,
  } = useSelector((state: RootState) => state.navbar);

  // Local state to track all changes before saving
  const [localNavbarState, setLocalNavbarState] = useState<NavbarState>({
    logo: null,
    items: [],
  });

  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [editingSubmenu, setEditingSubmenu] = useState<{
    parentId: string;
    submenu: SubmenuItem | null;
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSubmenuForm, setShowSubmenuForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLogoSelectorOpen, setIsLogoSelectorOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Populate local state when data is fetched from Redux
  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);

  useEffect(() => {
    // This effect runs when the initial data from Redux arrives
    setLocalNavbarState({ logo: initialLogo, items: initialItems });
  }, [initialLogo, initialItems]);

  // Check if there are any unsaved changes
  const hasChanges =
    JSON.stringify({ logo: initialLogo, items: initialItems }) !==
    JSON.stringify(localNavbarState);

  // Toggle expanded state for nav items
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle drag and drop reordering (modifies local state only)
  useEffect(() => {
    const reorderItems = ({
      startIndex,
      finishIndex,
    }: {
      startIndex: number;
      finishIndex: number;
    }) => {
      const reorderedItems = Array.from(localNavbarState.items);
      const [moved] = reorderedItems.splice(startIndex, 1);
      reorderedItems.splice(finishIndex, 0, moved);
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setLocalNavbarState((prevState) => ({
        ...prevState,
        items: updatedItems,
      }));
    };

    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        if (!location.current.dropTargets.length) return;
        const startIndex = source.data.index as number;
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
  }, [localNavbarState.items]);

  const handleAddItem = () => {
    const newItem: NavbarItem = {
      label: "",
      href: "",
      order: localNavbarState.items.length + 1,
      isActive: true,
      submenu: [],
    };
    setEditingItem(newItem);
    setShowAddForm(true);
  };

  const handleAddSubmenu = (parentId: string) => {
    const parentItem = localNavbarState.items.find(item => item._id === parentId);
    const newSubmenu: SubmenuItem = {
      label: "",
      href: "",
      order: (parentItem?.submenu?.length || 0) + 1,
      isActive: true,
    };
    setEditingSubmenu({ parentId, submenu: newSubmenu });
    setShowSubmenuForm(true);
  };

  const handleEditSubmenu = (parentId: string, submenu: SubmenuItem) => {
    setEditingSubmenu({ parentId, submenu });
    setShowSubmenuForm(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.label || !editingItem.href) return;
    let updatedItems;
    if (editingItem._id) {
      // Editing existing item
      updatedItems = localNavbarState.items.map((item) =>
        item._id === editingItem._id ? editingItem : item
      );
    } else {
      // Adding new item
      updatedItems = [...localNavbarState.items, { ...editingItem }];
    }
    setLocalNavbarState((prevState) => ({ ...prevState, items: updatedItems }));
    setEditingItem(null);
    setShowAddForm(false);
    toast.success(
      editingItem._id ? "Item updated locally" : "New item added locally"
    );
  };

  const handleSaveSubmenu = () => {
    if (!editingSubmenu || !editingSubmenu.submenu?.label || !editingSubmenu.submenu?.href) return;
    
    const updatedItems = localNavbarState.items.map((item) => {
      if (item._id === editingSubmenu.parentId) {
        const updatedItem = { ...item };
        if (!updatedItem.submenu) {
          updatedItem.submenu = [];
        }
        
        if (editingSubmenu.submenu!._id) {
          // Editing existing submenu
          updatedItem.submenu = updatedItem.submenu.map((sub) =>
            sub._id === editingSubmenu.submenu!._id ? editingSubmenu.submenu! : sub
          );
        } else {
          // Adding new submenu
          updatedItem.submenu = [...updatedItem.submenu, editingSubmenu.submenu!];
        }
        return updatedItem;
      }
      return item;
    });

    setLocalNavbarState((prevState) => ({ ...prevState, items: updatedItems }));
    setEditingSubmenu(null);
    setShowSubmenuForm(false);
    toast.success(
      editingSubmenu.submenu!._id ? "Submenu updated locally" : "New submenu added locally"
    );
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = localNavbarState.items.filter(
      (item) => item._id !== itemId
    );
    setLocalNavbarState((prevState) => ({ ...prevState, items: updatedItems }));
    toast.info("Item marked for deletion");
  };

  const handleDeleteSubmenu = (parentId: string, submenuId: string) => {
    const updatedItems = localNavbarState.items.map((item) => {
      if (item._id === parentId && item.submenu) {
        return {
          ...item,
          submenu: item.submenu.filter((sub) => sub._id !== submenuId),
        };
      }
      return item;
    });
    setLocalNavbarState((prevState) => ({ ...prevState, items: updatedItems }));
    toast.info("Submenu item marked for deletion");
  };

  // Save changes function
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await dispatch(updateNavbar(localNavbarState)).unwrap();
      toast.success("Navbar updated successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Discard changes function
  const handleDiscardChanges = () => {
    setLocalNavbarState({ logo: initialLogo, items: initialItems });
    setExpandedItems(new Set());
    toast.info("Changes have been discarded.");
  };

  if (loading && !localNavbarState.items.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Navbar Management</h1>
          <p className="text-gray-600">
            Manage your website navigation, logo, and submenus
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Logo Management */}
      <Card className="py-6 bg-sidebar text-primary shadow-lg ring-2 ring-primary/20">
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
          <CardDescription>
            Manage your website logo and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex justify-between">
          {localNavbarState.logo && localNavbarState.logo.url && (
            <div className="flex items-center space-x-4">
              <img
                src={localNavbarState.logo.url}
                alt="Current Logo"
                className="h-18 w-auto border rounded p-2 bg-gray-300 ring-2 ring-primary/20"
              />
              <span className="text-sm text-gray-600">Current logo</span>
            </div>
          )}
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
          <AdvancedMediaSelector
            isOpen={isLogoSelectorOpen}
            onOpenChange={setIsLogoSelectorOpen}
            onSelect={(media) => {
              setLocalNavbarState((prevState) => ({
                ...prevState,
                logo: { url: media.secure_url },
              }));
              setIsLogoSelectorOpen(false);
            }}
            mediaType="image"
            title="Select Logo"
            selectedValue={localNavbarState.logo?.url}
          />
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="py-6 bg-sidebar text-primary shadow-lg ring-2 ring-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Navigation Items</CardTitle>
            <CardDescription>
              Manage your website navigation menu and submenus. Drag to reorder items.
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
          {localNavbarState.items.length === 0 ? (
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
              {localNavbarState.items.map((item, index) => (
                <DraggableNavItem
                  key={item._id || index}
                  item={item}
                  index={index}
                  onEdit={setEditingItem}
                  onDelete={handleDeleteItem}
                  onAddSubmenu={handleAddSubmenu}
                  onEditSubmenu={handleEditSubmenu}
                  onDeleteSubmenu={handleDeleteSubmenu}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
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
        <DialogContent className="max-w-2xl admin-theme">
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
              disabled={!editingItem?.label || !editingItem?.href}
              className="bg-primary text-background cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Item
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

      {/* Edit/Add Submenu Modal */}
      <Dialog
        open={!!(editingSubmenu || showSubmenuForm)}
        onOpenChange={() => {
          setEditingSubmenu(null);
          setShowSubmenuForm(false);
        }}
      >
        <DialogContent className="max-w-2xl admin-theme">
          <DialogHeader>
            <DialogTitle>
              {editingSubmenu?.submenu?._id
                ? "Edit Submenu Item"
                : "Add New Submenu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">
                Parent Menu Item
              </Label>
              <Select
                value={editingSubmenu?.parentId || ""}
                onValueChange={(value) =>
                  setEditingSubmenu((prev) =>
                    prev ? { ...prev, parentId: value } : null
                  )
                }
                disabled={!!editingSubmenu?.submenu?._id} // Disable when editing existing submenu
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent menu item" />
                </SelectTrigger>
                <SelectContent>
                  {localNavbarState.items.map((item) => (
                    <SelectItem key={item._id} value={item._id!}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">
                Submenu Label
              </Label>
              <Input
                value={editingSubmenu?.submenu?.label || ""}
                onChange={(e) =>
                  setEditingSubmenu((prev) =>
                    prev && prev.submenu
                      ? {
                          ...prev,
                          submenu: { ...prev.submenu, label: e.target.value },
                        }
                      : null
                  )
                }
                placeholder="e.g., Our Team, Services, Portfolio"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">
                Submenu URL
              </Label>
              <Input
                value={editingSubmenu?.submenu?.href || ""}
                onChange={(e) =>
                  setEditingSubmenu((prev) =>
                    prev && prev.submenu
                      ? {
                          ...prev,
                          submenu: { ...prev.submenu, href: e.target.value },
                        }
                      : null
                  )
                }
                placeholder="e.g., /about/team, /services/web-design"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id={`submenu-active-${editingSubmenu?.submenu?._id || "new"}`}
                checked={editingSubmenu?.submenu?.isActive || false}
                onCheckedChange={(checked) =>
                  setEditingSubmenu((prev) =>
                    prev && prev.submenu
                      ? {
                          ...prev,
                          submenu: { ...prev.submenu, isActive: checked },
                        }
                      : null
                  )
                }
              />
              <Label
                htmlFor={`submenu-active-${editingSubmenu?.submenu?._id || "new"}`}
                className="text-sm text-gray-700"
              >
                Active (visible in submenu)
              </Label>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 mt-4">
            <Button
              onClick={handleSaveSubmenu}
              disabled={
                !editingSubmenu?.submenu?.label ||
                !editingSubmenu?.submenu?.href ||
                !editingSubmenu?.parentId
              }
              className="bg-primary text-background cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Submenu
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setEditingSubmenu(null);
                setShowSubmenuForm(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Save/Discard Buttons - Show when there are changes */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-50">
          <Button
            onClick={handleDiscardChanges}
            variant="outline"
            className="shadow-lg hover:shadow-xl transition-all duration-200 bg-white border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Discard
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={saving}
            className="cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 text-background"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}