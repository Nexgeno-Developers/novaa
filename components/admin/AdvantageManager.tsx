"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Trash2,
  RefreshCw,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

// Redux
import { AppDispatch, RootState } from "@/redux";
import {
  fetchNovaaAdvantageData,
  saveNovaaAdvantageData,
  updateMainField,
  updateAdvantageItem,
  reorderAdvantages,
} from "@/redux/slices/advantageSlice";

// Shadcn UI and Custom Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import RichTextEditor from "@/components/admin/Editor";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import Image from "next/image";

const NovaaAdvantagesManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, status } = useSelector((state: RootState) => state.advantage);

  // Local state for media selector
  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{
    type: string;
    index?: number;
  } | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNovaaAdvantageData());
    }
  }, [status, dispatch]);

  const handleSaveChanges = () => {
    if (data) {
      dispatch(saveNovaaAdvantageData(data));
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination || !data) return;
    const items = Array.from(data.advantages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch(reorderAdvantages(items));
  };

  const handleRefresh = () => {
    dispatch(fetchNovaaAdvantageData());
  };

  const openMediaSelector = (type: string, index?: number) => {
    setMediaTarget({ type, index });
    setSelectorOpen(true);
  };

  const handleImageSelect = (media: { secure_url: string }) => {
    console.log("Media", media);
    if (!mediaTarget) return;

    const { type, index } = mediaTarget;
    if (type === "bg") {
      dispatch(
        updateMainField({ field: "backgroundImage", value: media.secure_url })
      );
    } else if (type === "logo") {
      dispatch(
        updateMainField({ field: "logoImage", value: media.secure_url })
      );
    } else if (type === "icon" && index !== undefined) {
      dispatch(
        updateAdvantageItem({ index, field: "icon", value: media.secure_url })
      );
    }
    setSelectorOpen(false);
  };

  if (status === "loading" && !data)
    return <div className="p-8">Loading Advantage Manager...</div>;
  if (status === "failed" || !data)
    return <div className="p-8">Could not load data. Try refreshing.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AdvancedMediaSelector
        isOpen={isSelectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleImageSelect}
        mediaType="image"
        title="Select an Image"
        selectedValue={
          mediaTarget?.type === "bg"
            ? data.backgroundImage
            : mediaTarget?.type === "logo"
            ? data.logoImage
            : mediaTarget?.type === "icon" && mediaTarget.index !== undefined
            ? data.advantages[mediaTarget.index].icon
            : undefined
        }
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Novaa Advantage Manager
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={status === "loading"}
            className="bg-primary text-background cursor-pointer "
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${
                status === "loading" ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleSaveChanges}
            className="bg-primary text-background cursor-pointer"
            disabled={status === "loading"}
          >
            <Save className="h-4 w-4 mr-2" />
            {status === "loading" ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="images">Center Image</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Section Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-title">Main Title</Label>
                  <Input
                    id="main-title"
                    placeholder="e.g., THE NOVAA"
                    value={data.title}
                    onChange={(e) =>
                      dispatch(
                        updateMainField({
                          field: "title",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="highlighted-title">Highlighted Title</Label>
                  <Input
                    id="highlighted-title"
                    placeholder="e.g., ADVANTAGE"
                    value={data.highlightedTitle}
                    onChange={(e) =>
                      dispatch(
                        updateMainField({
                          field: "highlightedTitle",
                          value: e.target.value,
                        })
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Main Description</Label>
                <RichTextEditor
                  id="main-description"
                  value={data.description}
                  onEditorChange={(content) =>
                    dispatch(
                      updateMainField({ field: "description", value: content })
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <Card className="py-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Advantage Items</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="advantages">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {data.advantages.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4"
                            >
                              <div className="text-gray-400 hover:text-gray-600 cursor-grab pt-2">
                                <GripVertical />
                              </div>
                              <div className="flex-grow space-y-4">
                                <div className="space-y-2">
                                  <Label>Title</Label>

                                  <Input
                                    value={item.title}
                                    onChange={(e) =>
                                      dispatch(
                                        updateAdvantageItem({
                                          index,
                                          field: "title",
                                          value: e.target.value,
                                        })
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <RichTextEditor
                                    id={`advantage-desc-${item._id}`}
                                    value={item.description}
                                    onEditorChange={(content) =>
                                      dispatch(
                                        updateAdvantageItem({
                                          index,
                                          field: "description",
                                          value: content,
                                        })
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              {/* <div className=`"flex flex-col items-center gap-2">
                                <Label>Icon</Label>
                                <div className="w-20 h-20 rounded-md border flex items-center justify-center bg-gray-50 overflow-hidden">
                                  <Image src={item.icon} alt={item.title} width={80} height={80} className="object-contain" />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => openMediaSelector('icon', index)}>Change</Button>
                                <Button variant="destructive" size="icon" onClick={() => dispatch(removeAdvantageItem(index))}><Trash2 className="h-4 w-4" /></Button>
                              </div> */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card className="py-6">
            <CardHeader>
              <CardTitle>Water Effect Image Components</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-lg font-medium">Background Image</Label>
                <div className="w-full aspect-square rounded-lg border border-dashed flex items-center justify-center bg-gray-300 overflow-hidden">
                  {data.backgroundImage ? (
                    <Image
                      src={data.backgroundImage}
                      alt="Background Preview"
                      width={500}
                      height={300}
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <Button
                  className="w-full text-primary cursor-pointer"
                  variant="outline"
                  onClick={() => openMediaSelector("bg")}
                >
                  Select Background Image
                </Button>
              </div>
              <div className="space-y-3">
                <Label className="text-lg font-medium">Center Logo Image</Label>
                <div className="w-full aspect-square rounded-lg bg-gray-300 border border-dashed flex items-center justify-center overflow-hidden">
                  {data.logoImage ? (
                    <Image
                      src={data.logoImage}
                      alt="Logo Preview"
                      width={300}
                      height={300}
                      className="object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <Button
                  className="w-full text-primary cursor-pointer"
                  variant="outline"
                  onClick={() => openMediaSelector("logo")}
                >
                  Select Logo Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NovaaAdvantagesManager;
