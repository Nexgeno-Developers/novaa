import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../';

export interface Section {
  _id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  pageSlug: string;
  component: string;
  status: 'active' | 'inactive';
  settings: {
    isVisible: boolean;
    [key: string]: any;
  };
  content?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface PageState {
  pages: Page[];
  sections: Section[];
  currentSection: Section | null;
  loading: boolean;
  sectionsLoading: boolean;
  sectionLoading: boolean;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
  error: string | null;
}

const initialState: PageState = {
  pages: [],
  sections: [],
  currentSection: null,
  loading: false,
  sectionsLoading: false,
  sectionLoading: false,
  searchTerm: '',
  statusFilter: 'all',
  error: null,
};

// Async thunks
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 fetchPages thunk started');
      
      const response = await fetch('/api/cms/pages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store', // Ensure fresh data
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not ok:', errorText);
        
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ fetchPages success, data length:', data.length);
      console.log('✅ fetchPages data sample:', data.slice(0, 2));
      
      return data;
    } catch (error) {
      console.error('💥 Fetch pages error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch pages'
      );
    }
  }
);

export const fetchPageSections = createAsyncThunk(
  'pages/fetchPageSections',
  async (pageSlug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/sections?pageSlug=${encodeURIComponent(pageSlug)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch sections error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch sections'
      );
    }
  }
);

export const fetchSection = createAsyncThunk(
  'pages/fetchSection',
  async (
    { pageSlug, sectionSlug }: { pageSlug: string; sectionSlug: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/cms/sections/${encodeURIComponent(pageSlug)}/${encodeURIComponent(sectionSlug)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch section error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch section'
      );
    }
  }
);

export const updateSection = createAsyncThunk(
  'pages/updateSection',
  async (
    {
      pageSlug,
      sectionSlug,
      data,
    }: {
      pageSlug: string;
      sectionSlug: string;
      data: Partial<Section>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/cms/sections/${encodeURIComponent(pageSlug)}/${encodeURIComponent(sectionSlug)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedSection = await response.json();
      return updatedSection;
    } catch (error) {
      console.error('Update section error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update section'
      );
    }
  }
);

export const updateSectionsOrder = createAsyncThunk(
  'pages/updateSectionsOrder',
  async (sections: Section[], { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sections }),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedSections = await response.json();
      return updatedSections;
    } catch (error) {
      console.error('Update sections order error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update sections order'
      );
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (pageData: Omit<Page, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(pageData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newPage = await response.json();
      return newPage;
    } catch (error) {
      console.error('Create page error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create page'
      );
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.statusFilter = action.payload;
    },
    clearCurrentSection: (state) => {
      state.currentSection = null;
    },
    updateSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pages
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload;
        state.error = null;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch page sections
      .addCase(fetchPageSections.pending, (state) => {
        state.sectionsLoading = true;
        state.error = null;
      })
      .addCase(fetchPageSections.fulfilled, (state, action) => {
        state.sectionsLoading = false;
        state.sections = action.payload;
        state.error = null;
      })
      .addCase(fetchPageSections.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch single section
      .addCase(fetchSection.pending, (state) => {
        state.sectionLoading = true;
        state.error = null;
      })
      .addCase(fetchSection.fulfilled, (state, action) => {
        state.sectionLoading = false;
        state.currentSection = action.payload;
        state.error = null;
      })
      .addCase(fetchSection.rejected, (state, action) => {
        state.sectionLoading = false;
        state.error = action.payload as string;
      })
      
      // Update section
      .addCase(updateSection.fulfilled, (state, action) => {
        state.currentSection = action.payload;
        // Also update in sections array if present
        const index = state.sections.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
      })
      
      // Update sections order
      .addCase(updateSectionsOrder.fulfilled, (state, action) => {
        state.sections = action.payload;
      })
      
      // Create page
      .addCase(createPage.fulfilled, (state, action) => {
        state.pages.unshift(action.payload);
      });
  },
});

export const {
  setSearchTerm,
  setStatusFilter,
  clearCurrentSection,
  updateSections,
  clearError,
} = pagesSlice.actions;

// Selectors
export const selectPages = (state: RootState) => state.pages.pages;
export const selectSections = (state: RootState) => state.pages.sections;
export const selectCurrentSection = (state: RootState) => state.pages.currentSection;
export const selectPagesLoading = (state: RootState) => state.pages.loading;
export const selectSectionsLoading = (state: RootState) => state.pages.sectionsLoading;
export const selectSectionLoading = (state: RootState) => state.pages.sectionLoading;
export const selectSearchTerm = (state: RootState) => state.pages.searchTerm;
export const selectStatusFilter = (state: RootState) => state.pages.statusFilter;
export const selectError = (state: RootState) => state.pages.error;

export const selectFilteredPages = (state: RootState) => {
  const { pages, searchTerm, statusFilter } = state.pages;
  
  let filtered = pages;
  
  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(
      page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.description && page.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
  
  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter(page => page.status === statusFilter);
  }
  
  return filtered;
};

export default pagesSlice.reducer;