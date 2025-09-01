import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

// Interfaces matching our Mongoose model
interface InvestmentPoint {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

interface WhyInvestData {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  investmentPoints: InvestmentPoint[];
  images: string[];
}

interface UpdateWhyInvestPayload {
  pageSlug?: string;
  updatedData: WhyInvestData;
}

interface WhyInvestState {
  data: WhyInvestData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WhyInvestState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchWhyInvestData = createAsyncThunk(
  "whyInvest/fetchData",
  async (pageSlug: string = "home") => {
    try {
      const response = await axios.get(`/api/cms/sections/${pageSlug}/why-invest-section`);
      return response.data.content;
    } catch (err) {
      // fallback
      const fallback = await axios.get("/api/cms/home");
      return fallback.data.whyInvest;
    }
  }
);

// Async Thunk to update data
export const updateWhyInvestData = createAsyncThunk(
  'whyInvest/updateData',
  async ({pageSlug = "home" , updatedData} : UpdateWhyInvestPayload ) => {
      const response = await axios.post(`/api/cms/sections/${pageSlug}/why-invest-section` , updatedData);
    return response.data.data;
  }
);

const whyInvestSlice = createSlice({
  name: 'whyInvest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchWhyInvestData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWhyInvestData.fulfilled, (state, action: PayloadAction<WhyInvestData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWhyInvestData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
        toast.error('Failed to load data!');
      })
      // Update Data
      .addCase(updateWhyInvestData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateWhyInvestData.fulfilled, (state, action: PayloadAction<WhyInvestData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        toast.success('Content updated successfully!');
      })
      .addCase(updateWhyInvestData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update data';
        toast.error('Failed to save changes!');
      });
  },
});

export default whyInvestSlice.reducer;