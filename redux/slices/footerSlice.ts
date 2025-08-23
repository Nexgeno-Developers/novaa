import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Simple types that match the MongoDB schema structure
export interface Link {
  label: string;
  url: string;
}

export interface SocialLink {
  name: 'whatsapp' | 'facebook' | 'instagram' | 'twitter';
  url: string;
}

export interface FooterData {
  _id?: string;
  sectionId: string;
  bgImageOne: string;
  bgImageTwo: string;
  bgImageThree: string;
  tagline: {
    title: string;
    subtitle: string;
    description: string;
  };
  ctaButtonLines: string[];
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
    links: Link[];
  };
  contact: {
    phone: string;
    email: string;
  };
  socials: {
    title: string;
    links: SocialLink[];
  };
  copyrightText: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FooterState {
  data: FooterData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FooterState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchFooterData = createAsyncThunk('footer/fetchData', async () => {
  const response = await axios.get('/api/cms/footer');
  return response.data;
});

export const updateFooterData = createAsyncThunk(
  'footer/updateData',
  async (data: Partial<FooterData>) => {
    const response = await axios.put('/api/cms/footer', data);
    return response.data;
  }
);

const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooterData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFooterData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchFooterData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(updateFooterData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateFooterData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateFooterData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update data';
      });
  },
});

export default footerSlice.reducer;