// store/slices/testimonialsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux';
import axios from 'axios';

// --- TYPE DEFINITIONS ---
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
  order: number;
  isActive: boolean;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
}

interface TestimonialsState {
  content: TestimonialsContent;
  testimonials: TestimonialItem[];
  loading: boolean;
  error: string | null;
  actionLoading: {
    content: boolean;
  };
}

interface FetchResponse {
  content: TestimonialsContent;
  testimonials: TestimonialItem[];
}

interface UpdateTestimonialsPayload {
  pageSlug?: string;
  updatedData: {
    content: TestimonialsContent;
    testimonials?: TestimonialItem[];
  };
}

// --- INITIAL STATE ---
const initialState: TestimonialsState = {
  content: {
    title: '',
    subtitle: ''
  },
  testimonials: [],
  loading: false,
  error: null,
  actionLoading: {
    content: false,
  }
};

// --- ASYNC THUNKS ---
export const fetchTestimonialsData = createAsyncThunk<FetchResponse, string, { rejectValue: string }>(
  'testimonials/fetchData',
  async (pageSlug = "home", { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/cms/sections/${pageSlug}/testimonials-section`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch testimonials');
    }
  }
);

export const updateTestimonialsData = createAsyncThunk<{ content: TestimonialsContent }, UpdateTestimonialsPayload, { rejectValue: string }>(
  'testimonials/updateData',
  async ({ pageSlug = "home", updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/cms/sections/${pageSlug}/testimonials-section`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update testimonials');
    }
  }
);

// --- SLICE DEFINITION ---
const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch with sections API
      .addCase(fetchTestimonialsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonialsData.fulfilled, (state, action: PayloadAction<FetchResponse>) => {
        state.loading = false;
        state.content = action.payload.content || initialState.content;
        state.testimonials = (action.payload.testimonials || []).sort((a, b) => a.order - b.order);
      })
      .addCase(fetchTestimonialsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An unknown error occurred';
      })

      // Update with sections API
      .addCase(updateTestimonialsData.pending, (state) => {
        state.actionLoading.content = true;
      })
      .addCase(updateTestimonialsData.fulfilled, (state, action: PayloadAction<{ content: TestimonialsContent }>) => {
        state.actionLoading.content = false;
        state.content = action.payload.content;
      })
      .addCase(updateTestimonialsData.rejected, (state, action) => {
        state.actionLoading.content = false;
        state.error = action.payload ?? 'Failed to update testimonials';
      });
  },
});

export const { clearError } = testimonialsSlice.actions;
export const selectTestimonials = (state: RootState) => state.testimonials;

export default testimonialsSlice.reducer;