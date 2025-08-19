import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface AboutData {
  title: string;
  showSubtitle: boolean;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgType: 'image' | 'video';
  bgImage1: string;
  bgImage2: string;
  bgVideo: string;
  topOverlay: boolean;
  bottomOverlay: boolean;
}

interface AboutState {
  data: AboutData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  lastSaved: string | null;
}

const initialState: AboutState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
  lastSaved: null,
};

// Async thunk to fetch about data
export const fetchAboutData = createAsyncThunk(
  'about/fetchAboutData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cms/about');
      return response.data.data as AboutData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch about data');
    }
  }
);

// Async thunk to save about data
export const saveAboutData = createAsyncThunk(
  'about/saveAboutData',
  async (data: AboutData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cms/about', data);
      return response.data.data as AboutData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save about data');
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    updateField: (state, action: PayloadAction<{ field: keyof AboutData; value: any }>) => {
      if (state.data) {
        (state.data as any)[action.payload.field] = action.payload.value;
      }
    },
    updateDescription: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.description = action.payload;
      }
    },
    resetForm: (state) => {
      // Reset to last saved state or initial values
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch about data
      .addCase(fetchAboutData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAboutData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save about data
      .addCase(saveAboutData.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveAboutData.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
        state.lastSaved = new Date().toISOString();
      })
      .addCase(saveAboutData.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  }
});

export const { updateField, updateDescription, resetForm, clearError } = aboutSlice.actions;
export default aboutSlice.reducer;