import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CuratedCollection {
  _id?: string;
  title: string;
  description: string;
  isActive: boolean;
}

interface AdminCuratedState {
  collection: CuratedCollection | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminCuratedState = {
  collection: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCuratedCollection = createAsyncThunk(
  'adminCurated/fetchCollection',
  async () => {
    const response = await fetch('/api/cms/collection');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

export const updateCuratedCollection = createAsyncThunk(
  'adminCurated/updateCollection',
  async (data: Omit<CuratedCollection, '_id'>) => {
    const response = await fetch('/api/cms/collection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

const adminCuratedSlice = createSlice({
  name: 'adminCurated',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch collection
      .addCase(fetchCuratedCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCuratedCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.collection = action.payload;
      })
      .addCase(fetchCuratedCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collection';
      })
      // Update collection
      .addCase(updateCuratedCollection.fulfilled, (state, action) => {
        state.collection = action.payload;
      });
  },
});

export const { clearError } = adminCuratedSlice.actions;
export default adminCuratedSlice.reducer;