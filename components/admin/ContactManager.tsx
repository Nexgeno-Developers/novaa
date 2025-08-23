"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import {
  fetchContactData,
  updateContactData,
  setContactData,
  setContactDetail,
} from "@/redux/slices/contactSlice";
import Editor from "@/components/admin/Editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Using sonner for notifications
import MediaSelectorButton from "@/components/admin/MediaSelectButton"; // Adjust import path
import { Loader2 } from "lucide-react";

const ContactManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.contact
  );
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchContactData());
  }, [dispatch]);

  const handleFormTitleChange = (content: string) => {
    dispatch(setContactData({ formTitle: content }));
  };

  const handleFormDescriptionChange = (content: string) => {
    dispatch(setContactData({ formDescription: content }));
  };

  const handleDetailChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    dispatch(setContactDetail({ index, field, value }));
  };

  const handleIconSelect = (index: number, url: string) => {
    dispatch(setContactDetail({ index, field: "icon", value: url }));
  };

  const handleMapImageSelect = (url: string) => {
    dispatch(setContactData({ mapImage: url }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const promise = dispatch(updateContactData(data)).unwrap();

    toast.promise(promise, {
      loading: "Saving changes...",
      success: "Contact page updated successfully!",
      error: "Failed to update contact page.",
    });

    try {
      await promise;
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !data.details.length) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Details Section</h1>
        <Button size={"lg"} onClick={handleSave} disabled={isSaving} className='text-background cursor-pointer'>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
      <Card className="py-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.details.map((detail, index) => (
            <div
              key={detail._id || index}
              className="space-y-4 p-4 border rounded-lg"
            >
              <Label>Icon {index + 1}</Label>
              <div className="flex items-center gap-4">
                <MediaSelectorButton
                  label="Select Icon"
                  mediaType="image"
                  value={detail.icon}
                  onSelect={(url: string) => handleIconSelect(index, url)}
                />
              </div>
              <div>
                <Label htmlFor={`detail-title-${index}`}>Title</Label>
                <Input
                  id={`detail-title-${index}`}
                  value={detail.title}
                  onChange={(e) =>
                    handleDetailChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`detail-desc-${index}`}>Description</Label>
                <Input
                  id={`detail-desc-${index}`}
                  value={detail.description}
                  onChange={(e) =>
                    handleDetailChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="py-6">
        <CardHeader>
          <CardTitle>Contact Form Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Map Image</Label>
            <div className="flex flex-col items-start gap-4 mt-2">
              <img
                src={data.mapImage}
                alt="Map"
                className="w-48 h-auto rounded-md bg-gray-200"
              />
              <MediaSelectorButton
                label="Select Map Image"
                mediaType="image"
                value={data.mapImage}
                onSelect={handleMapImageSelect}
              />
            </div>
          </div>
          <div>
            <Label>Form Title</Label>
            <Editor
              value={data.formTitle || ""}
              onEditorChange={(content) =>
                dispatch(setContactData({ formTitle: content }))
              }
            />
          </div>
          <div>
            <Label>Form Description</Label>

            <Editor
              value={data.formDescription || ""}
              onEditorChange={(content) =>
                dispatch(setContactData({ formDescription: content }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManager;
