"use client";

import React, { useEffect, useState } from "react";
import { MediaItem } from "@/redux/slices/mediaSlice";
import { AdvancedMediaSelector } from "@/components/admin/AdvancedMediaSelector";
import BaseSectionManager from "@/components/admin/BaseSectionManager";
import RichTextEditor from "@/components/admin/Editor";
import { useAppDispatch } from "@/redux/hooks";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

interface WhyInvestManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
}

export default function WhyInvestManager({
  section,
  onChange,
  showSaveButton = true,
}: WhyInvestManagerProps = {}) {
  const dispatch = useAppDispatch();

  const [isSelectorOpen, setSelectorOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(
    null
  );

  const [localData, setLocalData] = useState({
    mainTitle: section?.content?.mainTitle || "",
    highlightedTitle: section?.content?.highlightedTitle || "",
    description: section?.content?.description || "",
    investmentPoints: section?.content?.investmentPoints || [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    images: section?.content?.images || ["", "", "", ""],
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (section?.content) {
      const currentContent = JSON.stringify(localData);
      const sectionContent = JSON.stringify({
        mainTitle: section.content.mainTitle || "",
        highlightedTitle: section.content.highlightedTitle || "",
        description: section.content.description || "",
        investmentPoints: section.content.investmentPoints || [
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
        ],
        images: section.content.images || ["", "", "", ""],
      });
      if (currentContent === sectionContent) {
        setHasLocalChanges(false);
        setOriginalData(JSON.parse(JSON.stringify(localData)));
      }
    }
  }, [section]);

  useEffect(() => {
    if (onChange && hasLocalChanges) {
      onChange({ content: localData });
    }
  }, [hasLocalChanges, localData]);

  const handleUpdateMainField = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleInvestmentPointChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setLocalData((prev) => ({
      ...prev,
      investmentPoints: prev.investmentPoints.map((point: any, i: number) =>
        i === index ? { ...point, [field]: value } : point
      ),
    }));
    setHasLocalChanges(true);
  };

  const handleImageChange = (index: number, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      images: prev.images.map((img: any, i: number) =>
        i === index ? value : img
      ),
    }));
    setHasLocalChanges(true);
  };

  const handleOpenSelector = (index: number) => {
    setEditingImageIndex(index);
    setSelectorOpen(true);
  };

  const handleImageSelect = (media: MediaItem) => {
    if (editingImageIndex !== null) {
      handleImageChange(editingImageIndex, media.secure_url);
    }
    setEditingImageIndex(null);
    setSelectorOpen(false);
  };

  const selectedImageValue =
    editingImageIndex !== null
      ? localData.images[editingImageIndex]
      : undefined;

  if (section) {
    return (
      <>
        <BaseSectionManager
          section={section}
          onChange={onChange || (() => {})}
          showSaveButton={showSaveButton}
          title="Why Invest Section"
          description="Configure your investment proposition content"
        >
          <div className="space-y-4">
            {/* Basic Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mainTitle">Main Title</Label>
                <Input
                  id="mainTitle"
                  value={localData.mainTitle}
                  onChange={(e) =>
                    handleUpdateMainField("mainTitle", e.target.value)
                  }
                  placeholder="Main title"
                />
              </div>
              <div>
                <Label htmlFor="highlightedTitle">Highlighted Title</Label>
                <Input
                  id="highlightedTitle"
                  value={localData.highlightedTitle}
                  onChange={(e) =>
                    handleUpdateMainField("highlightedTitle", e.target.value)
                  }
                  placeholder="Highlighted title"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>

              <RichTextEditor
                value={localData.description}
                onEditorChange={(content) =>
                  handleUpdateMainField("description", content)
                }
              />
            </div>

            <p className="font-medium">Investment Points</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {localData.investmentPoints.map((point: any, index: number) => (
                <div key={index} className="p-3 border rounded space-y-2">
                  <div>
                    <Label className="font-medium">Point {index + 1} :</Label>
                    <Input
                      value={point.title}
                      onChange={(e) =>
                        handleInvestmentPointChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Point title"
                      className="text-sm mt-1"
                    />
                  </div>
                  <div>
                    <RichTextEditor
                      value={point.description}
                      onEditorChange={(content) =>
                        handleInvestmentPointChange(
                          index,
                          "description",
                          content
                        )
                      }
                      height={250}
                      id={`investment-description-${index}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-xs flex items-center space-x-1">
                    <span className="w-4 h-4 bg-gray-900 text-primary-foreground rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span>Image {index + 1}</span>
                  </Label>

                  <div className="relative w-full aspect-video rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {localData.images[index] ? (
                      <Image
                        src={localData.images[index]}
                        alt={`Image ${index + 1}`}
                        width={200}
                        height={112}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer"
                    onClick={() => handleOpenSelector(index)}
                  >
                    <ImagePlus className="mr-1 h-3 w-3" />
                    <span className="text-xs">Change</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </BaseSectionManager>

        <AdvancedMediaSelector
          isOpen={isSelectorOpen}
          onOpenChange={setSelectorOpen}
          onSelect={handleImageSelect}
          mediaType="image"
          title={
            editingImageIndex !== null
              ? `Select Image ${editingImageIndex + 1}`
              : "Select an Image"
          }
          selectedValue={selectedImageValue}
        />
      </>
    );
  }
}
