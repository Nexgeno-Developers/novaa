"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Hash, FileText, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Custom Editor Component
import RichTextEditor from "@/components/admin/Editor";
import { useAppDispatch } from "@/redux/hooks";

export interface CounterCard {
  _id?: string;
  number: string;
  title: string;
  description: string;
}

interface CounterManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function CounterManager({
  section,
  onChange,
  showSaveButton = true,
}: CounterManagerProps = {}) {
  const dispatch = useAppDispatch();

  // Use refs to track initialization state
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  // Local state for section-based management
  const [localData, setLocalData] = useState({
    title: section?.content?.title || "Why Choose NOVAAA?",
    subtitle: section?.content?.subtitle || "Trusted Real Estate Partner Delivering Value, Transparency & Growth",
    cards: section?.content?.cards || [],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [newCard, setNewCard] = useState<CounterCard>({
    number: "",
    title: "",
    description: "",
  });
  const [editingCard, setEditingCard] = useState<string | null>(null);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "Why Choose NOVAAA?",
        subtitle: section.content.subtitle || "Trusted Real Estate Partner Delivering Value, Transparency & Growth",
        cards: section.content.cards || [],
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    }
  }, [section]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [localData, hasLocalChanges]);

  const handleFieldChange = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.title || !newCard.description) {
      toast.error("Please fill in all card fields");
      return;
    }

    const cardToAdd = {
      ...newCard,
      _id: Date.now().toString(), // Generate temporary ID
    };

    setLocalData((prev) => ({
      ...prev,
      cards: [...prev.cards, cardToAdd],
    }));

    setNewCard({ number: "", title: "", description: "" });
    setHasLocalChanges(true);
    toast.success("Card added successfully");
  };

  const handleUpdateCard = (index: number, updatedCard: CounterCard) => {
    const updatedCards = localData.cards.map((card: any, i: number) => 
      i === index ? updatedCard : card
    );
    
    setLocalData((prev) => ({
      ...prev,
      cards: updatedCards,
    }));
    
    setHasLocalChanges(true);
    setEditingCard(null);
    toast.success("Card updated successfully");
  };

  const handleDeleteCard = (index: number) => {
    const updatedCards = localData.cards.filter((_: any, i: number) => i !== index);
    setLocalData((prev) => ({
      ...prev,
      cards: updatedCards,
    }));
    setHasLocalChanges(true);
    toast.success("Card deleted successfully");
  };

  // If section prop is provided, render within BaseSectionManager
  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Counter Section"
        description="Configure your counter section content and statistics cards"
      >
        <div className="space-y-6">
          {/* Header Content Section */}
          <Card className="shadow-sm border-0 bg-purple-50/30 ring-2 ring-primary/20">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <Hash className="h-5 w-5 mr-2 text-blue-600" />
                Section Header
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-primary/90">
                  Main Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={localData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  placeholder="Enter main title..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary/90">
                  Subtitle
                </Label>
                <div className="border border-gray-300 rounded-lg">
                  <RichTextEditor
                    value={localData.subtitle}
                    onEditorChange={(content) => handleFieldChange("subtitle", content)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add New Card Section */}
          <Card className="shadow-sm border-0 bg-green-50/30 ring-2 ring-green-200/20">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b-emerald-100 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <Plus className="h-5 w-5 mr-2 text-green-600" />
                Add New Counter Card
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-number" className="text-sm font-medium text-primary/90">
                    Number/Count
                  </Label>
                  <Input
                    id="new-number"
                    value={newCard.number}
                    onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., 120+ or 500+"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-title" className="text-sm font-medium text-primary/90">
                    Title
                  </Label>
                  <Input
                    id="new-title"
                    value={newCard.title}
                    onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., Projects Delivered"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-description" className="text-sm font-medium text-primary/90">
                    Description
                  </Label>
                  <Input
                    id="new-description"
                    value={newCard.description}
                    onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder="e.g., Residential & Commercial Success"
                  />
                </div>
              </div>

              <Button 
                onClick={handleAddCard}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </CardContent>
          </Card>

          {/* Existing Cards Section */}
          <Card className="shadow-sm border-0 bg-orange-50/30 ring-2 ring-orange-200/20">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-xl border-b-amber-100 border-b-2">
              <CardTitle className="flex items-center text-gray-800 py-6">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Counter Cards ({localData.cards.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {localData.cards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No counter cards added yet. Add your first card above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {localData.cards.map((card: CounterCard, index: number) => (
                    <Card key={card._id || index} className="border border-gray-200">
                      <CardContent className="p-4">
                        {editingCard === card._id ? (
                          <EditCardForm
                            card={card}
                            onSave={(updatedCard) => handleUpdateCard(index, updatedCard)}
                            onCancel={() => setEditingCard(null)}
                          />
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Badge variant="secondary" className="mb-1">Number</Badge>
                                <p className="text-lg font-bold text-primary">{card.number}</p>
                              </div>
                              <div>
                                <Badge variant="secondary" className="mb-1">Title</Badge>
                                <p className="font-medium">{card.title}</p>
                              </div>
                              <div>
                                <Badge variant="secondary" className="mb-1">Description</Badge>
                                <p className="text-sm text-gray-600">{card.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCard(card._id || index.toString())}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCard(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </BaseSectionManager>
    );
  }

  return null;
}

// Edit Card Form Component
interface EditCardFormProps {
  card: CounterCard;
  onSave: (updatedCard: CounterCard) => void;
  onCancel: () => void;
}

function EditCardForm({ card, onSave, onCancel }: EditCardFormProps) {
  const [editData, setEditData] = useState<CounterCard>({ ...card });

  const handleSave = () => {
    if (!editData.number || !editData.title || !editData.description) {
      toast.error("Please fill in all fields");
      return;
    }
    onSave(editData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Number/Count</Label>
          <Input
            value={editData.number}
            onChange={(e) => setEditData(prev => ({ ...prev, number: e.target.value }))}
            placeholder="e.g., 120+"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Title</Label>
          <Input
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Projects Delivered"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Description</Label>
          <Input
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g., Residential & Commercial Success"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}