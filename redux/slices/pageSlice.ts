import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Page {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: 'active' | 'inactive';
  template: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  name: string;
  slug: string;
  pageSlug: string;
  order: number;
  status: 'active' | 'inactive';
  type: string;
  component: string;
  content: any;
  settings: {
    backgroundColor: string;
    textColor: string;
    padding: string;
    margin: string;
    isVisible: boolean;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface PagesState {
  pages: Page[];
  currentPage: Page | null;
  sections: Section[];
  currentSection: Section | null;
  loading: boolean;
  sectionsLoading: boolean;
  sectionLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
}

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  sections: [],
  currentSection: null,
  loading: false,
  sectionsLoading: false,
  sectionLoading: false,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
};

// Async thunks
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/pages', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPageSections = createAsyncThunk(
  'pages/fetchPageSections',
  async (pageSlug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/sections?pageSlug=${pageSlug}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchSection = createAsyncThunk(
  'pages/fetchSection',
  async ({ pageSlug, sectionSlug }: { pageSlug: string; sectionSlug: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/sections/${pageSlug}/${sectionSlug}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch section');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateSection = createAsyncThunk(
  'pages/updateSection',
  async ({ 
    pageSlug, 
    sectionSlug, 
    data 
  }: { 
    pageSlug: string; 
    sectionSlug: string; 
    data: Partial<Section> 
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cms/sections/${pageSlug}/${sectionSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update section');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
        throw new Error('Failed to update sections order');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
    clearCurrentPage: (state) => {
      state.currentPage = null;
      state.sections = [];
    },
    clearCurrentSection: (state) => {
      state.currentSection = null;
    },
    updateSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
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
        // Set current page based on first section's pageSlug
        if (action.payload.length > 0) {
          const pageSlug = action.payload[0].pageSlug;
          state.currentPage = state.pages.find(p => p.slug === pageSlug) || null;
        }
      })
      .addCase(fetchPageSections.rejected, (state, action) => {
        state.sectionsLoading = false;
        state.error = action.payload as string;
      })
      // Fetch section
      .addCase(fetchSection.pending, (state) => {
        state.sectionLoading = true;
        state.error = null;
      })
      .addCase(fetchSection.fulfilled, (state, action) => {
        state.sectionLoading = false;
        state.currentSection = action.payload;
      })
      .addCase(fetchSection.rejected, (state, action) => {
        state.sectionLoading = false;
        state.error = action.payload as string;
      })
      // Update section
      .addCase(updateSection.fulfilled, (state, action) => {
        state.currentSection = action.payload;
        // Update section in sections array
        const index = state.sections.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.sections[index] = action.payload;
        }
      })
      // Update sections order
      .addCase(updateSectionsOrder.fulfilled, (state, action) => {
        state.sections = action.payload;
      });
  },
});

export const { 
  setSearchTerm, 
  setStatusFilter, 
  clearCurrentPage, 
  clearCurrentSection,
  updateSections,
} = pagesSlice.actions;

// Selectors
export const selectFilteredPages = (state: { pages: PagesState }) => {
  const { pages, searchTerm, statusFilter } = state.pages;
  
  return pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

export const selectPagesLoading = (state: { pages: PagesState }) => state.pages.loading;
export const selectSectionsLoading = (state: { pages: PagesState }) => state.pages.sectionsLoading;
export const selectSectionLoading = (state: { pages: PagesState }) => state.pages.sectionLoading;
export const selectSearchTerm = (state: { pages: PagesState }) => state.pages.searchTerm;
export const selectCurrentPage = (state: { pages: PagesState }) => state.pages.currentPage;
export const selectSections = (state: { pages: PagesState }) => state.pages.sections;
export const selectCurrentSection = (state: { pages: PagesState }) => state.pages.currentSection;

export default pagesSlice.reducer;