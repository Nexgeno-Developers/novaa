"use client";

import React, { useEffect, useState } from "react";
import Editor from "@/components/admin/Editor";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaSelectorButton from "@/components/admin/MediaSelectButton";
import BaseSectionManager from "@/components/admin/BaseSectionManager";
import type { Section } from "@/redux/slices/pageSlice";

interface ContactManagerProps {
  section: Section;
  onChange: (changes: any) => void;
  showSaveButton?: boolean;
}

interface ContactDetail {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

interface ContactData {
  details: ContactDetail[];
  formTitle: string;
  formDescription: string;
  mapImage: string;
}

const ContactManager: React.FC<ContactManagerProps> = ({
  section,
  onChange,
  showSaveButton = false,
}) => {
  const [localData, setLocalData] = useState<ContactData>({
    details: section?.content?.details || [
      { _id: "", icon: "", title: "", description: "" },
      { _id: "", icon: "", title: "", description: "" },
      { _id: "", icon: "", title: "", description: "" },
    ],
    formTitle: section?.content?.formTitle || "",
    formDescription: section?.content?.formDescription || "",
    mapImage: section?.content?.mapImage || "",
  });

  useEffect(() => {
    if (section?.content) {
      setLocalData({
        details: section.content.details || [
          { icon: "", title: "", description: "" },
          { icon: "", title: "", description: "" },
          { icon: "", title: "", description: "" },
        ],
        formTitle: section.content.formTitle || "",
        formDescription: section.content.formDescription || "",
        mapImage: section.content.mapImage || "",
      });
    }
  }, [section]);

  const handleDataChange = (newData: Partial<ContactData>) => {
    const updatedData = { ...localData, ...newData };
    setLocalData(updatedData);
    onChange({ content: updatedData });
  };

  const handleFormTitleChange = (content: string) => {
    handleDataChange({ formTitle: content });
  };

  const handleFormDescriptionChange = (content: string) => {
    handleDataChange({ formDescription: content });
  };

  const handleDetailChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedDetails = [...localData.details];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    handleDataChange({ details: updatedDetails });
  };

  const handleIconSelect = (index: number, url: string) => {
    const updatedDetails = [...localData.details];
    updatedDetails[index] = { ...updatedDetails[index], icon: url };
    handleDataChange({ details: updatedDetails });
  };

  const handleMapImageSelect = (url: string) => {
    handleDataChange({ mapImage: url });
  };

  return (
    <BaseSectionManager
      section={section}
      onChange={onChange}
      showSaveButton={showSaveButton}
      title="Contact Section"
      description="Manage contact details, form content, and map"
    >
      <div className="space-y-4">
        {/* Contact Details */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Contact Details
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localData.details.map((detail, index) => (
              <div
                key={detail._id || index}
                className="space-y-3 p-3 border rounded"
              >
                <Label className="text-xs font-medium">
                  Detail {index + 1}
                </Label>

                <div>
                  <Label className="text-xs">Icon</Label>
                  <MediaSelectorButton
                    label=""
                    mediaType="image"
                    value={detail.icon}
                    onSelect={(url: string) => handleIconSelect(index, url)}
                    placeholder="Select icon"
                  />
                </div>

                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={detail.title}
                    onChange={(e) =>
                      handleDetailChange(index, "title", e.target.value)
                    }
                    placeholder="Enter title"
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={detail.description}
                    onChange={(e) =>
                      handleDetailChange(index, "description", e.target.value)
                    }
                    placeholder="Enter description"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form & Map */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side - Form Content */}
            <div className="space-y-4">
              <div>
                <Label>Form Title</Label>
                <div className="min-h-[100px]">
                  <Editor
                    value={localData.formTitle || ""}
                    onEditorChange={handleFormTitleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label>Form Description</Label>
              <div className="min-h-[100px]">
                <Editor
                  value={localData.formDescription || ""}
                  onEditorChange={handleFormDescriptionChange}
                />
              </div>
            </div>

            {/* Right Side - Map */}
          </div>
          <div>
            <MediaSelectorButton
              label="Map Image"
              mediaType="image"
              value={localData.mapImage}
              onSelect={handleMapImageSelect}
              placeholder="Select map image"
            />
          </div>
        </div>
      </div>
    </BaseSectionManager>
  );
};

export default ContactManager;
