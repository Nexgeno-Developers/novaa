// store/slices/testimonialsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux'; // Adjust this path to your root store file

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
  description: string;
}

export interface TestimonialFormData {
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar: string;
}

interface ActionLoadingState {
  content: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  reorder: boolean;
}

interface TestimonialsState {
  content: TestimonialsContent;
  testimonials: TestimonialItem[];
  loading: boolean;
  error: string | null;
  actionLoading: ActionLoadingState;
}

interface FetchResponse {
  content: TestimonialsContent;
  testimonials: TestimonialItem[];
}

// --- INITIAL STATE ---
const initialState: TestimonialsState = {
  content: {
    title: '',
    description: ''
  },
  testimonials: [],
  loading: false,
  error: null,
  actionLoading: {
    content: false,
    create: false,
    update: false,
    delete: false,
    reorder: false
  }
};

// --- ASYNC THUNKS ---
export const fetchTestimonials = createAsyncThunk<FetchResponse, void, { rejectValue: string }>(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
            const {data} = await response.json();
            // console.log("Response " , response)

            // console.log("API fetchTestimonials response:", data);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTestimonialsContent = createAsyncThunk<{ content: TestimonialsContent }, TestimonialsContent, { rejectValue: string }>(
  'testimonials/updateContent',
  async (contentData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/testimonials/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData),
      });
      if (!response.ok) throw new Error('Failed to update content');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTestimonial = createAsyncThunk<{ testimonial: TestimonialItem }, TestimonialFormData, { rejectValue: string }>(
  'testimonials/createTestimonial',
  async (testimonialData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/testimonials/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) throw new Error('Failed to create testimonial');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTestimonial = createAsyncThunk<{ testimonial: TestimonialItem }, { id: string; testimonialData: TestimonialFormData }, { rejectValue: string }>(
  'testimonials/updateTestimonial',
  async ({ id, testimonialData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/testimonials/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialData),
      });
      if (!response.ok) throw new Error('Failed to update testimonial');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTestimonial = createAsyncThunk<string, string, { rejectValue: string }>(
  'testimonials/deleteTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/testimonials/items/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      return id; // Return the ID on success
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reorderTestimonials = createAsyncThunk<{ testimonials: TestimonialItem[] }, TestimonialItem[], { rejectValue: string }>(
  'testimonials/reorderTestimonials',
  async (reorderedItems, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/testimonials/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testimonials: reorderedItems }),
      });
      if (!response.ok) throw new Error('Failed to reorder testimonials');
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      // Fetch
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action: PayloadAction<FetchResponse>) => {
        state.loading = false;
        state.content = action.payload.content || initialState.content;
        state.testimonials = (action.payload.testimonials || []).sort((a, b) => a.order - b.order);
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'An unknown error occurred';
      })

      // Update Content
      .addCase(updateTestimonialsContent.pending, (state) => {
        state.actionLoading.content = true;
      })
      .addCase(updateTestimonialsContent.fulfilled, (state, action: PayloadAction<{ content: TestimonialsContent }>) => {
        state.actionLoading.content = false;
        state.content = action.payload.content;
      })
      .addCase(updateTestimonialsContent.rejected, (state, action) => {
        state.actionLoading.content = false;
        state.error = action.payload ?? 'Failed to update content';
      })

      // Create
      .addCase(createTestimonial.pending, (state) => {
        state.actionLoading.create = true;
      })
      .addCase(createTestimonial.fulfilled, (state, action: PayloadAction<{ testimonial: TestimonialItem }>) => {
        state.actionLoading.create = false;
        state.testimonials.push(action.payload.testimonial);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.actionLoading.create = false;
        state.error = action.payload ?? 'Failed to create testimonial';
      })
      
      // Update
      .addCase(updateTestimonial.pending, (state) => {
        state.actionLoading.update = true;
      })
      .addCase(updateTestimonial.fulfilled, (state, action: PayloadAction<{ testimonial: TestimonialItem }>) => {
        state.actionLoading.update = false;
        const index = state.testimonials.findIndex(item => item.id === action.payload.testimonial.id);
        if (index !== -1) {
          state.testimonials[index] = action.payload.testimonial;
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.actionLoading.update = false;
        state.error = action.payload ?? 'Failed to update testimonial';
      })
      
      // Delete
      .addCase(deleteTestimonial.pending, (state) => {
        state.actionLoading.delete = true;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading.delete = false;
        state.testimonials = state.testimonials.filter(item => item.id !== action.payload);
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.actionLoading.delete = false;
        state.error = action.payload ?? 'Failed to delete testimonial';
      })
      
      // Reorder
      .addCase(reorderTestimonials.pending, (state) => {
        state.actionLoading.reorder = true;
      })
      .addCase(reorderTestimonials.fulfilled, (state, action: PayloadAction<{ testimonials: TestimonialItem[] }>) => {
        state.actionLoading.reorder = false;
        state.testimonials = action.payload.testimonials.sort((a, b) => a.order - b.order);
      })
      .addCase(reorderTestimonials.rejected, (state, action) => {
        state.actionLoading.reorder = false;
        state.error = action.payload ?? 'Failed to reorder testimonials';
      });
  },
});

export const { clearError } = testimonialsSlice.actions;
export const selectTestimonials = (state: RootState) => state.testimonials;

export default testimonialsSlice.reducer;