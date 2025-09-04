// store/slices/investorInsightsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ITestimonial {
  _id?: string;
  quote: string;
  content: string;
  designation: string;
  src: string;
  order: number;
}

export interface IInvestorInsightsContent {
  title: string;
  subtitle: string;
  description: string;
}

export interface IInvestorInsights {
  _id?: string;
  content: IInvestorInsightsContent;
  testimonials: ITestimonial[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface InvestorInsightsState {
  data: IInvestorInsights | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

const initialState: InvestorInsightsState = {
  data: null,
  loading: false,
  error: null,
  saving: false,
};

// Async thunks
export const fetchInvestorInsights = createAsyncThunk(
  'investorInsights/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/investor-insights');
      if (!response.ok) {
        throw new Error('Failed to fetch investor insights');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInvestorInsightsContent = createAsyncThunk(
  'investorInsights/updateContent',
  async (content: IInvestorInsightsContent, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/investor-insights/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTestimonial = createAsyncThunk(
  'investorInsights/addTestimonial',
  async (testimonial: Omit<ITestimonial, '_id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/investor-insights/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial),
      });

      if (!response.ok) {
        throw new Error('Failed to add testimonial');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'investorInsights/updateTestimonial',
  async ({ id, testimonial }: { id: string; testimonial: Partial<ITestimonial> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/investor-insights/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonial),
      });

      if (!response.ok) {
        throw new Error('Failed to update testimonial');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'investorInsights/deleteTestimonial',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/investor-insights/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reorderTestimonials = createAsyncThunk(
  'investorInsights/reorderTestimonials',
  async (testimonials: ITestimonial[], { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/investor-insights/testimonials/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testimonials }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder testimonials');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const investorInsightsSlice = createSlice({
  name: 'investorInsights',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLocalContent: (state, action: PayloadAction<IInvestorInsightsContent>) => {
      if (state.data) {
        state.data.content = action.payload;
      }
    },
    setLocalTestimonials: (state, action: PayloadAction<ITestimonial[]>) => {
      if (state.data) {
        state.data.testimonials = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch investor insights
      .addCase(fetchInvestorInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestorInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInvestorInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update content
      .addCase(updateInvestorInsightsContent.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateInvestorInsightsContent.fulfilled, (state, action) => {
        state.saving = false;
        if (state.data) {
          state.data.content = action.payload.content;
        }
      })
      .addCase(updateInvestorInsightsContent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      
      // Add testimonial
      .addCase(addTestimonial.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addTestimonial.fulfilled, (state, action) => {
        state.saving = false;
        if (state.data) {
          state.data.testimonials.push(action.payload);
        }
      })
      .addCase(addTestimonial.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      
      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.saving = false;
        if (state.data) {
          const index = state.data.testimonials.findIndex(t => t._id === action.payload._id);
          if (index !== -1) {
            state.data.testimonials[index] = action.payload;
          }
        }
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      
      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.saving = false;
        if (state.data) {
          state.data.testimonials = state.data.testimonials.filter(t => t._id !== action.payload);
        }
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      
      // Reorder testimonials
      .addCase(reorderTestimonials.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(reorderTestimonials.fulfilled, (state, action) => {
        state.saving = false;
        if (state.data) {
          state.data.testimonials = action.payload.testimonials;
        }
      })
      .addCase(reorderTestimonials.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLocalContent, setLocalTestimonials } = investorInsightsSlice.actions;
export default investorInsightsSlice.reducer;