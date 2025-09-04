"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { RootState } from "@/redux";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/redux/slices/projectsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import Editor from "@/components/admin/Editor";
import MediaMultiSelectButton from "@/components/admin/MediaMultiSelectButton";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import { useAppDispatch } from "@/redux/hooks";

// Updated interfaces
interface ProjectHighlight {
  image: string;
  title: string;
}

interface KeyHighlight {
  text: string;
}

interface Amenity {
  image: string;
  title: string;
}

interface MasterPlanTab {
  title: string;
  subtitle?: string;
  subtitle2?: string;
  image: string;
}

interface InvestmentPlan {
  paymentPlan: string;
  guaranteedReturn: string;
  returnStartDate: string;
}

interface Project {
  _id: string;
  name: string;
  price: string;
  images: string[];
  location: string;
  description: string;
  badge: string;
  category: {
    _id: string;
    name: string;
  };
  categoryName: string;
  isActive: boolean;
  order: number;
  projectDetail: {
    hero: {
      backgroundImage: string;
      title: string;
      subtitle: string;
      scheduleMeetingButton: string;
      getBrochureButton: string;
      brochurePdf: string;
    };
    projectHighlights: {
      backgroundImage: string;
      description: string;
      highlights: ProjectHighlight[];
    };
    keyHighlights: {
      backgroundImage: string;
      description: string;
      highlights: KeyHighlight[];
    };
    modernAmenities: {
      title: string;
      description: string;
      amenities: Amenity[];
    };
    masterPlan: {
      title: string;
      subtitle: string;
      description: string;
      backgroundImage: string;
      tabs: MasterPlanTab[];
    };
    investmentPlans: {
      title: string;
      description: string;
      backgroundImage: string;
      plans: InvestmentPlan[];
    };
  };
}

export default function ProjectsManager() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Basic form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: [] as string[],
    location: "",
    description: "",
    badge: "",
    category: "",
    categoryName: "",
    isActive: true,
    order: 0,
  });

  // Updated project detail form data
  const [projectDetailData, setProjectDetailData] = useState({
    hero: {
      backgroundImage: "",
      title: "",
      subtitle: "",
      scheduleMeetingButton: "Schedule a meeting",
      getBrochureButton: "Get Brochure",
      brochurePdf: "",
    },
    projectHighlights: {
      backgroundImage: "",
      description: "",
      highlights: [] as ProjectHighlight[],
    },
    keyHighlights: {
      backgroundImage: "",
      description: "",
      highlights: [] as KeyHighlight[],
    },
    modernAmenities: {
      title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
      description: "",
      amenities: [] as Amenity[],
    },
    masterPlan: {
      title: "",
      subtitle: "",
      description: "",
      backgroundImage: "",
      tabs: [] as MasterPlanTab[],
    },
    investmentPlans: {
      title: "LIMITED-TIME INVESTMENT PLANS",
      description: "Secure high returns with exclusive, time-sensitive opportunities.",
      backgroundImage: "",
      plans: [] as InvestmentPlan[],
    },
  });

  // Temporary states for adding new items
  const [newProjectHighlight, setNewProjectHighlight] = useState({
    image: "",
    title: "",
  });
  const [newKeyHighlight, setNewKeyHighlight] = useState({ text: "" });
  const [newAmenity, setNewAmenity] = useState({ image: "", title: "" });
  const [newMasterPlanTab, setNewMasterPlanTab] = useState({
    title: "",
    subtitle: "",
    subtitle2: "",
    image: "",
  });
  const [newInvestmentPlan, setNewInvestmentPlan] = useState({
    paymentPlan: "",
    guaranteedReturn: "",
    returnStartDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      images: [],
      location: "",
      description: "",
      badge: "",
      category: "",
      categoryName: "",
      isActive: true,
      order: projects.length,
    });

    setProjectDetailData({
      hero: {
        backgroundImage: "",
        title: "",
        subtitle: "",
        scheduleMeetingButton: "Schedule a meeting",
        getBrochureButton: "Get Brochure",
        brochurePdf: "",
      },
      projectHighlights: {
        backgroundImage: "",
        description: "",
        highlights: [],
      },
      keyHighlights: {
        backgroundImage: "",
        description: "",
        highlights: [],
      },
      modernAmenities: {
        title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
        description: "",
        amenities: [],
      },
      masterPlan: {
        title: "",
        subtitle: "",
        description: "",
        backgroundImage: "",
        tabs: [],
      },
      investmentPlans: {
        title: "LIMITED-TIME INVESTMENT PLANS",
        description: "Secure high returns with exclusive, time-sensitive opportunities.",
        backgroundImage: "",
        plans: [],
      },
    });

    setEditingProject(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      price: project.price,
      images: project.images,
      location: project.location,
      description: project.description,
      badge: project.badge || "",
      category: project.category._id,
      categoryName: project.categoryName,
      isActive: project.isActive,
      order: project.order,
    });

    // Set project detail data if exists
    if (project.projectDetail) {
      setProjectDetailData({
        ...project.projectDetail,
        masterPlan: {
          title: project.projectDetail.masterPlan?.title || "",
          subtitle: project.projectDetail.masterPlan?.subtitle || "",
          description: project.projectDetail.masterPlan?.description || "",
          backgroundImage: project.projectDetail.masterPlan?.backgroundImage || "",
          tabs: project.projectDetail.masterPlan?.tabs || [],
        },
        investmentPlans: {
          title: project.projectDetail.investmentPlans?.title || "LIMITED-TIME INVESTMENT PLANS",
          description: project.projectDetail.investmentPlans?.description || "Secure high returns with exclusive, time-sensitive opportunities.",
          backgroundImage: project.projectDetail.investmentPlans?.backgroundImage || "",
          plans: project.projectDetail.investmentPlans?.plans || [],
        },
      });
    }

    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategoryObj = categories.find(
        (cat) => cat._id === formData.category
      );

      if (!selectedCategoryObj) {
        toast.error("Invalid category selected.");
        setIsSubmitting(false);
        return;
      }

      const finalProjectDetailData = {
        ...projectDetailData,
        hero: {
          ...projectDetailData.hero,
          title: projectDetailData.hero.title || formData.name,
        },
      };

      const projectData = {
        ...formData,
        category: {
          _id: selectedCategoryObj._id,
          name: selectedCategoryObj.name,
        },
        categoryName: selectedCategoryObj.name,
        projectDetail: finalProjectDetailData,
      };

      if (editingProject) {
        await dispatch(
          updateProject({
            id: editingProject._id,
            data: projectData,
          })
        ).unwrap();
        toast.success("Project updated successfully");
      } else {
        await dispatch(createProject(projectData)).unwrap();
        toast.success("Project created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${editingProject ? "update" : "create"} project`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error("Failed to delete project");
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectDetailChange = (
    section: string,
    field: string,
    value: any
  ) => {
    setProjectDetailData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleImagesSelect = (selectedImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: selectedImages,
    }));
  };

  // Add new project highlight
  const addProjectHighlight = () => {
    if (newProjectHighlight.image && newProjectHighlight.title) {
      setProjectDetailData((prev) => ({
        ...prev,
        projectHighlights: {
          ...prev.projectHighlights,
          highlights: [
            ...prev.projectHighlights.highlights,
            newProjectHighlight,
          ],
        },
      }));
      setNewProjectHighlight({ image: "", title: "" });
    } else {
      toast.error("Please fill in all fields for the project highlight");
    }
  };

  // Remove project highlight
  const removeProjectHighlight = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      projectHighlights: {
        ...prev.projectHighlights,
        highlights: prev.projectHighlights.highlights.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  // Add new key highlight
  const addKeyHighlight = () => {
    if (newKeyHighlight.text) {
      setProjectDetailData((prev) => ({
        ...prev,
        keyHighlights: {
          ...prev.keyHighlights,
          highlights: [...prev.keyHighlights.highlights, newKeyHighlight],
        },
      }));
      setNewKeyHighlight({ text: "" });
    } else {
      toast.error("Please enter highlight text");
    }
  };

  // Remove key highlight
  const removeKeyHighlight = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      keyHighlights: {
        ...prev.keyHighlights,
        highlights: prev.keyHighlights.highlights.filter((_, i) => i !== index),
      },
    }));
  };

  // Add new amenity
  const addAmenity = () => {
    if (newAmenity.image && newAmenity.title) {
      setProjectDetailData((prev) => ({
        ...prev,
        modernAmenities: {
          ...prev.modernAmenities,
          amenities: [...prev.modernAmenities.amenities, newAmenity],
        },
      }));
      setNewAmenity({ image: "", title: "" });
    } else {
      toast.error("Please fill in all fields for the amenity");
    }
  };

  // Remove amenity
  const removeAmenity = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      modernAmenities: {
        ...prev.modernAmenities,
        amenities: prev.modernAmenities.amenities.filter((_, i) => i !== index),
      },
    }));
  };

  // Add new master plan tab
  const addMasterPlanTab = () => {
    if (newMasterPlanTab.title && newMasterPlanTab.image) {
      setProjectDetailData((prev) => ({
        ...prev,
        masterPlan: {
          ...prev.masterPlan,
          tabs: [...prev.masterPlan.tabs, newMasterPlanTab],
        },
      }));
      setNewMasterPlanTab({ title: "", subtitle: "", subtitle2: "", image: "" });
    } else {
      toast.error("Please fill in title and image for the master plan tab");
    }
  };

  // Remove master plan tab
  const removeMasterPlanTab = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      masterPlan: {
        ...prev.masterPlan,
        tabs: prev.masterPlan.tabs.filter((_, i) => i !== index),
      },
    }));
  };

  // Add new investment plan
  const addInvestmentPlan = () => {
    if (newInvestmentPlan.paymentPlan && newInvestmentPlan.guaranteedReturn && newInvestmentPlan.returnStartDate) {
      setProjectDetailData((prev) => ({
        ...prev,
        investmentPlans: {
          ...prev.investmentPlans,
          plans: [...prev.investmentPlans.plans, newInvestmentPlan],
        },
      }));
      setNewInvestmentPlan({ paymentPlan: "", guaranteedReturn: "", returnStartDate: "" });
    } else {
      toast.error("Please fill in all fields for the investment plan");
    }
  };

  // Remove investment plan
  const removeInvestmentPlan = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      investmentPlans: {
        ...prev.investmentPlans,
        plans: prev.investmentPlans.plans.filter((_, i) => i !== index),
      },
    }));
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || project.category._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreateDialog}
              className="text-background cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingProject ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-8 rounded-2xl p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg h-15">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Basic Info
                </TabsTrigger>

                <TabsTrigger
                  value="hero"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Hero Section
                </TabsTrigger>

                <TabsTrigger
                  value="project-highlights"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Project Highlights
                </TabsTrigger>

                <TabsTrigger
                  value="key-highlights"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Key Highlights
                </TabsTrigger>

                <TabsTrigger
                  value="amenities"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Amenities
                </TabsTrigger>

                <TabsTrigger
                  value="master-plan"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Master Plan
                </TabsTrigger>

                <TabsTrigger
                  value="investment-plans"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-sm font-medium text-gray-300 rounded-xl px-4 py-2 transition-all duration-300 ease-in-out hover:bg-white/10 hover:text-white"
                >
                  Investment Plans
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName" className="text-primary">
                        Project Name *
                      </Label>
                      <Input
                        id="projectName"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-gray-300"
                        placeholder="Enter project name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectPrice" className="text-primary">
                        Price *
                      </Label>
                      <Input
                        id="projectPrice"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className="text-gray-300"
                        placeholder="e.g., ₹ 4.8 Cr"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectLocation" className="text-primary">
                        Location *
                      </Label>
                      <Input
                        id="projectLocation"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="text-gray-300"
                        placeholder="Enter location"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectBadge" className="text-primary">
                        Badge (Optional)
                      </Label>
                      <Input
                        id="projectBadge"
                        value={formData.badge}
                        onChange={(e) =>
                          handleInputChange("badge", e.target.value)
                        }
                        className="text-gray-300"
                        placeholder="e.g., Elora, Featured"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectCategory" className="text-primary">
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger className="text-gray-300 cursor-pointer">
                          <SelectValue
                            placeholder="Select category"
                            className="text-gray-300 placeholder:text-gray-300"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat.isActive)
                            .map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectOrder" className="text-primary">
                        Display Order
                      </Label>
                      <Input
                        id="projectOrder"
                        type="number"
                        className="text-gray-300"
                        value={formData.order}
                        onChange={(e) =>
                          handleInputChange(
                            "order",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">Project Images *</Label>
                    <MediaMultiSelectButton
                      onImagesSelect={handleImagesSelect}
                      selectedImages={formData.images}
                      multiple={true}
                      label="Select Project Images"
                      mediaType="image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="projectDescription"
                      className="text-primary"
                    >
                      Description *
                    </Label>
                    <div className="min-h-[200px]">
                      <Editor
                        value={formData.description}
                        onEditorChange={(content) =>
                          handleInputChange("description", content)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="projectActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isActive", checked)
                      }
                    />
                    <Label htmlFor="projectActive" className="text-primary">
                      Active
                    </Label>
                  </div>
                </TabsContent>

                {/* Hero Section Tab */}
                <TabsContent value="hero" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heroTitle" className="text-primary">
                        Hero Title
                      </Label>
                      <Input
                        id="heroTitle"
                        value={projectDetailData.hero.title}
                        className="text-gray-300"
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "hero",
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Will use project name if empty"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="heroSubtitle" className="text-primary">
                        Hero Subtitle
                      </Label>
                      <Input
                        id="heroSubtitle"
                        value={projectDetailData.hero.subtitle}
                        className="text-gray-300"
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "hero",
                            "subtitle",
                            e.target.value
                          )
                        }
                        placeholder="Enter subtitle"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="scheduleMeetingButton"
                        className="text-primary"
                      >
                        Schedule Meeting Button Text
                      </Label>
                      <Input
                        id="scheduleMeetingButton"
                        className="text-gray-300"
                        value={projectDetailData.hero.scheduleMeetingButton}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "hero",
                            "scheduleMeetingButton",
                            e.target.value
                          )
                        }
                        placeholder="Schedule a meeting"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="getBrochureButton"
                        className="text-primary"
                      >
                        Get Brochure Button Text
                      </Label>
                      <Input
                        id="getBrochureButton"
                        value={projectDetailData.hero.getBrochureButton}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "hero",
                            "getBrochureButton",
                            e.target.value
                          )
                        }
                        placeholder="Get Brochure"
                        className="text-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <MediaSelectButton
                      value={projectDetailData.hero.backgroundImage}
                      onSelect={(url) =>
                        handleProjectDetailChange(
                          "hero",
                          "backgroundImage",
                          url
                        )
                      }
                      mediaType="image"
                      label="Hero Background Image"
                      placeholder="Select background image for hero section"
                    />
                  </div>

                  <div className="space-y-2">
                    <MediaSelectButton
                      value={projectDetailData.hero.brochurePdf}
                      onSelect={(url) =>
                        handleProjectDetailChange("hero", "brochurePdf", url)
                      }
                      mediaType="pdf"
                      label="Brochure PDF"
                      placeholder="Select PDF brochure for download"
                    />
                  </div>
                </TabsContent>

                {/* Project Highlights Tab */}
                <TabsContent value="project-highlights" className="space-y-6">
                  <div className="space-y-2">
                    <MediaSelectButton
                      value={
                        projectDetailData.projectHighlights.backgroundImage
                      }
                      onSelect={(url) =>
                        handleProjectDetailChange(
                          "projectHighlights",
                          "backgroundImage",
                          url
                        )
                      }
                      mediaType="image"
                      label="Project Highlights Background Image"
                      placeholder="Select background image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">
                      Project Highlights Description
                    </Label>
                    <div className="min-h-[150px]">
                      <Editor
                        value={projectDetailData.projectHighlights.description}
                        onEditorChange={(content) =>
                          handleProjectDetailChange(
                            "projectHighlights",
                            "description",
                            content
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Add New Project Highlight */}
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle>Add New Project Highlight</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <MediaSelectButton
                            value={newProjectHighlight.image}
                            onSelect={(url) =>
                              setNewProjectHighlight((prev) => ({
                                ...prev,
                                image: url,
                              }))
                            }
                            mediaType="image"
                            label="Select Highlight Image"
                            placeholder="Select highlight image"
                          />
                        </div>

                        <div className="space-y-2 pt-4">
                          <Label
                            htmlFor="highlightTitle"
                            className="text-primary"
                          >
                            Highlight Title
                          </Label>
                          <Input
                            id="highlightTitle"
                            value={newProjectHighlight.title}
                            onChange={(e) =>
                              setNewProjectHighlight((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Enter highlight title"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addProjectHighlight}
                        className="w-full text-background cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project Highlight
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Project Highlights */}
                  {projectDetailData.projectHighlights.highlights.length >
                    0 && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle>
                          Current Project Highlights (
                          {
                            projectDetailData.projectHighlights.highlights
                              .length
                          }
                          )
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projectDetailData.projectHighlights.highlights.map(
                            (highlight, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 border rounded-lg"
                              >
                                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                                  <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {highlight.title}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProjectHighlight(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Key Highlights Tab */}
                <TabsContent value="key-highlights" className="space-y-6">
                  <div className="space-y-2">
                    <MediaSelectButton
                      value={projectDetailData.keyHighlights.backgroundImage}
                      onSelect={(url) =>
                        handleProjectDetailChange(
                          "keyHighlights",
                          "backgroundImage",
                          url
                        )
                      }
                      mediaType="image"
                      label="Key Highlights Background Image"
                      placeholder="Select background image"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">
                      Key Highlights Description
                    </Label>
                    <div className="min-h-[150px]">
                      <Editor
                        value={projectDetailData.keyHighlights.description}
                        onEditorChange={(content) =>
                          handleProjectDetailChange(
                            "keyHighlights",
                            "description",
                            content
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Add New Key Highlight */}
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle>Add New Key Highlight</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="keyHighlightText"
                          className="text-background"
                        >
                          Highlight Text
                        </Label>
                        <Input
                          id="keyHighlightText"
                          value={newKeyHighlight.text}
                          onChange={(e) =>
                            setNewKeyHighlight({ text: e.target.value })
                          }
                          placeholder="e.g., 1 & 2 BHK premium apartments"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={addKeyHighlight}
                        className="w-full text-background cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Key Highlight
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Key Highlights */}
                  {projectDetailData.keyHighlights.highlights.length > 0 && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle>
                          Current Key Highlights (
                          {projectDetailData.keyHighlights.highlights.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {projectDetailData.keyHighlights.highlights.map(
                            (highlight, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <span>{highlight.text}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeKeyHighlight(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Modern Amenities Tab */}
                <TabsContent value="amenities" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amenitiesTitle" className="text-primary">
                        Section Title
                      </Label>
                      <Input
                        id="amenitiesTitle"
                        value={projectDetailData.modernAmenities.title}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "modernAmenities",
                            "title",
                            e.target.value
                          )
                        }
                        className="text-gray-300"
                        placeholder="Section title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">
                      Amenities Description
                    </Label>
                    <div className="min-h-[150px]">
                      <Editor
                        value={projectDetailData.modernAmenities.description}
                        onEditorChange={(content) =>
                          handleProjectDetailChange(
                            "modernAmenities",
                            "description",
                            content
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Add New Amenity */}
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle>Add New Amenity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <MediaSelectButton
                            value={newAmenity.image}
                            onSelect={(url) =>
                              setNewAmenity((prev) => ({ ...prev, image: url }))
                            }
                            mediaType="image"
                            label="Select Amenity Image"
                            placeholder="Select amenity image"
                          />
                        </div>

                        <div className="space-y-2 pt-4">
                          <Label
                            htmlFor="amenityTitle"
                            className="text-primary"
                          >
                            Amenity Title
                          </Label>
                          <Input
                            id="amenityTitle"
                            value={newAmenity.title}
                            onChange={(e) =>
                              setNewAmenity((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Enter amenity title"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addAmenity}
                        className="w-full text-background cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Amenity
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Amenities */}
                  {projectDetailData.modernAmenities.amenities.length > 0 && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle>
                          Current Amenities (
                          {projectDetailData.modernAmenities.amenities.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projectDetailData.modernAmenities.amenities.map(
                            (amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 border rounded-lg"
                              >
                                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                                  <img
                                    src={amenity.image}
                                    alt={amenity.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{amenity.title}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAmenity(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Master Plan Tab */}
                <TabsContent value="master-plan" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 py-2">
                      <Label htmlFor="masterPlanTitle" className="text-primary">
                        Master Plan Title
                      </Label>
                      <Input
                        id="masterPlanTitle"
                        value={projectDetailData.masterPlan.title}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "masterPlan",
                            "title",
                            e.target.value
                          )
                        }
                        className="text-gray-300"
                        placeholder="Enter master plan title"
                      />
                    </div>

                    <div className="space-y-2 py-2">
                      <Label
                        htmlFor="masterPlanSubtitle"
                        className="text-primary"
                      >
                        Master Plan Subtitle
                      </Label>
                      <Input
                        id="masterPlanSubtitle"
                        value={projectDetailData.masterPlan.subtitle}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "masterPlan",
                            "subtitle",
                            e.target.value
                          )
                        }
                        className="text-gray-300"
                        placeholder="Enter master plan subtitle"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">
                      Master Plan Description
                    </Label>
                    <div className="min-h-[200px]">
                      <Editor
                        value={projectDetailData.masterPlan.description}
                        onEditorChange={(content) =>
                          handleProjectDetailChange(
                            "masterPlan",
                            "description",
                            content
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <MediaSelectButton
                      value={projectDetailData.masterPlan.backgroundImage}
                      onSelect={(url) =>
                        handleProjectDetailChange(
                          "masterPlan",
                          "backgroundImage",
                          url
                        )
                      }
                      mediaType="image"
                      label="Master Plan Background Image"
                      placeholder="Select background image"
                    />
                  </div>

                  {/* Add New Master Plan Tab */}
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle>Add New Master Plan Tab</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="masterPlanTabTitle" className="text-primary">
                            Tab Title *
                          </Label>
                          <Input
                            id="masterPlanTabTitle"
                            value={newMasterPlanTab.title}
                            onChange={(e) =>
                              setNewMasterPlanTab((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="e.g., Luxury Condominiums"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="masterPlanTabSubtitle" className="text-primary">
                            Tab Subtitle (Optional)
                          </Label>
                          <Input
                            id="masterPlanTabSubtitle"
                            value={newMasterPlanTab.subtitle}
                            onChange={(e) =>
                              setNewMasterPlanTab((prev) => ({
                                ...prev,
                                subtitle: e.target.value,
                              }))
                            }
                            placeholder="e.g., Shopping Centre"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="masterPlanTabSubtitle2" className="text-primary">
                            Tab Subtitle 2 (Optional)
                          </Label>
                          <Input
                            id="masterPlanTabSubtitle2"
                            value={newMasterPlanTab.subtitle2}
                            onChange={(e) =>
                              setNewMasterPlanTab((prev) => ({
                                ...prev,
                                subtitle2: e.target.value,
                              }))
                            }
                            placeholder="e.g., Spa & Villa"
                          />
                        </div>

                        <div className="space-y-2">
                          <MediaSelectButton
                            value={newMasterPlanTab.image}
                            onSelect={(url) =>
                              setNewMasterPlanTab((prev) => ({
                                ...prev,
                                image: url,
                              }))
                            }
                            mediaType="image"
                            label="Select Tab Background Image *"
                            placeholder="Select tab background image"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addMasterPlanTab}
                        className="w-full text-background cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Master Plan Tab
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Master Plan Tabs */}
                  {projectDetailData.masterPlan.tabs.length > 0 && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle>
                          Current Master Plan Tabs (
                          {projectDetailData.masterPlan.tabs.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projectDetailData.masterPlan.tabs.map(
                            (tab, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 border rounded-lg"
                              >
                                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                                  <img
                                    src={tab.image}
                                    alt={tab.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{tab.title}</p>
                                  {tab.subtitle && (
                                    <p className="text-sm text-gray-600">
                                      C1 - {tab.subtitle}
                                    </p>
                                  )}
                                  {tab.subtitle2 && (
                                    <p className="text-sm text-gray-600">
                                      C2 - {tab.subtitle2}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMasterPlanTab(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Investment Plans Tab */}
                <TabsContent value="investment-plans" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investmentPlansTitle" className="text-primary">
                        Section Title
                      </Label>
                      <Input
                        id="investmentPlansTitle"
                        value={projectDetailData.investmentPlans.title}
                        onChange={(e) =>
                          handleProjectDetailChange(
                            "investmentPlans",
                            "title",
                            e.target.value
                          )
                        }
                        className="text-gray-300"
                        placeholder="Section title"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-primary">
                      Investment Plans Description
                    </Label>
                    <div className="min-h-[150px]">
                      <Editor
                        value={projectDetailData.investmentPlans.description}
                        onEditorChange={(content) =>
                          handleProjectDetailChange(
                            "investmentPlans",
                            "description",
                            content
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <MediaSelectButton
                      value={projectDetailData.investmentPlans.backgroundImage}
                      onSelect={(url) =>
                        handleProjectDetailChange(
                          "investmentPlans",
                          "backgroundImage",
                          url
                        )
                      }
                      mediaType="image"
                      label="Investment Plans Background Image"
                      placeholder="Select background image"
                    />
                  </div>

                  {/* Add New Investment Plan */}
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle>Add New Investment Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="paymentPlan" className="text-primary">
                            Payment Plan *
                          </Label>
                          <Input
                            id="paymentPlan"
                            value={newInvestmentPlan.paymentPlan}
                            onChange={(e) =>
                              setNewInvestmentPlan((prev) => ({
                                ...prev,
                                paymentPlan: e.target.value,
                              }))
                            }
                            placeholder="e.g., 35% within 30 days"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guaranteedReturn" className="text-primary">
                            Guaranteed Return *
                          </Label>
                          <Input
                            id="guaranteedReturn"
                            value={newInvestmentPlan.guaranteedReturn}
                            onChange={(e) =>
                              setNewInvestmentPlan((prev) => ({
                                ...prev,
                                guaranteedReturn: e.target.value,
                              }))
                            }
                            placeholder="e.g., 7%"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="returnStartDate" className="text-primary">
                            Return Start Date *
                          </Label>
                          <Input
                            id="returnStartDate"
                            value={newInvestmentPlan.returnStartDate}
                            onChange={(e) =>
                              setNewInvestmentPlan((prev) => ({
                                ...prev,
                                returnStartDate: e.target.value,
                              }))
                            }
                            placeholder="e.g., 5 years post-possession (End of 2027)"
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={addInvestmentPlan}
                        className="w-full text-background cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Investment Plan
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Existing Investment Plans */}
                  {projectDetailData.investmentPlans.plans.length > 0 && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle>
                          Current Investment Plans (
                          {projectDetailData.investmentPlans.plans.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projectDetailData.investmentPlans.plans.map(
                            (plan, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 border rounded-lg"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                                  {String(index + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Payment Plan</p>
                                    <p className="font-medium">{plan.paymentPlan}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Guaranteed Return</p>
                                    <p className="font-medium">{plan.guaranteedReturn}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Return Start Date</p>
                                    <p className="font-medium">{plan.returnStartDate}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInvestmentPlan(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Submit Button - Outside tabs but inside form */}
                <div className="flex justify-end space-x-2 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="text-background cursor-pointer bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-background cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingProject ? "Updating..." : "Creating..."}
                      </>
                    ) : editingProject ? (
                      "Update Project"
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="py-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <span className="text-sm font-normal text-muted-foreground">
              {filteredProjects.length} of {projects.length} projects
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {projects.length === 0
                ? "No projects found. Create your first project to get started."
                : "No projects match your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-300">
                  <TableRow>
                    <TableHead className="text-background">Image</TableHead>
                    <TableHead className="text-background">Name</TableHead>
                    <TableHead className="text-background">Category</TableHead>
                    <TableHead className="text-background">Location</TableHead>
                    <TableHead className="text-background">Price</TableHead>
                    <TableHead className="text-background">Status</TableHead>
                    <TableHead className="text-right text-background">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project._id}>
                      <TableCell>
                        <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                          {project.images[0] ? (
                            <img
                              src={project.images[0]}
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          {project.badge && (
                            <Badge
                              variant="outline"
                              className="text-primary mt-1 text-xs"
                            >
                              {project.badge}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{project.categoryName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {project.location}
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.price}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="text-background"
                          variant={project.isActive ? "default" : "secondary"}
                        >
                          {project.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-background"
                            onClick={() => openEditDialog(project as any)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(project._id, project.name)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}