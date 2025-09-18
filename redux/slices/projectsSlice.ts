import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

interface GatewayLocation {
  name: string;
  image: string;
  coords: {
    top: string;
    left: string;
  };
  icon: string;
}

interface GatewayCategory {
  title: string;
  description: string;
  icon: string;
  locations: GatewayLocation[];
}

interface ProjectDetail {
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
  async () => {
    const response = await fetch("/api/cms/projects");
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
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
      });
  },
});

export const { clearError } = adminProjectsSlice.actions;
export default adminProjectsSlice.reducer;
