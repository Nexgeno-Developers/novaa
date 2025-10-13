"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, X, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/redux";
import { fetchProjects, updateProject } from "@/redux/slices/projectsSlice";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import Editor from "@/components/admin/Editor";
import MediaMultiSelectButton from "@/components/admin/MediaMultiSelectButton";
import MediaSelectButton from "@/components/admin/MediaSelectButton";
import GatewayMapEditor from "@/components/admin/GatewayMapEditor";
import { useAppDispatch } from "@/redux/hooks";

// Same interfaces as create page
interface DiscoverTranquilityTab {
  id: string;
  label: string;
  items: DiscoverTranquilityItem[];
}

interface DiscoverTranquilityItem {
  type: "image" | "video";
  image?: string;
  youtubeUrl?: string;
  title: string;
  order: number;
}

interface KeyHighlight {
  text: string;
}

interface ClientVideo {
  url: string;
  order: number;
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

interface GatewayLocation {
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
  pixelCoords: {
    x: number;
    y: number;
  };
  categoryId?: string;
}

interface GatewayCategory {
  title: string;
  description: string;
  icon: string;
  locations: GatewayLocation[];
}

interface Project {
  _id: string;
  slug: string;
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
      mediaType?: "image" | "video" | "vimeo";
      vimeoUrl?: string;
      title: string;
      subtitle: string;
      scheduleMeetingButton: string;
      getBrochureButton: string;
      brochurePdf: string;
    };
    discoverTranquility: {
      sectionTitle: string;
      backgroundImage: string;
      description: string;
      tabs: DiscoverTranquilityTab[];
    };
    keyHighlights: {
      backgroundImage: string;
      description: string;
      highlights: KeyHighlight[];
    };
    clientVideos: {
      title: string;
      videos: ClientVideo[];
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
    gateway: {
      title: string;
      subtitle: string;
      highlightText: string;
      description: string;
      sectionTitle: string;
      sectionDescription: string;
      backgroundImage: string;
      mapImage: string;
      categories: GatewayCategory[];
    };
  };
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const dispatch = useAppDispatch();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectLoaded, setProjectLoaded] = useState(false);

  // Find the current project
  const currentProject = projects.find((p) => p._id === projectId);

  // Basic form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
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

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [slugExists, setSlugExists] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  // Project detail form data with the same structure as create page
  const [projectDetailData, setProjectDetailData] = useState({
    hero: {
      backgroundImage: "",
      mediaType: "image" as "image" | "video" | "vimeo",
      vimeoUrl: "",
      title: "",
      subtitle: "",
      scheduleMeetingButton: "Schedule a meeting",
      getBrochureButton: "Get Brochure",
      brochurePdf: "",
    },
    discoverTranquility: {
      sectionTitle: "Discover Tranquility at",
      backgroundImage: "",
      description: "",
      tabs: [] as DiscoverTranquilityTab[],
    },
    keyHighlights: {
      backgroundImage: "",
      description: "",
      highlights: [] as KeyHighlight[],
    },
    clientVideos: {
      title: "in Action",
      videos: [] as ClientVideo[],
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
      description:
        "Secure high returns with exclusive, time-sensitive opportunities.",
      backgroundImage: "",
      plans: [] as InvestmentPlan[],
    },
    gateway: {
      title: "A place to come home to",
      subtitle: "and a location that",
      highlightText: "holds its value.",
      description:
        "Set between Layan and Bangtao, this address offers more than scenery.",
      sectionTitle: "Your Gateway to Paradise",
      sectionDescription:
        "Perfectly positioned where tropical elegance meets modern convenience.",
      backgroundImage: "",
      mapImage: "",
      mainProjectLocation: {
        title: "",
        description: "",
        icon: "/gateway-images/main-project-icon.svg",
        coords: { x: 0, y: 0 },
      },
      curveLines: [] as any[],
      categories: [] as GatewayCategory[],
    },
  });

  // Temporary states for adding new items (same as create page)
  const [newDiscoverTranquilityTab, setNewDiscoverTranquilityTab] = useState({
    label: "",
  });
  const [newDiscoverTranquilityItem, setNewDiscoverTranquilityItem] = useState({
    type: "image" as "image" | "video",
    image: "",
    youtubeUrl: "",
    title: "",
    tabId: "",
  });
  const [newKeyHighlight, setNewKeyHighlight] = useState({ text: "" });
  const [newClientVideo, setNewClientVideo] = useState({ url: "" });
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
  const [newGatewayCategory, setNewGatewayCategory] = useState({
    title: "",
    description: "",
    icon: "",
    locations: [],
  });
  const [newGatewayLocation, setNewGatewayLocation] = useState({
    name: "",
    image: "",
    coords: { top: "50%", left: "50%" },
    icon: "/icons/map-pin.svg",
    pixelCoords: { x: 0, y: 0 },
    categoryId: "",
  });
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<
    number | null
  >(null);

  // Edit dialog states
  const [editGatewayCategoryDialog, setEditGatewayCategoryDialog] = useState<{
    isOpen: boolean;
    index: number;
    title: string;
    description: string;
  }>({
    isOpen: false,
    index: -1,
    title: "",
    description: "",
  });

  const [editKeyHighlightDialog, setEditKeyHighlightDialog] = useState<{
    isOpen: boolean;
    index: number;
    text: string;
  }>({
    isOpen: false,
    index: -1,
    text: "",
  });

  const [editMasterPlanTabDialog, setEditMasterPlanTabDialog] = useState<{
    isOpen: boolean;
    index: number;
    title: string;
    subtitle: string;
    subtitle2: string;
    image: string;
  }>({
    isOpen: false,
    index: -1,
    title: "",
    subtitle: "",
    subtitle2: "",
    image: "",
  });

  const [
    editDiscoverTranquilityTabDialog,
    setEditDiscoverTranquilityTabDialog,
  ] = useState<{
    isOpen: boolean;
    index: number;
    label: string;
  }>({
    isOpen: false,
    index: -1,
    label: "",
  });

  const [
    editDiscoverTranquilityItemDialog,
    setEditDiscoverTranquilityItemDialog,
  ] = useState<{
    isOpen: boolean;
    tabIndex: number;
    itemIndex: number;
    title: string;
    image?: string;
    youtubeUrl?: string;
    type?: "image" | "video";
  }>({
    isOpen: false,
    tabIndex: -1,
    itemIndex: -1,
    title: "",
    image: "",
    youtubeUrl: "",
    type: "image",
  });

  const [editClientVideoDialog, setEditClientVideoDialog] = useState<{
    isOpen: boolean;
    index: number;
    url: string;
  }>({
    isOpen: false,
    index: -1,
    url: "",
  });

  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
    dispatch(fetchCategories());
  }, [dispatch, projects.length]);

  // Load project data when project is found
  useEffect(() => {
    if (currentProject && !projectLoaded) {
      setFormData({
        name: currentProject.name,
        slug: currentProject.slug || generateSlug(currentProject.name),
        price: currentProject.price,
        images: currentProject.images,
        location: currentProject.location,
        description: currentProject.description,
        badge: currentProject.badge || "",
        category: currentProject.category._id,
        categoryName: currentProject.categoryName,
        isActive: currentProject.isActive,
        order: currentProject.order,
      });

      setOriginalSlug(currentProject.slug || generateSlug(currentProject.name));

      // Set project detail data if exists
      if (currentProject.projectDetail) {
        // Auto-detect media type if not set
        const backgroundImage =
          currentProject.projectDetail.hero?.backgroundImage || "";
        const isVideoUrl =
          backgroundImage.includes(".mp4") ||
          backgroundImage.includes(".webm") ||
          backgroundImage.includes(".mov") ||
          backgroundImage.includes("video/upload");
        const detectedMediaType = isVideoUrl ? "video" : "image";

        // If mediaType is missing from database, auto-detect and prepare to save it
        const shouldUpdateMediaType =
          !currentProject.projectDetail.hero?.mediaType;

        setProjectDetailData({
          hero: {
            backgroundImage,
            mediaType:
              currentProject.projectDetail.hero?.mediaType || detectedMediaType,
            vimeoUrl: currentProject.projectDetail.hero?.vimeoUrl || "",
            title: currentProject.projectDetail.hero?.title || "",
            subtitle: currentProject.projectDetail.hero?.subtitle || "",
            scheduleMeetingButton:
              currentProject.projectDetail.hero?.scheduleMeetingButton ||
              "Schedule a meeting",
            getBrochureButton:
              currentProject.projectDetail.hero?.getBrochureButton ||
              "Get Brochure",
            brochurePdf: currentProject.projectDetail.hero?.brochurePdf || "",
          },
          discoverTranquility: {
            sectionTitle:
              currentProject.projectDetail.discoverTranquility?.sectionTitle ||
              "Discover Tranquility at",
            backgroundImage:
              currentProject.projectDetail.discoverTranquility
                ?.backgroundImage || "",
            description:
              currentProject.projectDetail.discoverTranquility?.description ||
              "",
            tabs: currentProject.projectDetail.discoverTranquility?.tabs || [],
          },
          keyHighlights: {
            backgroundImage:
              currentProject.projectDetail.keyHighlights?.backgroundImage || "",
            description:
              currentProject.projectDetail.keyHighlights?.description || "",
            highlights:
              currentProject.projectDetail.keyHighlights?.highlights || [],
          },
          clientVideos: {
            title:
              currentProject.projectDetail.clientVideos?.title || "in Action",
            videos: currentProject.projectDetail.clientVideos?.videos || [],
          },
          masterPlan: {
            title: currentProject.projectDetail.masterPlan?.title || "",
            subtitle: currentProject.projectDetail.masterPlan?.subtitle || "",
            description:
              currentProject.projectDetail.masterPlan?.description || "",
            backgroundImage:
              currentProject.projectDetail.masterPlan?.backgroundImage || "",
            tabs: currentProject.projectDetail.masterPlan?.tabs || [],
          },
          investmentPlans: {
            title:
              currentProject.projectDetail.investmentPlans?.title ||
              "LIMITED-TIME INVESTMENT PLANS",
            description:
              currentProject.projectDetail.investmentPlans?.description ||
              "Secure high returns with exclusive, time-sensitive opportunities.",
            backgroundImage:
              currentProject.projectDetail.investmentPlans?.backgroundImage ||
              "",
            plans: currentProject.projectDetail.investmentPlans?.plans || [],
          },
          gateway: {
            title:
              currentProject.projectDetail.gateway?.title ||
              "A place to come home to",
            subtitle:
              currentProject.projectDetail.gateway?.subtitle ||
              "and a location that",
            highlightText:
              currentProject.projectDetail.gateway?.highlightText ||
              "holds its value.",
            description:
              currentProject.projectDetail.gateway?.description ||
              "Set between Layan and Bangtao, this address offers more than scenery.",
            sectionTitle:
              currentProject.projectDetail.gateway?.sectionTitle ||
              "Your Gateway to Paradise",
            sectionDescription:
              currentProject.projectDetail.gateway?.sectionDescription ||
              "Perfectly positioned where tropical elegance meets modern convenience.",
            backgroundImage:
              currentProject.projectDetail.gateway?.backgroundImage || "",
            mapImage: currentProject.projectDetail.gateway?.mapImage || "",
            mainProjectLocation: currentProject.projectDetail.gateway
              ?.mainProjectLocation || {
              title: "",
              description: "",
              icon: "/icons/map-pin.svg",
              coords: { x: 0, y: 0 },
            },
            curveLines: currentProject.projectDetail.gateway?.curveLines || [],
            categories: currentProject.projectDetail.gateway?.categories || [],
          },
        });
      }

      setProjectLoaded(true);
    }
  }, [currentProject, projectLoaded]);

  // If project not found, redirect back
  useEffect(() => {
    if (!loading && projects.length > 0 && !currentProject) {
      toast.error("Project not found");
      router.push("/admin/projects");
    }
  }, [loading, projects.length, currentProject, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const checkSlugExists = async (slug: string, excludeId?: string) => {
    if (!slug) return false;

    try {
      const url = `/api/cms/projects/check-slug?slug=${encodeURIComponent(
        slug
      )}${excludeId ? `&excludeId=${excludeId}` : ""}`;
      const response = await fetch(url);
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking slug:", error);
      return false;
    }
  };

  const handleNameChange = async (name: string) => {
    handleInputChange("name", name);

    if (name.trim()) {
      setIsGeneratingSlug(true);
      const newSlug = generateSlug(name);
      handleInputChange("slug", newSlug);

      // Check if slug exists (exclude current project)
      const exists = await checkSlugExists(newSlug, projectId);
      setSlugExists(exists);
      setIsGeneratingSlug(false);
    } else {
      handleInputChange("slug", "");
      setSlugExists(false);
    }
  };

  const handleSlugChange = async (slug: string) => {
    const cleanSlug = generateSlug(slug);
    handleInputChange("slug", cleanSlug);

    if (cleanSlug) {
      // Only check if slug is different from original
      if (cleanSlug !== originalSlug) {
        const exists = await checkSlugExists(cleanSlug, projectId);
        setSlugExists(exists);
      } else {
        setSlugExists(false);
      }
    } else {
      setSlugExists(false);
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

  // Helper functions for Discover Tranquility management
  const addDiscoverTranquilityTab = () => {
    if (
      newDiscoverTranquilityTab.label &&
      projectDetailData.discoverTranquility.tabs.length < 4
    ) {
      const newTab: DiscoverTranquilityTab = {
        id: `tab-${Date.now()}`,
        label: newDiscoverTranquilityTab.label,
        items: [],
      };
      setProjectDetailData((prev) => ({
        ...prev,
        discoverTranquility: {
          ...prev.discoverTranquility,
          tabs: [...prev.discoverTranquility.tabs, newTab],
        },
      }));
      setNewDiscoverTranquilityTab({ label: "" });
    } else if (projectDetailData.discoverTranquility.tabs.length >= 4) {
      toast.error("Maximum 4 tabs allowed");
    } else {
      toast.error("Please enter tab label");
    }
  };

  const updateDiscoverTranquilityTab = (
    index: number,
    data: Partial<DiscoverTranquilityTab>
  ) => {
    setProjectDetailData((prev) => {
      const updatedTabs = [...prev.discoverTranquility.tabs];
      updatedTabs[index] = { ...updatedTabs[index], ...data };
      return {
        ...prev,
        discoverTranquility: {
          ...prev.discoverTranquility,
          tabs: updatedTabs,
        },
      };
    });
  };

  const removeDiscoverTranquilityTab = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      discoverTranquility: {
        ...prev.discoverTranquility,
        tabs: prev.discoverTranquility.tabs.filter((_, i) => i !== index),
      },
    }));
  };

  const addDiscoverTranquilityItem = (tabIndex: number) => {
    if (isAddingItem) return; // Prevent double-clicks

    if (
      newDiscoverTranquilityItem.title &&
      (newDiscoverTranquilityItem.type === "image"
        ? newDiscoverTranquilityItem.image
        : newDiscoverTranquilityItem.youtubeUrl)
    ) {
      setIsAddingItem(true);

      const newItem: DiscoverTranquilityItem = {
        type: newDiscoverTranquilityItem.type,
        image:
          newDiscoverTranquilityItem.type === "image"
            ? newDiscoverTranquilityItem.image
            : undefined,
        youtubeUrl:
          newDiscoverTranquilityItem.type === "video"
            ? newDiscoverTranquilityItem.youtubeUrl
            : undefined,
        title: newDiscoverTranquilityItem.title,
        order:
          projectDetailData.discoverTranquility.tabs[tabIndex].items.length,
      };

      setProjectDetailData((prev) => {
        const updatedTabs = [...prev.discoverTranquility.tabs];
        // Create a copy of the items array before adding new item
        const updatedItems = [...updatedTabs[tabIndex].items, newItem];
        updatedTabs[tabIndex] = {
          ...updatedTabs[tabIndex],
          items: updatedItems,
        };
        return {
          ...prev,
          discoverTranquility: {
            ...prev.discoverTranquility,
            tabs: updatedTabs,
          },
        };
      });

      setNewDiscoverTranquilityItem({
        type: "image",
        image: "",
        youtubeUrl: "",
        title: "",
        tabId: "",
      });

      // Reset loading state after a short delay to ensure state update is complete
      setTimeout(() => {
        setIsAddingItem(false);
      }, 100);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const updateDiscoverTranquilityItem = (
    tabIndex: number,
    itemIndex: number,
    data: Partial<DiscoverTranquilityItem>
  ) => {
    setProjectDetailData((prev) => {
      const updatedTabs = [...prev.discoverTranquility.tabs];
      // Create a copy of the items array before updating
      const updatedItems = [...updatedTabs[tabIndex].items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        ...data,
      };
      updatedTabs[tabIndex] = {
        ...updatedTabs[tabIndex],
        items: updatedItems,
      };
      return {
        ...prev,
        discoverTranquility: {
          ...prev.discoverTranquility,
          tabs: updatedTabs,
        },
      };
    });
  };

  const removeDiscoverTranquilityItem = (
    tabIndex: number,
    itemIndex: number
  ) => {
    setProjectDetailData((prev) => {
      const updatedTabs = [...prev.discoverTranquility.tabs];
      // Create a copy of the items array before mutating
      const updatedItems = [...updatedTabs[tabIndex].items];
      updatedItems.splice(itemIndex, 1);
      // Reorder remaining items
      const reorderedItems = updatedItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      updatedTabs[tabIndex] = {
        ...updatedTabs[tabIndex],
        items: reorderedItems,
      };
      return {
        ...prev,
        discoverTranquility: {
          ...prev.discoverTranquility,
          tabs: updatedTabs,
        },
      };
    });
  };

  // Helper functions for Client Videos management
  const addClientVideo = () => {
    if (newClientVideo.url) {
      const newVideo: ClientVideo = {
        url: newClientVideo.url,
        order: projectDetailData.clientVideos.videos.length,
      };
      setProjectDetailData((prev) => ({
        ...prev,
        clientVideos: {
          ...prev.clientVideos,
          videos: [...prev.clientVideos.videos, newVideo],
        },
      }));
      setNewClientVideo({ url: "" });
    } else {
      toast.error("Please enter video URL");
    }
  };

  const updateClientVideo = (index: number, url: string) => {
    setProjectDetailData((prev) => {
      const updatedVideos = [...prev.clientVideos.videos];
      updatedVideos[index] = { ...updatedVideos[index], url };
      return {
        ...prev,
        clientVideos: {
          ...prev.clientVideos,
          videos: updatedVideos,
        },
      };
    });
  };

  const removeClientVideo = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      clientVideos: {
        ...prev.clientVideos,
        videos: prev.clientVideos.videos.filter((_, i) => i !== index),
      },
    }));
  };

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

  const removeKeyHighlight = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      keyHighlights: {
        ...prev.keyHighlights,
        highlights: prev.keyHighlights.highlights.filter((_, i) => i !== index),
      },
    }));
  };

  const updateKeyHighlight = (index: number, text: string) => {
    setProjectDetailData((prev) => {
      const updatedHighlights = [...prev.keyHighlights.highlights];
      updatedHighlights[index] = { text };
      return {
        ...prev,
        keyHighlights: {
          ...prev.keyHighlights,
          highlights: updatedHighlights,
        },
      };
    });
  };

  const addMasterPlanTab = () => {
    if (newMasterPlanTab.title && newMasterPlanTab.image) {
      setProjectDetailData((prev) => ({
        ...prev,
        masterPlan: {
          ...prev.masterPlan,
          tabs: [...prev.masterPlan.tabs, newMasterPlanTab],
        },
      }));
      setNewMasterPlanTab({
        title: "",
        subtitle: "",
        subtitle2: "",
        image: "",
      });
    } else {
      toast.error("Please fill in title and image for the master plan tab");
    }
  };

  const removeMasterPlanTab = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      masterPlan: {
        ...prev.masterPlan,
        tabs: prev.masterPlan.tabs.filter((_, i) => i !== index),
      },
    }));
  };

  const updateMasterPlanTab = (index: number, data: Partial<MasterPlanTab>) => {
    setProjectDetailData((prev) => {
      const updatedTabs = [...prev.masterPlan.tabs];
      updatedTabs[index] = { ...updatedTabs[index], ...data };
      return {
        ...prev,
        masterPlan: {
          ...prev.masterPlan,
          tabs: updatedTabs,
        },
      };
    });
  };

  const addInvestmentPlan = () => {
    if (
      newInvestmentPlan.paymentPlan &&
      newInvestmentPlan.guaranteedReturn &&
      newInvestmentPlan.returnStartDate
    ) {
      setProjectDetailData((prev) => ({
        ...prev,
        investmentPlans: {
          ...prev.investmentPlans,
          plans: [...prev.investmentPlans.plans, newInvestmentPlan],
        },
      }));
      setNewInvestmentPlan({
        paymentPlan: "",
        guaranteedReturn: "",
        returnStartDate: "",
      });
    } else {
      toast.error("Please fill in all fields for the investment plan");
    }
  };

  const removeInvestmentPlan = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      investmentPlans: {
        ...prev.investmentPlans,
        plans: prev.investmentPlans.plans.filter((_, i) => i !== index),
      },
    }));
  };

  const addGatewayCategory = () => {
    if (
      newGatewayCategory.title &&
      newGatewayCategory.description &&
      newGatewayCategory.icon
    ) {
      setProjectDetailData((prev) => ({
        ...prev,
        gateway: {
          ...prev.gateway,
          categories: [...prev.gateway.categories, newGatewayCategory],
        },
      }));
      setNewGatewayCategory({
        title: "",
        description: "",
        icon: "",
        locations: [],
      });
    } else {
      toast.error("Please fill in all fields for the category");
    }
  };

  const removeGatewayCategory = (index: number) => {
    setProjectDetailData((prev) => ({
      ...prev,
      gateway: {
        ...prev.gateway,
        categories: prev.gateway.categories.filter((_, i) => i !== index),
      },
    }));
  };

  const updateGatewayCategory = (
    index: number,
    data: Partial<GatewayCategory>
  ) => {
    setProjectDetailData((prev) => {
      const updatedCategories = [...prev.gateway.categories];
      const oldCategory = updatedCategories[index];
      const newCategory = { ...updatedCategories[index], ...data };
      updatedCategories[index] = newCategory;

      // Only update curve lines if the title actually changed and is not empty
      const updatedCurveLines = prev.gateway.curveLines.map((curve) => {
        if (
          curve.categoryId === oldCategory.title &&
          newCategory.title &&
          newCategory.title.trim()
        ) {
          return {
            ...curve,
            categoryId: newCategory.title.trim(),
          };
        }
        return curve;
      });

      // Filter out any curve lines with empty categoryId to prevent validation errors
      const validCurveLines = updatedCurveLines.filter(
        (curve) => curve.categoryId && curve.categoryId.trim() !== ""
      );

      return {
        ...prev,
        gateway: {
          ...prev.gateway,
          categories: updatedCategories,
          curveLines: validCurveLines,
        },
      };
    });
  };

  // Helper functions for opening edit dialogs
  const openEditGatewayCategoryDialog = (index: number) => {
    const category = projectDetailData.gateway.categories[index];
    setEditGatewayCategoryDialog({
      isOpen: true,
      index,
      title: category.title,
      description: category.description,
    });
  };

  const openEditKeyHighlightDialog = (index: number) => {
    const highlight = projectDetailData.keyHighlights.highlights[index];
    setEditKeyHighlightDialog({
      isOpen: true,
      index,
      text: highlight.text,
    });
  };

  const openEditMasterPlanTabDialog = (index: number) => {
    const tab = projectDetailData.masterPlan.tabs[index];
    setEditMasterPlanTabDialog({
      isOpen: true,
      index,
      title: tab.title,
      subtitle: tab.subtitle || "",
      subtitle2: tab.subtitle2 || "",
      image: tab.image,
    });
  };

  const openEditDiscoverTranquilityTabDialog = (index: number) => {
    const tab = projectDetailData.discoverTranquility.tabs[index];
    setEditDiscoverTranquilityTabDialog({
      isOpen: true,
      index,
      label: tab.label,
    });
  };

  const openEditDiscoverTranquilityItemDialog = (
    tabIndex: number,
    itemIndex: number
  ) => {
    const item =
      projectDetailData.discoverTranquility.tabs[tabIndex].items[itemIndex];
    setEditDiscoverTranquilityItemDialog({
      isOpen: true,
      tabIndex,
      itemIndex,
      title: item.title,
      image: item.image || "",
      youtubeUrl: item.youtubeUrl || "",
      type: item.type,
    });
  };

  const openEditClientVideoDialog = (index: number) => {
    const video = projectDetailData.clientVideos.videos[index];
    setEditClientVideoDialog({
      isOpen: true,
      index,
      url: video.url,
    });
  };

  // Helper functions for saving edits
  const saveGatewayCategoryEdit = () => {
    if (editGatewayCategoryDialog.title.trim()) {
      updateGatewayCategory(editGatewayCategoryDialog.index, {
        title: editGatewayCategoryDialog.title.trim(),
        description: editGatewayCategoryDialog.description.trim(),
      });
      setEditGatewayCategoryDialog({
        isOpen: false,
        index: -1,
        title: "",
        description: "",
      });
    }
  };

  const saveKeyHighlightEdit = () => {
    if (editKeyHighlightDialog.text.trim()) {
      updateKeyHighlight(
        editKeyHighlightDialog.index,
        editKeyHighlightDialog.text.trim()
      );
      setEditKeyHighlightDialog({
        isOpen: false,
        index: -1,
        text: "",
      });
    }
  };

  const saveMasterPlanTabEdit = () => {
    if (editMasterPlanTabDialog.title.trim()) {
      updateMasterPlanTab(editMasterPlanTabDialog.index, {
        title: editMasterPlanTabDialog.title.trim(),
        subtitle: editMasterPlanTabDialog.subtitle.trim() || undefined,
        subtitle2: editMasterPlanTabDialog.subtitle2.trim() || undefined,
        image: editMasterPlanTabDialog.image,
      });
      setEditMasterPlanTabDialog({
        isOpen: false,
        index: -1,
        title: "",
        subtitle: "",
        subtitle2: "",
        image: "",
      });
    }
  };

  const saveDiscoverTranquilityTabEdit = () => {
    if (editDiscoverTranquilityTabDialog.label.trim()) {
      updateDiscoverTranquilityTab(editDiscoverTranquilityTabDialog.index, {
        label: editDiscoverTranquilityTabDialog.label.trim(),
      });
      setEditDiscoverTranquilityTabDialog({
        isOpen: false,
        index: -1,
        label: "",
      });
    }
  };

  const saveDiscoverTranquilityItemEdit = () => {
    if (editDiscoverTranquilityItemDialog.title.trim()) {
      updateDiscoverTranquilityItem(
        editDiscoverTranquilityItemDialog.tabIndex,
        editDiscoverTranquilityItemDialog.itemIndex,
        {
          title: editDiscoverTranquilityItemDialog.title.trim(),
          image: editDiscoverTranquilityItemDialog.image,
          youtubeUrl: editDiscoverTranquilityItemDialog.youtubeUrl,
          type: editDiscoverTranquilityItemDialog.type,
        }
      );
      setEditDiscoverTranquilityItemDialog({
        isOpen: false,
        tabIndex: -1,
        itemIndex: -1,
        title: "",
        image: "",
        youtubeUrl: "",
        type: "image",
      });
    }
  };

  const saveClientVideoEdit = () => {
    if (editClientVideoDialog.url.trim()) {
      updateClientVideo(
        editClientVideoDialog.index,
        editClientVideoDialog.url.trim()
      );
      setEditClientVideoDialog({
        isOpen: false,
        index: -1,
        url: "",
      });
    }
  };

  const addLocationToCategory = (categoryIndex: number) => {
    if (newGatewayLocation.name && newGatewayLocation.image) {
      setProjectDetailData((prev) => {
        const updatedCategories = [...prev.gateway.categories];
        // Create a new category object with updated locations array
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          locations: [
            ...updatedCategories[categoryIndex].locations,
            newGatewayLocation,
          ],
        };
        return {
          ...prev,
          gateway: {
            ...prev.gateway,
            categories: updatedCategories,
          },
        };
      });
      setNewGatewayLocation({
        name: "",
        image: "",
        coords: { top: "50%", left: "50%" },
        icon: "/icons/map-pin.svg",
        pixelCoords: { x: 0, y: 0 },
        categoryId: "",
      });
      setSelectedCategoryIndex(null);
    } else {
      toast.error("Please fill in location name and image");
    }
  };

  const removeLocationFromCategory = (
    categoryIndex: number,
    locationIndex: number
  ) => {
    setProjectDetailData((prev) => {
      const categoryToUpdate = prev.gateway.categories[categoryIndex];
      const locationToRemove = categoryToUpdate.locations[locationIndex];

      console.log("Removing location:", {
        categoryTitle: categoryToUpdate.title,
        locationName: locationToRemove.name,
        currentCurveLines: prev.gateway.curveLines.length,
      });

      const updatedCategories = prev.gateway.categories.map(
        (category, index) => {
          if (index === categoryIndex) {
            return {
              ...category,
              locations: category.locations.filter(
                (_, i) => i !== locationIndex
              ),
            };
          }
          return category;
        }
      );

      // Remove the curve line associated with this location
      const updatedCurveLines = prev.gateway.curveLines.filter((curve) => {
        const shouldKeep = !(
          curve.categoryId === categoryToUpdate.title &&
          curve.locationId === locationToRemove.name
        );

        if (!shouldKeep) {
          console.log("Removing curve line:", {
            curveId: curve.id,
            categoryId: curve.categoryId,
            locationId: curve.locationId,
            matchesCategory: curve.categoryId === categoryToUpdate.title,
            matchesLocation: curve.locationId === locationToRemove.name,
          });
        }

        return shouldKeep;
      });

      console.log("After removal:", {
        remainingCurveLines: updatedCurveLines.length,
        removedCount: prev.gateway.curveLines.length - updatedCurveLines.length,
      });

      return {
        ...prev,
        gateway: {
          ...prev.gateway,
          categories: updatedCategories,
          curveLines: updatedCurveLines,
        },
      };
    });
  };

  const removeMainProjectLocation = () => {
    setProjectDetailData((prev) => {
      console.log("Removing main project location:", {
        currentCurveLines: prev.gateway.curveLines.length,
      });

      // Remove all curve lines since main project is being removed
      const updatedCurveLines: any[] = [];

      console.log("After main project removal:", {
        remainingCurveLines: updatedCurveLines.length,
        removedCount: prev.gateway.curveLines.length,
      });

      return {
        ...prev,
        gateway: {
          ...prev.gateway,
          mainProjectLocation: {
            title: "",
            description: "",
            icon: "/gateway-images/main-project-icon.svg",
            coords: { x: 0, y: 0 },
          },
          curveLines: updatedCurveLines,
        },
      };
    });
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

    if (!formData.slug.trim()) {
      toast.error("Please enter a valid slug");
      return;
    }

    if (slugExists) {
      toast.error(
        "This slug already exists. Please choose a different project name or modify the slug."
      );
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

      await dispatch(
        updateProject({
          id: projectId,
          data: projectData,
        })
      ).unwrap();

      toast.success("Project updated successfully");
      router.push("/admin/projects");
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !projectLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading project...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/projects")}
          className="text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-bold">Edit Project: {formData.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-primary">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="text-gray-900"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectSlug" className="text-primary">
                  URL Slug *
                  {isGeneratingSlug && (
                    <span className="text-xs text-gray-500 ml-2">
                      Generating...
                    </span>
                  )}
                </Label>
                <Input
                  id="projectSlug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`text-gray-900 ${
                    slugExists ? "border-red-500" : ""
                  }`}
                  placeholder="project-url-slug"
                  required
                />
                {slugExists && (
                  <p className="text-red-500 text-xs">
                    This slug already exists. Please choose a different name or
                    modify the slug.
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  URL: /project-detail/{formData.slug || "your-project-slug"}
                </p>
                {originalSlug && originalSlug !== formData.slug && (
                  <p className="text-xs text-amber-600">
                    Warning: Changing the slug will break existing links to this
                    project.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectPrice" className="text-primary">
                  Price *
                </Label>
                <Input
                  id="projectPrice"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="text-gray-900"
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
                  className="text-gray-900"
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
                  onChange={(e) => handleInputChange("badge", e.target.value)}
                  className="text-gray-900"
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
                  <SelectTrigger className="text-gray-900 cursor-pointer w-full">
                    <SelectValue
                      placeholder="Select category"
                      className="text-gray-900 placeholder:text-gray-900"
                    />
                  </SelectTrigger>
                  <SelectContent className="admin-theme font-poppins cursor-pointer !z-[60] !isolate">
                    {categories
                      .filter((cat) => cat.isActive)
                      .map((category) => (
                        <SelectItem
                          key={category._id}
                          value={category._id}
                          className="cursor-pointer"
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
                  className="text-gray-900"
                  value={formData.order}
                  onChange={(e) =>
                    handleInputChange("order", parseInt(e.target.value) || 0)
                  }
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="projectActive"
                    checked={formData.isActive}
                    className="cursor-pointer"
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="projectActive" className="text-primary">
                    Active
                  </Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-primary">
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

            {/* <div className="flex items-center space-x-2">
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
            </div> */}
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-primary">Hero Title</Label>
                <Editor
                  value={projectDetailData.hero.title}
                  onEditorChange={(content) =>
                    handleProjectDetailChange("hero", "title", content)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle" className="text-primary">
                  Hero Subtitle
                </Label>
                <Editor
                  value={projectDetailData.hero.subtitle}
                  onEditorChange={(content) =>
                    handleProjectDetailChange("hero", "subtitle", content)
                  }
                />
              </div>
              {/* <Input
                  id="heroTitle"
                  value={projectDetailData.hero.title}
                  className="text-gray-900"
                  onChange={(e) =>
                    handleProjectDetailChange("hero", "title", e.target.value)
                  }
                  placeholder="Will use project name if empty"
                /> */}

              {/* <div className="space-y-2">
                              {/* <Label htmlFor="heroTitle" className="text-primary">
                                Hero Title
                              </Label> */}

              <div className="space-y-2">
                <Label htmlFor="scheduleMeetingButton" className="text-primary">
                  Schedule Meeting Button Text
                </Label>
                <Input
                  id="scheduleMeetingButton"
                  className="text-gray-900"
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
                <Label htmlFor="getBrochureButton" className="text-primary">
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
                  className="text-gray-900"
                />
              </div>
            </div>

            {/* Media Type and Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heroMediaType" className="text-primary">
                  Hero Media Type
                </Label>
                <Select
                  value={projectDetailData.hero.mediaType || "image"}
                  onValueChange={(value: "image" | "video" | "vimeo") =>
                    handleProjectDetailChange("hero", "mediaType", value)
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent className="admin-theme !z-[60] !isolate">
                    <SelectItem value="image">Background Image</SelectItem>
                    <SelectItem value="video">Background Video</SelectItem>
                    <SelectItem value="vimeo">Vimeo Video URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {projectDetailData.hero.mediaType === "vimeo" ? (
                  <>
                    <Label htmlFor="vimeoUrl" className="text-primary">
                      Vimeo Video URL
                    </Label>
                    <Input
                      id="vimeoUrl"
                      type="url"
                      value={projectDetailData.hero.vimeoUrl}
                      onChange={(e) =>
                        handleProjectDetailChange(
                          "hero",
                          "vimeoUrl",
                          e.target.value
                        )
                      }
                      placeholder="https://vimeo.com/1125077925?share=copy"
                      className="w-full"
                    />
                  </>
                ) : (
                  <MediaSelectButton
                    value={projectDetailData.hero.backgroundImage}
                    onSelect={(url) =>
                      handleProjectDetailChange("hero", "backgroundImage", url)
                    }
                    mediaType={projectDetailData.hero.mediaType || "image"}
                    label={`Hero Background ${
                      projectDetailData.hero.mediaType === "video"
                        ? "Video"
                        : "Image"
                    }`}
                    placeholder={`Select background ${
                      projectDetailData.hero.mediaType === "video"
                        ? "video"
                        : "image"
                    } for hero section`}
                  />
                )}
              </div>
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
          </CardContent>
        </Card>
        {/* Gateway Section */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Gateway Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Gateway Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gatewayTitle" className="text-primary">
                  Main Title
                </Label>
                <Input
                  id="gatewayTitle"
                  value={projectDetailData.gateway.title}
                  className="text-gray-900"
                  onChange={(e) =>
                    handleProjectDetailChange(
                      "gateway",
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="A place to come home to"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gatewaySubtitle" className="text-primary">
                  Subtitle
                </Label>
                <Input
                  id="gatewaySubtitle"
                  value={projectDetailData.gateway.subtitle}
                  className="text-gray-900"
                  onChange={(e) =>
                    handleProjectDetailChange(
                      "gateway",
                      "subtitle",
                      e.target.value
                    )
                  }
                  placeholder="and a location that"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gatewayHighlight" className="text-primary">
                  Highlight Text
                </Label>
                <Input
                  id="gatewayHighlight"
                  value={projectDetailData.gateway.highlightText}
                  className="text-gray-900"
                  onChange={(e) =>
                    handleProjectDetailChange(
                      "gateway",
                      "highlightText",
                      e.target.value
                    )
                  }
                  placeholder="holds its value."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">Main Description</Label>
              <div className="min-h-[150px]">
                <Editor
                  value={projectDetailData.gateway.description}
                  onEditorChange={(content) =>
                    handleProjectDetailChange("gateway", "description", content)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <MediaSelectButton
                    value={projectDetailData.gateway.backgroundImage}
                    onSelect={(url) =>
                      handleProjectDetailChange(
                        "gateway",
                        "backgroundImage",
                        url
                      )
                    }
                    mediaType="image"
                    label="Background Image"
                    placeholder="Select background image"
                  />
                </div>

                <div className="space-y-2">
                  <MediaSelectButton
                    value={projectDetailData.gateway.mapImage}
                    onSelect={(url) =>
                      handleProjectDetailChange("gateway", "mapImage", url)
                    }
                    mediaType="image"
                    label="Map Image"
                    placeholder="Select map image"
                  />
                </div>
              </div>

              {/* Main Project Location */}
              {projectDetailData.gateway.mainProjectLocation.title && (
                <div className="mt-6">
                  <Card className="border-dashed">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">
                          Main Project Location
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeMainProjectLocation}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                          <img
                            src={
                              projectDetailData.gateway.mainProjectLocation.icon
                            }
                            alt="Main Project"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {
                              projectDetailData.gateway.mainProjectLocation
                                .title
                            }
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {
                              projectDetailData.gateway.mainProjectLocation
                                .description
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Position:{" "}
                            {
                              projectDetailData.gateway.mainProjectLocation
                                .coords.x
                            }
                            ,{" "}
                            {
                              projectDetailData.gateway.mainProjectLocation
                                .coords.y
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Interactive Map Editor */}
              {projectDetailData.gateway.mapImage && (
                <div className="mt-6">
                  <GatewayMapEditor
                    mapImage={projectDetailData.gateway.mapImage}
                    existingData={{
                      mainProjectLocation:
                        projectDetailData.gateway.mainProjectLocation,
                      curveLines: projectDetailData.gateway.curveLines,
                      categories: projectDetailData.gateway.categories,
                    }}
                    onSave={async (mapData) => {
                      console.log(
                        "EditProjectForm onSave called with:",
                        mapData
                      );

                      // Update the form state
                      setProjectDetailData((prev) => ({
                        ...prev,
                        gateway: {
                          ...prev.gateway,
                          mainProjectLocation: mapData.mainProjectLocation,
                          curveLines: mapData.curveLines,
                          categories: mapData.categories,
                        },
                      }));

                      // Also save to database immediately
                      try {
                        const selectedCategoryObj = categories.find(
                          (cat) => cat._id === formData.category
                        );

                        if (!selectedCategoryObj) {
                          toast.error("Invalid category selected.");
                          return;
                        }

                        const finalProjectDetailData = {
                          ...projectDetailData,
                          gateway: {
                            ...projectDetailData.gateway,
                            mainProjectLocation: mapData.mainProjectLocation,
                            curveLines: mapData.curveLines,
                            categories: mapData.categories,
                          },
                          hero: {
                            ...projectDetailData.hero,
                            title:
                              projectDetailData.hero.title || formData.name,
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

                        await dispatch(
                          updateProject({
                            id: projectId,
                            data: projectData,
                          })
                        ).unwrap();

                        toast.success("Map configuration saved successfully!");
                      } catch (error) {
                        console.error("Error saving map configuration:", error);
                        toast.error("Failed to save map configuration");
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Add New Category */}
            <Card className="border-dashed py-6">
              <CardHeader>
                <CardTitle className="text-sm">Add New Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryTitle" className="text-primary">
                      Category Title
                    </Label>
                    <Input
                      id="categoryTitle"
                      value={newGatewayCategory.title}
                      onChange={(e) =>
                        setNewGatewayCategory((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Bangtao & Layan Beach"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="categoryDescription"
                      className="text-primary"
                    >
                      Category Description
                    </Label>
                    <Input
                      id="categoryDescription"
                      value={newGatewayCategory.description}
                      onChange={(e) =>
                        setNewGatewayCategory((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Pristine white sand beaches just 5 minutes away"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <MediaSelectButton
                    value={newGatewayCategory.icon}
                    onSelect={(url) =>
                      setNewGatewayCategory((prev) => ({
                        ...prev,
                        icon: url,
                      }))
                    }
                    mediaType="image"
                    label="Category Icon"
                    placeholder="Select category icon"
                  />
                </div>

                <Button
                  type="button"
                  onClick={addGatewayCategory}
                  className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </CardContent>
            </Card>

            {/* Existing Categories */}
            {projectDetailData.gateway.categories.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  Gateway Categories (
                  {projectDetailData.gateway.categories.length})
                </h4>
                <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetailData.gateway.categories.map(
                    (category, categoryIndex) => (
                      <div
                        key={categoryIndex}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                              <img
                                src={category.icon}
                                alt={category.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{category.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openEditGatewayCategoryDialog(categoryIndex)
                              }
                              className="text-primary cursor-pointer"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeGatewayCategory(categoryIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Add Location to Category */}
                        <div className="border-t pt-4">
                          {/* <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">
                            Locations ({category.locations.length})
                          </h5>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedCategoryIndex(
                                selectedCategoryIndex === categoryIndex
                                  ? null
                                  : categoryIndex
                              )
                            }
                            className="text-primary cursor-pointer"
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Add Location
                          </Button>
                        </div> */}

                          {/* Add Location Form */}
                          {selectedCategoryIndex === categoryIndex && (
                            <div className="space-y-4 mb-4 p-4 border rounded bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-primary">
                                    Location Name
                                  </Label>
                                  <Input
                                    value={newGatewayLocation.name}
                                    onChange={(e) =>
                                      setNewGatewayLocation((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    placeholder="Patong Beach"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <MediaSelectButton
                                    value={newGatewayLocation.image}
                                    onSelect={(url) =>
                                      setNewGatewayLocation((prev) => ({
                                        ...prev,
                                        image: url,
                                      }))
                                    }
                                    mediaType="image"
                                    label="Location Image"
                                    placeholder="Select location image"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-primary">
                                    Map Position (Top %)
                                  </Label>
                                  <Input
                                    value={newGatewayLocation.coords.top}
                                    onChange={(e) =>
                                      setNewGatewayLocation((prev) => ({
                                        ...prev,
                                        coords: {
                                          ...prev.coords,
                                          top: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="33%"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-primary">
                                    Map Position (Left %)
                                  </Label>
                                  <Input
                                    value={newGatewayLocation.coords.left}
                                    onChange={(e) =>
                                      setNewGatewayLocation((prev) => ({
                                        ...prev,
                                        coords: {
                                          ...prev.coords,
                                          left: e.target.value,
                                        },
                                      }))
                                    }
                                    placeholder="15%"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    addLocationToCategory(categoryIndex)
                                  }
                                  className="text-gray-900 cursor-pointer"
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Location
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setSelectedCategoryIndex(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Existing Locations */}
                          {category.locations.length > 0 && (
                            <div className="space-y-2">
                              {category.locations.map(
                                (location, locationIndex) => (
                                  <div
                                    key={locationIndex}
                                    className="flex items-center gap-4 p-2 border rounded"
                                  >
                                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                                      <img
                                        src={location.image}
                                        alt={location.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {location.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        Position: {location.coords.top} /{" "}
                                        {location.coords.left}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeLocationFromCategory(
                                          categoryIndex,
                                          locationIndex
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discover Tranquility */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Discover Tranquility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="discoverTranquilityTitle"
                  className="text-primary"
                >
                  Section Title
                </Label>
                <Input
                  id="discoverTranquilityTitle"
                  value={projectDetailData.discoverTranquility.sectionTitle}
                  onChange={(e) =>
                    handleProjectDetailChange(
                      "discoverTranquility",
                      "sectionTitle",
                      e.target.value
                    )
                  }
                  className="text-gray-900"
                  placeholder="Discover Tranquility at"
                />
              </div>

              <div className="space-y-2">
                <MediaSelectButton
                  value={projectDetailData.discoverTranquility.backgroundImage}
                  onSelect={(url) =>
                    handleProjectDetailChange(
                      "discoverTranquility",
                      "backgroundImage",
                      url
                    )
                  }
                  mediaType="image"
                  label="Background Image"
                  placeholder="Select background image"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-primary">Description</Label>
                <div className="min-h-[150px]">
                  <Editor
                    value={projectDetailData.discoverTranquility.description}
                    onEditorChange={(content) =>
                      handleProjectDetailChange(
                        "discoverTranquility",
                        "description",
                        content
                      )
                    }
                  />
                </div>
              </div>

              {/* Add New Tab */}
              <Card className="border-dashed py-6">
                <CardHeader>
                  <CardTitle className="text-sm">Add New Tab</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tabLabel" className="text-primary">
                      Tab Label
                    </Label>
                    <Input
                      id="tabLabel"
                      value={newDiscoverTranquilityTab.label}
                      onChange={(e) =>
                        setNewDiscoverTranquilityTab({ label: e.target.value })
                      }
                      placeholder="e.g., Exterior, Interior, Amenities"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addDiscoverTranquilityTab}
                    disabled={
                      projectDetailData.discoverTranquility.tabs.length >= 4
                    }
                    className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tab ({projectDetailData.discoverTranquility.tabs.length}
                    /4)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Existing Tabs */}
            {projectDetailData.discoverTranquility.tabs.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  Tabs ({projectDetailData.discoverTranquility.tabs.length})
                </h4>
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetailData.discoverTranquility.tabs.map(
                    (tab, tabIndex) => (
                      <div
                        key={tab.id}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <h5 className="font-medium">{tab.label}</h5>
                            <span className="text-sm text-gray-500">
                              ({tab.items.length} items)
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                openEditDiscoverTranquilityTabDialog(tabIndex)
                              }
                              className="text-primary cursor-pointer"
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeDiscoverTranquilityTab(tabIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Add Item to Tab */}
                        <div className="border-t pt-4">
                          <div className="space-y-4">
                            <h6 className="font-medium">
                              Add Item to {tab.label}
                            </h6>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-primary">Type</Label>
                                <Select
                                  value={newDiscoverTranquilityItem.type}
                                  onValueChange={(value: "image" | "video") =>
                                    setNewDiscoverTranquilityItem((prev) => ({
                                      ...prev,
                                      type: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="admin-theme !z-[60] !isolate">
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-primary">Title</Label>
                                <Input
                                  value={newDiscoverTranquilityItem.title}
                                  onChange={(e) =>
                                    setNewDiscoverTranquilityItem((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                  placeholder="Enter item title"
                                />
                              </div>
                            </div>

                            {newDiscoverTranquilityItem.type === "image" ? (
                              <div className="space-y-2">
                                <MediaSelectButton
                                  value={newDiscoverTranquilityItem.image}
                                  onSelect={(url) =>
                                    setNewDiscoverTranquilityItem((prev) => ({
                                      ...prev,
                                      image: url,
                                    }))
                                  }
                                  mediaType="image"
                                  label="Select Image"
                                  placeholder="Select image"
                                />
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Label className="text-primary">
                                  YouTube URL
                                </Label>
                                <Input
                                  value={newDiscoverTranquilityItem.youtubeUrl}
                                  onChange={(e) =>
                                    setNewDiscoverTranquilityItem((prev) => ({
                                      ...prev,
                                      youtubeUrl: e.target.value,
                                    }))
                                  }
                                  placeholder="https://youtube.com/shorts/..."
                                />
                              </div>
                            )}

                            <Button
                              type="button"
                              onClick={() =>
                                addDiscoverTranquilityItem(tabIndex)
                              }
                              disabled={isAddingItem}
                              className="bg-primary/90 hover:bg-primary/80 text-background cursor-pointer disabled:opacity-50"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {isAddingItem
                                ? "Adding..."
                                : `Add to ${tab.label}`}
                            </Button>
                          </div>

                          {/* Existing Items */}
                          {tab.items.length > 0 && (
                            <div className="space-y-2 mt-4">
                              <h6 className="font-medium">
                                Items in {tab.label}
                              </h6>
                              {[...tab.items]
                                .sort((a, b) => a.order - b.order)
                                .map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center gap-4 p-3 border rounded"
                                  >
                                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                                      {item.type === "image" ? (
                                        <img
                                          src={item.image}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                                          Video
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {item.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {item.type} • Order: {item.order}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          openEditDiscoverTranquilityItemDialog(
                                            tabIndex,
                                            itemIndex
                                          )
                                        }
                                        className="text-primary cursor-pointer"
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeDiscoverTranquilityItem(
                                            tabIndex,
                                            itemIndex
                                          )
                                        }
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Highlights */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Key Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Add New Key Highlight */}
            <Card className="border-dashed py-6">
              <CardHeader>
                <CardTitle className="text-sm">Add New Key Highlight</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyHighlightText" className="text-primary">
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
                  className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Key Highlight
                </Button>
              </CardContent>
            </Card>

            {/* Existing Key Highlights */}
            {projectDetailData.keyHighlights.highlights.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  Current Key Highlights (
                  {projectDetailData.keyHighlights.highlights.length})
                </h4>
                <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetailData.keyHighlights.highlights.map(
                    (highlight, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span>{highlight.text}</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditKeyHighlightDialog(index)}
                            className="text-primary cursor-pointer"
                          >
                            Edit
                          </Button>
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
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Client Videos */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Client Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientVideosTitle" className="text-primary">
                Section Title
              </Label>
              <Input
                id="clientVideosTitle"
                value={projectDetailData.clientVideos.title}
                onChange={(e) =>
                  handleProjectDetailChange(
                    "clientVideos",
                    "title",
                    e.target.value
                  )
                }
                className="text-gray-900"
                placeholder="in Action"
              />
              <p className="text-xs text-gray-500">
                This will be displayed as: "{formData.name}{" "}
                {projectDetailData.clientVideos.title}"
              </p>
            </div>

            {/* Add New Video */}
            <Card className="border-dashed py-6">
              <CardHeader>
                <CardTitle className="text-sm">Add New Video</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-primary">
                    YouTube Shorts URL
                  </Label>
                  <Input
                    id="videoUrl"
                    value={newClientVideo.url}
                    onChange={(e) => setNewClientVideo({ url: e.target.value })}
                    placeholder="https://youtube.com/shorts/..."
                  />
                </div>
                <Button
                  type="button"
                  onClick={addClientVideo}
                  className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </CardContent>
            </Card>

            {/* Existing Videos */}
            {projectDetailData.clientVideos.videos.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">
                  Current Videos ({projectDetailData.clientVideos.videos.length}
                  )
                </h4>
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...projectDetailData.clientVideos.videos]
                    .sort((a, b) => a.order - b.order)
                    .map((video, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          <div className="text-gray-500 text-xs">Video</div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm break-all">
                            {video.url}
                          </p>
                          <p className="text-xs text-gray-500">
                            Order: {video.order}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditClientVideoDialog(index)}
                            className="text-primary cursor-pointer"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeClientVideo(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Master Plan */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Master Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
                  className="text-gray-900"
                  placeholder="Enter master plan title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="masterPlanSubtitle" className="text-primary">
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
                  className="text-gray-900"
                  placeholder="Enter master plan subtitle"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-primary">Master Plan Description</Label>
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
            <Card className="border-dashed py-6">
              <CardHeader>
                <CardTitle className="text-sm">
                  Add New Master Plan Tab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="masterPlanTabTitle"
                      className="text-primary"
                    >
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
                    <Label
                      htmlFor="masterPlanTabSubtitle"
                      className="text-primary"
                    >
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
                    <Label
                      htmlFor="masterPlanTabSubtitle2"
                      className="text-primary"
                    >
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
                  className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Master Plan Tab
                </Button>
              </CardContent>
            </Card>

            {/* Existing Master Plan Tabs */}
            {projectDetailData.masterPlan.tabs.length > 0 && (
              <div>
                <h4 className="font-medium">
                  Current Master Plan Tabs (
                  {projectDetailData.masterPlan.tabs.length})
                </h4>
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectDetailData.masterPlan.tabs.map((tab, index) => (
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
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEditMasterPlanTabDialog(index)}
                          className="text-primary cursor-pointer"
                        >
                          Edit
                        </Button>
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
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Plans */}
        {/* 
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-primary">Investment Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                className="text-gray-900"
                placeholder="Section title"
              />
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
        {/* <Card className="border-dashed py-6">
              <CardHeader>
                <CardTitle className="text-sm">
                  Add New Investment Plan
                </CardTitle>
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
                  className="bg-primary/90 hover:bg-primary/80 w-full text-background cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investment Plan
                </Button>
              </CardContent>
            </Card> */}

        {/* Existing Investment Plans */}
        {/* {projectDetailData.investmentPlans.plans.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">
                  Current Investment Plans (
                  {projectDetailData.investmentPlans.plans.length})
                </h4>
                {projectDetailData.investmentPlans.plans.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Payment Plan</p>
                        <p className="font-medium">{plan.paymentPlan}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Guaranteed Return
                        </p>
                        <p className="font-medium">{plan.guaranteedReturn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Return Start Date
                        </p>
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
                ))}
              </div>
            )}
          </CardContent>
 </Card> */}

        {/* Edit Dialogs */}
        {/* Discover Tranquility Tab Edit Dialog */}
        <Dialog
          open={editDiscoverTranquilityTabDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditDiscoverTranquilityTabDialog({
                isOpen: false,
                index: -1,
                label: "",
              });
            }
          }}
        >
          <DialogContent className="admin-theme max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tab Label</DialogTitle>
              <DialogDescription>
                Update the tab label for this category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTabLabel" className="text-primary">
                  Tab Label
                </Label>
                <Input
                  id="editTabLabel"
                  value={editDiscoverTranquilityTabDialog.label}
                  onChange={(e) =>
                    setEditDiscoverTranquilityTabDialog((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  placeholder="Enter tab label"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditDiscoverTranquilityTabDialog({
                    isOpen: false,
                    index: -1,
                    label: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveDiscoverTranquilityTabEdit}
                disabled={!editDiscoverTranquilityTabDialog.label.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Discover Tranquility Item Edit Dialog */}
        <Dialog
          open={editDiscoverTranquilityItemDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditDiscoverTranquilityItemDialog({
                isOpen: false,
                tabIndex: -1,
                itemIndex: -1,
                title: "",
                image: "",
                youtubeUrl: "",
                type: "image",
              });
            }
          }}
        >
          <DialogContent className="admin-theme max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Update the title and media for this item.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editItemTitle" className="text-primary">
                  Item Title
                </Label>
                <Input
                  id="editItemTitle"
                  value={editDiscoverTranquilityItemDialog.title}
                  onChange={(e) =>
                    setEditDiscoverTranquilityItemDialog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter item title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-primary">Media Type</Label>
                <Select
                  value={editDiscoverTranquilityItemDialog.type}
                  onValueChange={(value: "image" | "video") =>
                    setEditDiscoverTranquilityItemDialog((prev) => ({
                      ...prev,
                      type: value,
                    }))
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="admin-theme !z-[60] !isolate">
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editDiscoverTranquilityItemDialog.type === "image" ? (
                <div className="space-y-2">
                  <MediaSelectButton
                    value={editDiscoverTranquilityItemDialog.image || ""}
                    onSelect={(url) =>
                      setEditDiscoverTranquilityItemDialog((prev) => ({
                        ...prev,
                        image: url,
                      }))
                    }
                    mediaType="image"
                    label="Select Image"
                    placeholder="Select image"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-primary">YouTube URL</Label>
                  <Input
                    value={editDiscoverTranquilityItemDialog.youtubeUrl || ""}
                    onChange={(e) =>
                      setEditDiscoverTranquilityItemDialog((prev) => ({
                        ...prev,
                        youtubeUrl: e.target.value,
                      }))
                    }
                    placeholder="https://youtube.com/shorts/..."
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditDiscoverTranquilityItemDialog({
                    isOpen: false,
                    tabIndex: -1,
                    itemIndex: -1,
                    title: "",
                    image: "",
                    youtubeUrl: "",
                    type: "image",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveDiscoverTranquilityItemEdit}
                disabled={!editDiscoverTranquilityItemDialog.title.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Client Video Edit Dialog */}
        <Dialog
          open={editClientVideoDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditClientVideoDialog({
                isOpen: false,
                index: -1,
                url: "",
              });
            }
          }}
        >
          <DialogContent className="admin-theme max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Video URL</DialogTitle>
              <DialogDescription>
                Update the YouTube Shorts URL for this video.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editVideoUrl" className="text-primary">
                  YouTube Shorts URL
                </Label>
                <Input
                  id="editVideoUrl"
                  value={editClientVideoDialog.url}
                  onChange={(e) =>
                    setEditClientVideoDialog((prev) => ({
                      ...prev,
                      url: e.target.value,
                    }))
                  }
                  placeholder="https://youtube.com/shorts/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditClientVideoDialog({
                    isOpen: false,
                    index: -1,
                    url: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveClientVideoEdit}
                disabled={!editClientVideoDialog.url.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Gateway Category Edit Dialog */}
        <Dialog
          open={editGatewayCategoryDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditGatewayCategoryDialog({
                isOpen: false,
                index: -1,
                title: "",
                description: "",
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl admin-theme">
            <DialogHeader>
              <DialogTitle>Edit Gateway Category</DialogTitle>
              <DialogDescription>
                Update the category title and description.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryTitle" className="text-primary">
                  Category Title
                </Label>
                <Input
                  id="editCategoryTitle"
                  value={editGatewayCategoryDialog.title}
                  onChange={(e) =>
                    setEditGatewayCategoryDialog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter category title"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="editCategoryDescription"
                  className="text-primary"
                >
                  Category Description
                </Label>
                <Input
                  id="editCategoryDescription"
                  value={editGatewayCategoryDialog.description}
                  onChange={(e) =>
                    setEditGatewayCategoryDialog((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter category description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditGatewayCategoryDialog({
                    isOpen: false,
                    index: -1,
                    title: "",
                    description: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveGatewayCategoryEdit}
                disabled={!editGatewayCategoryDialog.title.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Key Highlight Edit Dialog */}
        <Dialog
          open={editKeyHighlightDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditKeyHighlightDialog({
                isOpen: false,
                index: -1,
                text: "",
              });
            }
          }}
        >
          <DialogContent className="admin-theme max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Key Highlight</DialogTitle>
              <DialogDescription>Update the highlight text.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editHighlightText" className="text-primary">
                  Highlight Text
                </Label>
                <Input
                  id="editHighlightText"
                  value={editKeyHighlightDialog.text}
                  onChange={(e) =>
                    setEditKeyHighlightDialog((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  placeholder="Enter highlight text"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditKeyHighlightDialog({
                    isOpen: false,
                    index: -1,
                    text: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveKeyHighlightEdit}
                disabled={!editKeyHighlightDialog.text.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Master Plan Tab Edit Dialog */}
        <Dialog
          open={editMasterPlanTabDialog.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditMasterPlanTabDialog({
                isOpen: false,
                index: -1,
                title: "",
                subtitle: "",
                subtitle2: "",
                image: "",
              });
            }
          }}
        >
          <DialogContent className="admin-theme max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Master Plan Tab</DialogTitle>
              <DialogDescription>
                Update the tab title, subtitles, and image.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTabTitle" className="text-primary">
                  Tab Title
                </Label>
                <Input
                  id="editTabTitle"
                  value={editMasterPlanTabDialog.title}
                  onChange={(e) =>
                    setEditMasterPlanTabDialog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter tab title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTabSubtitle" className="text-primary">
                  Tab Subtitle (Optional)
                </Label>
                <Input
                  id="editTabSubtitle"
                  value={editMasterPlanTabDialog.subtitle}
                  onChange={(e) =>
                    setEditMasterPlanTabDialog((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Enter tab subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTabSubtitle2" className="text-primary">
                  Tab Subtitle 2 (Optional)
                </Label>
                <Input
                  id="editTabSubtitle2"
                  value={editMasterPlanTabDialog.subtitle2}
                  onChange={(e) =>
                    setEditMasterPlanTabDialog((prev) => ({
                      ...prev,
                      subtitle2: e.target.value,
                    }))
                  }
                  placeholder="Enter tab subtitle 2"
                />
              </div>
              <div className="space-y-2">
                <MediaSelectButton
                  value={editMasterPlanTabDialog.image}
                  onSelect={(url) =>
                    setEditMasterPlanTabDialog((prev) => ({
                      ...prev,
                      image: url,
                    }))
                  }
                  mediaType="image"
                  label="Tab Background Image"
                  placeholder="Select tab background image"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setEditMasterPlanTabDialog({
                    isOpen: false,
                    index: -1,
                    title: "",
                    subtitle: "",
                    subtitle2: "",
                    image: "",
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={saveMasterPlanTabEdit}
                disabled={!editMasterPlanTabDialog.title.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            className="text-gray-900 hover:text-gray-900 cursor-pointer bg-gray-300 hover:bg-gray-300/50"
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
                Updating...
              </>
            ) : (
              "Update Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
