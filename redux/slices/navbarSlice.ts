import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface NavbarState {
  logo: { url: string } | null;
  items: NavbarItem[];
  loading: boolean;
  error: string | null;
}

const initialState: NavbarState = {
  logo: null,
  items: [],
  loading: false,
  error: null,
};

export const fetchNavbar = createAsyncThunk('navbar/fetch', async () => {
  const response = await fetch('/api/cms/navbar');
  return response.json();
});

export const updateNavbar = createAsyncThunk(
  'navbar/update',
  async (data: { logo?: any; items?: NavbarItem[] }) => {
    const response = await fetch('/api/cms/navbar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    updateNavbarItems: (state, action) => {
      state.items = action.payload;
    },
    updateLogo: (state, action) => {
      state.logo = {url : action.payload.url};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavbar.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNavbar.fulfilled, (state, action) => {
        state.loading = false;
        state.logo = action.payload.logo;
        state.items = action.payload.items || [];
      })
      .addCase(fetchNavbar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch navbar';
      })
      .addCase(updateNavbar.fulfilled, (state, action) => {
        if (action.payload.logo) state.logo = action.payload.logo;
        if (action.payload.items) state.items = action.payload.items;
      });
  },
});

export const { updateNavbarItems, updateLogo } = navbarSlice.actions;
export default navbarSlice.reducer;
