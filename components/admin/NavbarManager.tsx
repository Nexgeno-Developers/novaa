"use client";

import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import {
  fetchNavbar,
  updateNavbar,
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
import { Plus, Edit, Trash2, GripVertical, Upload, Save, XCircle } from "lucide-react";
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

interface NavbarState {
    logo: { url: string; alt?: string } | null;
    items: NavbarItem[];
}

// Draggable component remains the same as your original code
function DraggableNavItem({ item, index, onEdit, onDelete }: { item: NavbarItem; index: number; onEdit: (item: NavbarItem) => void; onDelete: (id: string) => void;}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return combine(
      draggable({ element: el, getInitialData: () => ({ index, _id: item._id }), onDragStart: () => setDragging(true), onDrop: () => { setDragging(false); setClosestEdge(null); }, }),
      dropTargetForElements({ element: el, getData: ({ input, element }) => { const data = { index, _id: item._id }; return attachClosestEdge(data, { input, element, allowedEdges: ["top", "bottom"], }); }, onDragEnter: (args) => { const closestEdge = args.self.data.closestEdge as Edge | null; setClosestEdge(closestEdge); }, onDragLeave: () => setClosestEdge(null), onDrop: () => setClosestEdge(null), })
    );
  }, [index, item._id]);

  return (
    <div ref={ref} className="relative">
      {closestEdge && (<div className={`absolute left-2 right-2 h-1 bg-blue-600 rounded-full z-10 ${ closestEdge === "top" ? "-top-1" : "-bottom-1" }`} />)}
      <div className={`flex items-center space-x-4 p-4 border rounded-lg bg-white cursor-grab transition-opacity ${ dragging ? "opacity-40" : "opacity-100" }`}>
        <GripVertical className="h-4 w-4 text-gray-400" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{item.label}</span>
            {!item.isActive && <Badge variant="secondary">Inactive</Badge>}
          </div>
          <span className="text-sm text-gray-500">{item.href}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-primary text-background cursor-pointer" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white cursor-pointer" onClick={() => onDelete(item._id!)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}


export default function NavbarManager() {
  const dispatch = useAppDispatch();
  const { logo: initialLogo, items: initialItems, loading, error } = useSelector(
    (state: RootState) => state.navbar
  );

  // Local state to track all changes before saving
  const [localNavbarState, setLocalNavbarState] = useState<NavbarState>({ logo: null, items: [] });
  
  const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLogoSelectorOpen, setIsLogoSelectorOpen] = useState(false);
  
  // Populate local state when data is fetched from Redux
  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);
  
  useEffect(() => {
    // This effect runs when the initial data from Redux arrives
    setLocalNavbarState({ logo: initialLogo, items: initialItems });
  }, [initialLogo, initialItems]);

  // Check if there are any unsaved changes
  const hasChanges = JSON.stringify({ logo: initialLogo, items: initialItems }) !== JSON.stringify(localNavbarState);

  // Handle drag and drop reordering (modifies local state only)
  useEffect(() => {
    const reorderItems = ({ startIndex, finishIndex }: { startIndex: number; finishIndex: number; }) => {
      const reorderedItems = Array.from(localNavbarState.items);
      const [moved] = reorderedItems.splice(startIndex, 1);
      reorderedItems.splice(finishIndex, 0, moved);
      const updatedItems = reorderedItems.map((item, index) => ({ ...item, order: index + 1 }));

      setLocalNavbarState(prevState => ({ ...prevState, items: updatedItems }));
    };

    return monitorForElements({
      onDrop(args) {
        const { location, source } = args;
        if (!location.current.dropTargets.length) return;
        const startIndex = source.data.index as number;
        const dropTarget = location.current.dropTargets[0];
        const indexOfTarget = dropTarget.data.index as number;
        const closestEdgeOfTarget = dropTarget.data.closestEdge as Edge | null;
        const finishIndex = getReorderDestinationIndex({ startIndex, indexOfTarget, closestEdgeOfTarget, axis: "vertical" });
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
    };
    setEditingItem(newItem);
    setShowAddForm(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.label || !editingItem.href) return;
    let updatedItems;
    if (editingItem._id) { // Editing existing item
      updatedItems = localNavbarState.items.map((item) => item._id === editingItem._id ? editingItem : item);
    } else { // Adding new item
      updatedItems = [...localNavbarState.items, { ...editingItem, _id: `new-${Date.now()}` }];
    }
    setLocalNavbarState(prevState => ({ ...prevState, items: updatedItems }));
    setEditingItem(null);
    setShowAddForm(false);
    toast.success(editingItem._id ? "Item updated locally" : "New item added locally");
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = localNavbarState.items.filter((item) => item._id !== itemId);
    setLocalNavbarState(prevState => ({ ...prevState, items: updatedItems }));
    toast.info("Item marked for deletion");
  };

  // ✅ New global save function
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // Send the entire local state to the backend
      await dispatch(updateNavbar(localNavbarState)).unwrap();
      toast.success("Navbar updated successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ✅ New discard changes function
  const handleDiscardChanges = () => {
    setLocalNavbarState({ logo: initialLogo, items: initialItems });
    toast.info("Changes have been discarded.");
  };

  if (loading && !localNavbarState.items.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading navbar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Navbar Management</h1>
            <p className="text-gray-600">Manage your website navigation and logo</p>
        </div>
        {/* ✅ Global Save/Discard Buttons */}
        {hasChanges && (
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleDiscardChanges}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Discard
                </Button>
                <Button onClick={handleSaveChanges} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        )}
      </div>

      {error && (<Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>)}

      {/* Logo Management */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
          <CardDescription>Manage your website logo and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {localNavbarState.logo && localNavbarState.logo.url && (
            <div className="flex items-center space-x-4">
              <img src={localNavbarState.logo.url} alt="Current Logo" className="h-12 w-auto border rounded"/>
              <span className="text-sm text-gray-600">Current logo</span>
            </div>
          )}
          <div className="pt-4">
            <Label>Select Logo</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Button onClick={() => setIsLogoSelectorOpen(true)} className="flex items-center space-x-2 text-background cursor-pointer"><Upload className="h-4 w-4" /><span>Choose from Media</span></Button>
            </div>
          </div>
          <AdvancedMediaSelector
            isOpen={isLogoSelectorOpen}
            onOpenChange={setIsLogoSelectorOpen}
            onSelect={(media) => {
              // Modify local state, not dispatch
              setLocalNavbarState(prevState => ({ ...prevState, logo: { url: media.secure_url } }));
              setIsLogoSelectorOpen(false); // Close modal on select
            }}
            mediaType="image"
            title="Select Logo"
            selectedValue={localNavbarState.logo?.url}
          />
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="py-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Navigation Items</CardTitle>
            <CardDescription>Manage your website navigation menu. Drag to reorder items.</CardDescription>
          </div>
          <Button onClick={handleAddItem} className="flex items-center space-x-2 text-background cursor-pointer"><Plus className="h-4 w-4" /><span>Add Item</span></Button>
        </CardHeader>
        <CardContent>
          {localNavbarState.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No navigation items yet</p>
              <Button onClick={handleAddItem} className="text-background"><Plus className="h-4 w-4 mr-2" />Add Your First Item</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {localNavbarState.items.map((item, index) => (
                <DraggableNavItem key={item._id || index} item={item} index={index} onEdit={setEditingItem} onDelete={handleDeleteItem}/>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Item Modal */}
      <Dialog open={!!(editingItem || showAddForm)} onOpenChange={() => { setEditingItem(null); setShowAddForm(false); }}>
        <DialogContent className="bg-background text-primary border-background">
          <DialogHeader><DialogTitle>{editingItem?._id ? "Edit Navigation Item" : "Add New Navigation Item"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">Label</Label>
              <Input value={editingItem?.label || ""} onChange={(e) => setEditingItem((prev) => prev ? { ...prev, label: e.target.value } : null)} placeholder="e.g., Home, About, Contact"/>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 pb-2">URL</Label>
              <Input value={editingItem?.href || ""} onChange={(e) => setEditingItem((prev) => prev ? { ...prev, href: e.target.value } : null)} placeholder="e.g., /, /about, /contact"/>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id={`is-active-${editingItem?._id || "new"}`} checked={editingItem?.isActive || false} onCheckedChange={(checked) => setEditingItem((prev) => prev ? { ...prev, isActive: checked } : null)}/>
              <Label htmlFor={`is-active-${editingItem?._id || "new"}`} className="text-sm text-gray-700">Active (visible in navigation)</Label>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 mt-4">
            <Button onClick={handleSaveItem} disabled={!editingItem?.label || !editingItem?.href} className="bg-primary text-background cursor-pointer"><Save className="h-4 w-4 mr-2" />Save Item</Button>
            <Button variant="outline" className="cursor-pointer" onClick={() => { setEditingItem(null); setShowAddForm(false); }}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}