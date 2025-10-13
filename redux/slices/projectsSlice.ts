import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

interface MainProjectLocation {
  title: string;
  description: string;
  icon: string;
  coords: {
    x: number;
    y: number;
  };
}

interface CurveLine {
  id: string;
  categoryId: string;
  locationId: string;
  svgPath: string;
  color: string;
  thickness: number;
  dashPattern: number[];
}

interface ProjectDetail {
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
    mainProjectLocation: MainProjectLocation;
    curveLines: CurveLine[];
    categories: GatewayCategory[];
  };
}

interface Project {
  _id: string;
  slug: string;
  name: string;
  price: string;
  images: string[];
  location: string;
  description: string;
  badge?: string;
  category: {
    _id: string;
    name: string;
  };
  categoryName: string;
  isActive: boolean;
  order: number;
  projectDetail?: ProjectDetail;
}

interface AdminProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "adminProjects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cms/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Use default cache for better performance
        cache: "default",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch projects");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "adminProjects/fetchProjectById",
  async (id: string) => {
    const response = await fetch(`/api/cms/projects/${id}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);
// Add new async thunk to fetch project by slug
export const fetchProjectBySlug = createAsyncThunk(
  "adminProjects/fetchProjectBySlug",
  async (slug: string) => {
    const response = await fetch(`/api/cms/projects/slug/${slug}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

export const createProject = createAsyncThunk(
  "adminProjects/createProject",
  async (data: Omit<Project, "_id">) => {
    const response = await fetch("/api/cms/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

export const updateProject = createAsyncThunk(
  "adminProjects/updateProject",
  async ({ id, data }: { id: string; data: Omit<Project, "_id"> }) => {
    const response = await fetch(`/api/cms/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

export const deleteProject = createAsyncThunk(
  "adminProjects/deleteProject",
  async (id: string) => {
    const response = await fetch(`/api/cms/projects/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return id;
  }
);

export const cloneProject = createAsyncThunk(
  "adminProjects/cloneProject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cms/projects/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to clone project");
      }

      return result.data;
    } catch (error) {
      console.error("Error cloning project:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to clone project"
      );
    }
  }
);

const adminProjectsSlice = createSlice({
  name: "adminProjects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.loading = false;
        // Update existing project in array or add if not exists
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
      })
      .addCase(fetchProjectBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch project by slug";
      })
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        // Update existing project in array or add if not exists
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        } else {
          state.projects.push(action.payload);
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch project";
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })

      .addCase(cloneProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(cloneProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to clone project";
      });
  },
});

export const { clearError } = adminProjectsSlice.actions;
export default adminProjectsSlice.reducer;
