// redux/slices/homeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface HighlightedWord {
  word: string;
  style: {
    color?: string;
    fontWeight?: string;
    textDecoration?: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
  };
}

interface CtaButton {
  text: string;
  href: string;
  isActive: boolean;
}

interface HeroSection {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle?: string;
  highlightedWords?: HighlightedWord[];
  ctaButton?: CtaButton;
  overlayOpacity?: number;
  overlayColor?: string;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
}

interface HomeState {
  heroSection: HeroSection | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}

const initialState: HomeState = {
  heroSection: null,
  loading: false,
  error: null,
  saving: false,
};

// Fetch home page data
export const fetchHomePage = createAsyncThunk(
  'home/fetchHomePage',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/home');
      if (!response.ok) {
        throw new Error('Failed to fetch home page data');
      }
      const data = await response.json();
      return data.heroSection;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update home page data
export const updateHomePage = createAsyncThunk(
  'home/updateHomePage',
  async (heroData: HeroSection, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cms/home', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ heroSection: heroData }),
      });

      if (!response.ok) {
        throw new Error('Failed to update home page');
      }

      const data = await response.json();
      return data.heroSection;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateHeroSection: (state, action) => {
      state.heroSection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch home page
      .addCase(fetchHomePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomePage.fulfilled, (state, action) => {
        state.loading = false;
        state.heroSection = action.payload;
      })
      .addCase(fetchHomePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update home page
      .addCase(updateHomePage.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateHomePage.fulfilled, (state, action) => {
        state.saving = false;
        state.heroSection = action.payload;
      })
      .addCase(updateHomePage.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateHeroSection } = homeSlice.actions;
export default homeSlice.reducer;