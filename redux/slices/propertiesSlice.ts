// store/slices/propertiesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  id: string;
  name: string;
  image: string;
  coords: { top: string; left: string };
  icon: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  locations: Location[];
}

interface PhuketPropertiesData {
  _id?: string;
  type: string;
  mainHeading: string;
  subHeading: string;
  description: string;
  explorerHeading: string;
  explorerDescription: string;
  categories: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface PropertiesState {
  data: PhuketPropertiesData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: PropertiesState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks for API calls
export const fetchPropertiesData = createAsyncThunk(
  'properties/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/properties');
      if (!response.ok) {
        throw new Error('Failed to fetch properties data');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const savePropertiesData = createAsyncThunk(
  'properties/saveData',
  async (data: Omit<PhuketPropertiesData, '_id' | 'type' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save properties data');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Local state updates for immediate UI feedback
    updateMainHeading: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.mainHeading = action.payload;
      }
    },
    updateSubHeading: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.subHeading = action.payload;
      }
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.description = action.payload;
      }
    },
    updateExplorerHeading: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.explorerHeading = action.payload;
      }
    },
    updateExplorerDescription: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.explorerDescription = action.payload;
      }
    },
    updateCategoryTitle: (state, action: PayloadAction<{ categoryId: string; title: string }>) => {
      if (state.data) {
        const category = state.data.categories.find(cat => cat.id === action.payload.categoryId);
        if (category) {
          category.title = action.payload.title;
        }
      }
    },
    updateLocation: (state, action: PayloadAction<{ 
      categoryId: string; 
      locationId: string; 
      updates: Partial<Location> 
    }>) => {
      if (state.data) {
        const category = state.data.categories.find(cat => cat.id === action.payload.categoryId);
        if (category) {
          const location = category.locations.find(loc => loc.id === action.payload.locationId);
          if (location) {
            Object.assign(location, action.payload.updates);
          }
        }
      }
    },
    addLocation: (state, action: PayloadAction<{ categoryId: string; location: Location }>) => {
      if (state.data) {
        const category = state.data.categories.find(cat => cat.id === action.payload.categoryId);
        if (category) {
          category.locations.push(action.payload.location);
        }
      }
    },
    deleteLocation: (state, action: PayloadAction<{ categoryId: string; locationId: string }>) => {
      if (state.data) {
        const category = state.data.categories.find(cat => cat.id === action.payload.categoryId);
        if (category) {
          category.locations = category.locations.filter(loc => loc.id !== action.payload.locationId);
        }
      }
    },
    reorderLocations: (state, action: PayloadAction<{ categoryId: string; locations: any[] }>) => {
      if (state.data) {
        const category = state.data.categories.find(cat => cat.id === action.payload.categoryId);
        if (category) {
          category.locations = action.payload.locations;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch properties data
      .addCase(fetchPropertiesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertiesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchPropertiesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save properties data
      .addCase(savePropertiesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePropertiesData.fulfilled, (state , action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(savePropertiesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateMainHeading,
  updateSubHeading,
  updateDescription,
  updateExplorerHeading,
  updateExplorerDescription,
  updateCategoryTitle,
  updateLocation,
  addLocation,
  deleteLocation,
  reorderLocations,
  clearError,
} = propertiesSlice.actions;

export default propertiesSlice.reducer;

// Selectors
export const selectPropertiesData = (state: any) => state.properties.data;
export const selectPropertiesLoading = (state: any) => state.properties.loading;
export const selectPropertiesError = (state: any) => state.properties.error;
export const selectLastUpdated = (state: any) => state.properties.lastUpdated;