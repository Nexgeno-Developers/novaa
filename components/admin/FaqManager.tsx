"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, RefreshCw, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import {
  fetchFaqData,
  saveFaqData,
  updateMainField,
  addFaqItem,
  removeFaqItem,
  updateFaqItem,
  reorderFaqs,
} from "@/redux/slices/faqslice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/admin/Editor";
import BaseSectionManager from "@/components/admin/BaseSectionManager";
import MediaSelectButton from "./MediaSelectButton";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqData {
  title: string;
  description: string;
  backgroundImage: string;
  faqs: FaqItem[];
}

interface FaqManagerProps {
  section: any;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

const FaqManagerContent = ({
  section,
  onChange,
  showSaveButton = true,
}: {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.faq);

  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);
  const userHasInteractedRef = useRef(false);

  const defaultData: FaqData = {
    title: "",
    description: "",
    backgroundImage: "",
    faqs: [],
  };

  const [faqData, setFaqData] = useState<FaqData>(defaultData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleOnChange = useCallback(
    (changes: any) => {
      if (onChange && userHasInteractedRef.current) {
        onChange(changes);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const sectionData = section.content;
      setFaqData((prev) => ({ ...prev, ...sectionData }));
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    } else if (!section && !isInitializedRef.current) {
      if (data) {
        setFaqData(data);
      } else {
        setFaqData(defaultData);
      }
      isInitializedRef.current = true;
    }
  }, [section, data]);

  useEffect(() => {
    if (!section && status === "idle") {
      dispatch(fetchFaqData());
    }
  }, [dispatch, section, status]);

  useEffect(() => {
    if (onChange && userHasInteractedRef.current && initialDataSetRef.current) {
      onChange({ content: faqData });
      setHasUnsavedChanges(true);
    }
  }, [faqData]);

  useEffect(() => {
    if (!section && data && !initialDataSetRef.current) {
      setFaqData(data);
      initialDataSetRef.current = true;
    }
  }, [data, section]);

  const updateFaqData = useCallback((updates: Partial<FaqData>) => {
    userHasInteractedRef.current = true;
    setFaqData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleMainFieldUpdate = useCallback(
    (field: keyof FaqData, value: string) => {
      userHasInteractedRef.current = true;
      setFaqData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSaveChanges = async () => {
    try {
      if (section) {
        toast.success("Changes saved to page!");
        setHasUnsavedChanges(false);
      } else {
        await dispatch(saveFaqData(faqData)).unwrap();
        toast.success("FAQ data saved successfully!");
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error saving FAQ data:", error);
      toast.error("Failed to save FAQ data");
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(faqData.faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    userHasInteractedRef.current = true;
    setFaqData((prev) => ({ ...prev, faqs: items }));

    if (!section) {
      dispatch(reorderFaqs(items));
    }
  };

  const addNewFaq = () => {
    const newFaq: FaqItem = {
      _id: uuidv4(),
      question: "",
      answer: "",
      order: 0,
    };

    userHasInteractedRef.current = true;
    setFaqData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, newFaq],
    }));

    if (!section) {
      dispatch(addFaqItem());
    }
  };

  const handleRemoveFaq = (index: number) => {
    userHasInteractedRef.current = true;
    setFaqData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));

    if (!section) {
      dispatch(removeFaqItem(index));
    }
  };

  const handleUpdateFaqItem = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    userHasInteractedRef.current = true;
    setFaqData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));

    if (!section) {
      dispatch(updateFaqItem({ index, field, value }));
    }
  };

  const handleRefresh = () => {
    if (!section) {
      dispatch(fetchFaqData());
    }
    userHasInteractedRef.current = false;
    initialDataSetRef.current = false;
    setHasUnsavedChanges(false);
  };

  if (status === "loading" && !section && !faqData) {
    return <div className="p-8">Loading FAQ Manager...</div>;
  }

  if (status === "failed" && !section) {
    return <div className="p-8">Could not load data. Try refreshing.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header - only show in standalone mode */}
      {showSaveButton && !section && (
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">FAQ Manager</h1>
            {hasUnsavedChanges && (
              <p className="text-sm text-orange-600">Unsaved changes</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={status === "loading"}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${
                  status === "loading" ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleSaveChanges}
              size="sm"
              disabled={status === "loading"}
            >
              <Save className="h-4 w-4 mr-1" />
              {status === "loading" ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}

      {/* Basic Content */}
      <div>
        <Label>Title</Label>
        <Input
          value={faqData.title}
          onChange={(e) => handleMainFieldUpdate("title", e.target.value)}
          placeholder="FAQ section title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <div className="min-h-[100px]">
          <RichTextEditor
            value={faqData.description}
            onEditorChange={(content) =>
              handleMainFieldUpdate("description", content)
            }
          />
        </div>
      </div>

      <div>
        <MediaSelectButton
          value={faqData.backgroundImage}
          onSelect={(value) => handleMainFieldUpdate("backgroundImage", value)}
          mediaType="image"
          label="Background Image"
          placeholder="Select background image"
        />
      </div>

      {/* FAQ Items */}

          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">FAQ Items</p>
            <Button size="sm" onClick={addNewFaq} className="cursor-pointer">
              <Plus className="h-3 w-3 mr-1" />
              Add FAQ
            </Button>
          </div>

        <div>
          {faqData.faqs.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm mb-3">No FAQs added yet</p>
              <Button size="sm" onClick={addNewFaq}>
                <Plus className="h-4 w-4 mr-2" />
                Add First FAQ
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="faqs">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {faqData.faqs.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="p-3 border rounded bg-white flex items-start gap-3"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="text-gray-400 hover:text-gray-600 cursor-grab pt-2"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex-grow space-y-3">
                              <div>
                                <Label className="text-xs">Question</Label>
                                <Input
                                  value={item.question}
                                  onChange={(e) =>
                                    handleUpdateFaqItem(
                                      index,
                                      "question",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter question"
                                  className="text-sm"
                                />
                              </div>

                              <div>
                                <Label className="text-xs">Answer</Label>
                                <div className="min-h-[80px]">
                                  <RichTextEditor
                                    value={item.answer}
                                    onEditorChange={(content) =>
                                      handleUpdateFaqItem(
                                        index,
                                        "answer",
                                        content
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => handleRemoveFaq(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
    </div>
  );
};

export default function FaqManager({
  section,
  onChange,
  showSaveButton = false,
}: FaqManagerProps) {
  if (!section || !onChange) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
        <p className="text-gray-600">
          This manager can only be used within the global page management
          system.
        </p>
      </div>
    );
  }

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="FAQ Section"
      description="Manage frequently asked questions"
    >
      <FaqManagerContent
        section={section}
        onChange={onChange}
        showSaveButton={false}
      />
    </BaseSectionManager>
  );
}
