// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux";
// import {
//   fetchOurStory,
//   updateOurStory,
//   OurStory,
// } from "@/redux/slices/ourStorySlice";
// import { Loader2 } from "lucide-react";

// // Shadcn UI Components
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { toast } from "sonner";

// // Custom Components
// import MediaSelectButton from "@/components/admin/MediaSelectButton"; // Adjust path if needed
// import Editor from "@/components/admin/Editor";

// const manageablePages = [
//   { slug: "about-us", label: "About Us" },
//   // Add more pages that have an info section here
// ];

// const OurStoryManager = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { data, status } = useSelector((state: RootState) => state.infoSection);

//   const [selectedSlug, setSelectedSlug] = useState(manageablePages[0].slug);
//   const [formData, setFormData] = useState<Partial<OurStory>>({
//     title: "",
//     description: "",
//     mediaType: "video",
//     mediaUrl: "",
//   });

//   useEffect(() => {
//     if (selectedSlug) {
//       dispatch(fetchOurStory(selectedSlug));
//     }
//   }, [dispatch, selectedSlug]);

//   useEffect(() => {
//     if (data) {
//       setFormData(data);
//     }
//   }, [data]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleMediaTypeChange = (value: "image" | "video") => {
//     // When changing type, clear the URL to avoid saving an image URL for a video type and vice-versa
//     setFormData((prev) => ({ ...prev, mediaType: value, mediaUrl: "" }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await dispatch(
//         updateOurStory({ slug: selectedSlug, data: formData })
//       ).unwrap();
//       toast.success("Info section has been updated.");
//     } catch (error) {
//       toast.error("Failed to update info section.");
//     }
//   };

//   if (status === "loading" && (!data || data.pageSlug !== selectedSlug)) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="h-16 w-16 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Info Section Manager</h1>
//           <p className="text-muted-foreground">
//             Manage the main info content for different pages.
//           </p>
//         </div>
//         <Button onClick={handleSubmit} disabled={status === "loading"} className="text-background cursor-pointer">
//           {status === "loading" && (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           )}
//           Save Changes
//         </Button>
//       </div>

//       <Card className="py-6">
//         <CardHeader>
//           <CardTitle>Select Page to Edit</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select value={selectedSlug} onValueChange={setSelectedSlug}>
//             <SelectTrigger className="w-[280px]">
//               <SelectValue placeholder="Select a page" />
//             </SelectTrigger>
//             <SelectContent>
//               {manageablePages.map((page) => (
//                 <SelectItem key={page.slug} value={page.slug}>
//                   {page.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="py-6">
//           <CardHeader>
//             <CardTitle>Content</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="e.g., OUR STORY"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Editor
//                 value={formData.description || ""}
//                 onEditorChange={(content) =>
//                   setFormData((prev) => ({ ...prev, description: content }))
//                 }
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="py-6">
//           <CardHeader>
//             <CardTitle>Media (Image or Video)</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label>Media Type</Label>
//               <RadioGroup
//                 value={formData.mediaType}
//                 onValueChange={handleMediaTypeChange}
//                 className="flex items-center space-x-4"
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="video" id="video" />
//                   <Label htmlFor="video">Video</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="image" id="image" />
//                   <Label htmlFor="image">Image</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//             {formData.mediaType === "video" && (
//               <MediaSelectButton
//                 label="Select Video"
//                 mediaType="video"
//                 value={formData.mediaUrl || ""}
//                 onSelect={(url) =>
//                   setFormData((prev) => ({ ...prev, mediaUrl: url }))
//                 }
//               />
//             )}
//             {formData.mediaType === "image" && (
//               <MediaSelectButton
//                 label="Select Image"
//                 mediaType="image"
//                 value={formData.mediaUrl || ""}
//                 onSelect={(url) =>
//                   setFormData((prev) => ({ ...prev, mediaUrl: url }))
//                 }
//               />
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default OurStoryManager;

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Images, Video, Sparkles } from "lucide-react";

// Custom Components
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import Editor from "@/components/admin/Editor";
import BaseSectionManager from "@/components/admin/BaseSectionManager";

interface OurStoryManagerProps {
  section?: any;
  onChange?: (changes: any) => void;
  showSaveButton?: boolean;
  pageSlug?: string;
}

export default function OurStoryManager({
  section,
  onChange,
  showSaveButton = true,
  pageSlug
}: OurStoryManagerProps) {
  // Use refs to track initialization state
  const isInitializedRef = useRef(false);
  const initialDataSetRef = useRef(false);

  // Local state for section-based management
  const [localData, setLocalData] = useState({
    title: section?.content?.title || "",
    description: section?.content?.description || "",
    mediaType: section?.content?.mediaType || "video",
    mediaUrl: section?.content?.mediaUrl || "",
  });

  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // Initialize data when section prop changes
  useEffect(() => {
    if (section?.content && !initialDataSetRef.current) {
      const newData = {
        title: section.content.title || "",
        description: section.content.description || "",
        mediaType: section.content.mediaType || "video",
        mediaUrl: section.content.mediaUrl || "",
      };
      setLocalData(newData);
      initialDataSetRef.current = true;
      isInitializedRef.current = true;
    }
  }, [section]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && hasLocalChanges && isInitializedRef.current) {
      onChange({ content: localData });
    }
  }, [localData, hasLocalChanges]);

  const handleFieldChange = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    setHasLocalChanges(true);
  };

  const handleEditorChange = (content: string) => {
    handleFieldChange('description', content);
  };

  const handleMediaTypeChange = (value: "image" | "video") => {
    // When changing type, clear the URL to avoid saving an image URL for a video type and vice-versa
    setLocalData((prev) => ({ ...prev, mediaType: value, mediaUrl: "" }));
    setHasLocalChanges(true);
  };

  const handleMediaSelect = (url: string) => {
    handleFieldChange('mediaUrl', url);
  };

  // If section prop is provided, render within BaseSectionManager
  if (section) {
    return (
      <BaseSectionManager
        section={section}
        onChange={onChange || (() => {})}
        showSaveButton={showSaveButton}
        title="Our Story Section"
        description="Configure the main story content and media for this page"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Section */}
            <Card className="shadow-sm border-0 bg-white ring-2 ring-primary/20">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b-2 border-b-indigo-200">
                <CardTitle className="flex items-center text-gray-800 py-6">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-primary/90">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={localData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="e.g., OUR STORY"
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary/90">Description</Label>
                  <div className="border border-gray-300 rounded-lg">
                    <Editor
                      value={localData.description}
                      onEditorChange={handleEditorChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Section */}
            <Card className="shadow-sm border-0 bg-white ring-2 ring-primary/20">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl border-b-2 border-b-indigo-200">
                <CardTitle className="flex items-center text-gray-800 py-6">
                  <Images className="h-5 w-5 mr-2 text-purple-600" />
                  Media (Image or Video)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-primary/90">Media Type</Label>
                  <RadioGroup
                    value={localData.mediaType}
                    onValueChange={handleMediaTypeChange}
                    className="flex items-center space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="flex items-center cursor-pointer">
                        <Video className="h-4 w-4 mr-1 text-purple-500" />
                        Video
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="image" id="image" />
                      <Label htmlFor="image" className="flex items-center cursor-pointer">
                        <Images className="h-4 w-4 mr-1 text-blue-500" />
                        Image
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  {localData.mediaType === "video" ? (
                    <MediaSelectButton
                      label="Select Video"
                      mediaType="video"
                      value={localData.mediaUrl}
                      onSelect={handleMediaSelect}
                      placeholder="Select background video..."
                    />
                  ) : (
                    <MediaSelectButton
                      label="Select Image"
                      mediaType="image"
                      value={localData.mediaUrl}
                      onSelect={handleMediaSelect}
                      placeholder="Select background image..."
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </BaseSectionManager>
    );
  }

  // Fallback if no section prop (shouldn't happen in your use case)
  return null;
}
