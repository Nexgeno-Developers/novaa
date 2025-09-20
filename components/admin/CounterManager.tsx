"use client";

import { useState, useEffect, useRef } from "react";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  const [localData, setLocalData] = useState({
    title: section?.content?.title || "Why Choose NOVAAA?",
    subtitle:
      section?.content?.subtitle ||
      "Trusted Real Estate Partner Delivering Value, Transparency & Growth",
    cards: section?.content?.cards || [],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [newCard, setNewCard] = useState<CounterCard>({
    number: "",
    title: "",
    description: "",
  });
  const [editingCard, setEditingCard] = useState<string | null>(null);

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "Why Choose NOVAAA?",
        subtitle:
          section.content.subtitle ||
          "Trusted Real Estate Partner Delivering Value, Transparency & Growth",
        cards: section.content.cards || [],
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    }
  }, [section]);

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
      _id: Date.now().toString(),
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
    const updatedCards = localData.cards.filter(
      (_: any, i: number) => i !== index
    );
    setLocalData((prev) => ({
      ...prev,
      cards: updatedCards,
    }));
    setHasLocalChanges(true);
    toast.success("Card deleted successfully");
  };

  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Counter Section"
        description="Configure counter section content and statistics cards"
      >
        <div className="space-y-4">
          {/* Basic Content */}

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Main title"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <div className="min-h-[100px]">
              <RichTextEditor
                value={localData.subtitle}
                onEditorChange={(content) =>
                  handleFieldChange("subtitle", content)
                }
              />
            </div>
          </div>

          {/* Add New Card */}

          <p className="text-sm font-semibold">Add New Counter Card</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="new-number" className="text-sm">
                  Number/Count
                </Label>
                <Input
                  id="new-number"
                  value={newCard.number}
                  onChange={(e) =>
                    setNewCard((prev) => ({
                      ...prev,
                      number: e.target.value,
                    }))
                  }
                  placeholder="e.g., 120+"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="new-title" className="text-xs">
                  Title
                </Label>
                <Input
                  id="new-title"
                  value={newCard.title}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Projects Delivered"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="new-description" className="text-xs">
                  Description
                </Label>
                <Input
                  id="new-description"
                  value={newCard.description}
                  onChange={(e) =>
                    setNewCard((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="e.g., Residential & Commercial Success"
                  className="text-sm"
                />
              </div>
            </div>

            <Button
              onClick={handleAddCard}
              className="w-full cursor-pointer"
              size="sm"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Card
            </Button>
          </div>

          {/* Existing Cards */}

          <p className="text-sm font-semibold">
            Counter Cards ({localData.cards.length})
          </p>

          <div>
            {localData.cards.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No counter cards added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {localData.cards.map((card: CounterCard, index: number) => (
                  <div key={card._id || index} className="p-3 border rounded">
                    {editingCard === card._id ? (
                      <EditCardForm
                        card={card}
                        onSave={(updatedCard) =>
                          handleUpdateCard(index, updatedCard)
                        }
                        onCancel={() => setEditingCard(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Badge variant="secondary" className="text-xs mb-1">
                              Number
                            </Badge>
                            <p className="font-bold text-primary text-sm">
                              {card.number}
                            </p>
                          </div>
                          <div>
                            <Badge variant="secondary" className="text-xs mb-1">
                              Title
                            </Badge>
                            <p className="font-medium text-sm">{card.title}</p>
                          </div>
                          <div>
                            <Badge variant="secondary" className="text-xs mb-1">
                              Description
                            </Badge>
                            <p className="text-xs text-gray-600">
                              {card.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() =>
                              setEditingCard(card._id || index.toString())
                            }
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => handleDeleteCard(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Number/Count</Label>
          <Input
            value={editData.number}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, number: e.target.value }))
            }
            placeholder="e.g., 120+"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Title</Label>
          <Input
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., Projects Delivered"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Input
            value={editData.description}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="e.g., Residential & Commercial Success"
            className="text-sm"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
