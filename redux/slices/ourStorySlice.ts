import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the shape of our data
export interface OurStory {
  _id?: string;
  pageSlug: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
}

// Define the state
interface OurStoryState {
  data: OurStory | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OurStoryState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchOurStory = createAsyncThunk(
  'ourStory/fetchData',
  async (slug: string) => {
    const response = await axios.get(`/api/cms/our-story/${slug}`);
    return response.data;
  }
);

export const updateOurStory = createAsyncThunk(
  'ourStory/updateData',
  async (payload: { slug: string; data: Partial<OurStory> }) => {
    const { slug, data } = payload;
    const response = await axios.put(`/api/cms/our-story/${slug}`, data);
    return response.data;
  }
);

// The slice
const ourStorySlice = createSlice({
  name: 'ourStory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Handlers
      .addCase(fetchOurStory.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOurStory.fulfilled, (state, action: PayloadAction<OurStory>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOurStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      })
      // Update Handlers
      .addCase(updateOurStory.pending, (state) => { state.status = 'loading'; })
      .addCase(updateOurStory.fulfilled, (state, action: PayloadAction<OurStory>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateOurStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update data';
      });
  },
});

export default ourStorySlice.reducer;