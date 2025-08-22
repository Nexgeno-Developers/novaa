import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the shape of our data
interface BreadcrumbData {
  pageSlug: string;
  _id?: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
}

// Define the state
interface BreadcrumbState {
  data: BreadcrumbData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BreadcrumbState = {
  data: null,
  status: 'idle',
  error: null,
};

// Thunk for fetching data for a specific page
export const fetchBreadcrumbData = createAsyncThunk(
  'breadcrumb/fetchData',
  async (slug: string) => {
    const response = await axios.get(`/api/cms/breadcrumb/${slug}`);
    return response.data;
  }
);

// Thunk for updating data for a specific page
export const updateBreadcrumbData = createAsyncThunk(
  'breadcrumb/updateData',
  async (payload: { slug: string; data: Partial<BreadcrumbData> }) => {
    const { slug, data } = payload;
    const response = await axios.put(`/api/cms/breadcrumb/${slug}`, data);
    return response.data;
  }
);

// The slice
const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Handlers
      .addCase(fetchBreadcrumbData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBreadcrumbData.fulfilled, (state, action: PayloadAction<BreadcrumbData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchBreadcrumbData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      })
      // Update Handlers
      .addCase(updateBreadcrumbData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBreadcrumbData.fulfilled, (state, action: PayloadAction<BreadcrumbData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateBreadcrumbData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update data';
      });
  },
});

export default breadcrumbSlice.reducer;