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

// Async Thunk to fetch data
export const fetchWhyInvestData = createAsyncThunk('whyInvest/fetchData', async () => {
  const response = await axios.get('/api/cms/why-invest');
  return response.data.data;
});

// Async Thunk to update data
export const updateWhyInvestData = createAsyncThunk(
  'whyInvest/updateData',
  async (updatedData: WhyInvestData) => {
    const response = await axios.post('/api/cms/why-invest', updatedData);
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