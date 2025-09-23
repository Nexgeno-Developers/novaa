import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SubmenuItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
}

interface NavbarItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  submenu?: SubmenuItem[]; 
}

interface NavbarState {
  logo: {
    alt: string; 
    url: string 
  } | null;
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
      state.logo = {url : action.payload.url , alt : action.payload.alt};
    },
    // Add submenu-specific reducers
    addSubmenuItem: (state, action) => {
      const { parentId, submenuItem } = action.payload;
      const parentItem = state.items.find(item => item._id === parentId);
      if (parentItem) {
        if (!parentItem.submenu) {
          parentItem.submenu = [];
        }
        parentItem.submenu.push(submenuItem);
      }
    },
    updateSubmenuItem: (state, action) => {
      const { parentId, submenuId, updatedSubmenuItem } = action.payload;
      const parentItem = state.items.find(item => item._id === parentId);
      if (parentItem && parentItem.submenu) {
        const submenuIndex = parentItem.submenu.findIndex(sub => sub._id === submenuId);
        if (submenuIndex !== -1) {
          parentItem.submenu[submenuIndex] = updatedSubmenuItem;
        }
      }
    },
    deleteSubmenuItem: (state, action) => {
      const { parentId, submenuId } = action.payload;
      const parentItem = state.items.find(item => item._id === parentId);
      if (parentItem && parentItem.submenu) {
        parentItem.submenu = parentItem.submenu.filter(sub => sub._id !== submenuId);
      }
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

export const { 
  updateNavbarItems, 
  updateLogo, 
  addSubmenuItem, 
  updateSubmenuItem, 
  deleteSubmenuItem 
} = navbarSlice.actions;

export default navbarSlice.reducer;

// Export types for use in components
export type { NavbarItem, SubmenuItem };