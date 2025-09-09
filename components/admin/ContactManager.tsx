"use client";

import React, { useEffect, useState } from "react";
import Editor from "@/components/admin/Editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MediaSelectorButton from "@/components/admin/MediaSelectButton";
import type { Section } from "@/redux/slices/pageSlice";
import { Contact, FormInput } from "lucide-react";

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
    details: [
      { icon: "", title: "", description: "" },
      { icon: "", title: "", description: "" },
      { icon: "", title: "", description: "" },
    ],
    formTitle: "",
    formDescription: "",
    mapImage: "",
  });

  // Initialize local data from section content
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

  // Handle local changes and notify parent
  const handleDataChange = (newData: Partial<ContactData>) => {
    const updatedData = { ...localData, ...newData };
    setLocalData(updatedData);

    // Notify parent component of changes
    onChange({
      content: updatedData,
    });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary/90">Contact Details Section</h1>
          <p className="text-muted-foreground">
            Manage contact details, form content, and map image
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <Card className="pb-6 ring-2 ring-primary/20 bg-indigo-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <CardTitle className="flex items-center text-gray-800 py-6">
            <Contact className="h-5 w-5 mr-2 text-blue-600" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localData.details.map((detail, index) => (
            <div
              key={detail._id || index}
              className="space-y-4 p-4 border rounded-lg ring-2 ring-primary/20"
            >
              <Label className="text-primary/90">
                Contact Detail {index + 1}
              </Label>

              {/* Icon Selection */}
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex items-center gap-4">
                  {/* {detail.icon && (
                    <img
                      src={detail.icon}
                      alt={`Icon ${index + 1}`}
                      className="w-8 h-8 object-contain"
                    />
                  )} */}
                  <MediaSelectorButton
                    label="Select Icon"
                    mediaType="image"
                    value={detail.icon}
                    onSelect={(url: string) => handleIconSelect(index, url)}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <Label
                  htmlFor={`detail-title-${index}`}
                  className="pb-2 text-primary/90"
                >
                  Title
                </Label>
                <Input
                  id={`detail-title-${index}`}
                  value={detail.title}
                  onChange={(e) =>
                    handleDetailChange(index, "title", e.target.value)
                  }
                  placeholder="Enter title"
                />
              </div>

              {/* Description */}
              <div>
                <Label
                  htmlFor={`detail-desc-${index}`}
                  className="pb-2 text-primary/90"
                >
                  Description
                </Label>
                <Input
                  id={`detail-desc-${index}`}
                  value={detail.description}
                  onChange={(e) =>
                    handleDetailChange(index, "description", e.target.value)
                  }
                  placeholder="Enter description"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Form Section */}
      <Card className="pb-6 ring-2 ring-primary/20 bg-indigo-50/30">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-blue-200 border-b-2">
          <CardTitle className="flex items-center text-gray-800 py-6">
            <FormInput className="h-5 w-5 mr-2 text-blue-600" />
            Contact Form Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Map Image */}
          <div>
            {/* <Label>Map Image</Label> */}
            {/* {localData.mapImage && (
                <img
                  src={localData.mapImage}
                  alt="Map"
                  className="w-48 h-auto rounded-md bg-gray-200"
                />
              )} */}
            <MediaSelectorButton
              label="Select Map Image"
              mediaType="image"
              value={localData.mapImage}
              onSelect={handleMapImageSelect}
            />
          </div>

          {/* Form Title */}
          <div>
            <Label className="pb-2 text-primary/90">Form Title</Label>
            <Editor
              value={localData.formTitle || ""}
              onEditorChange={handleFormTitleChange}
            />
          </div>

          {/* Form Description */}
          <div>
            <Label className="pb-2 text-primary/90">Form Description</Label>
            <Editor
              value={localData.formDescription || ""}
              onEditorChange={handleFormDescriptionChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManager;
