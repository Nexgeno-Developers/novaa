import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogCategoriesState {
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBlogCategories = createAsyncThunk(
  'blogCategories/fetchBlogCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blog-categories');
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch blog categories');
    }
  }
);

export const createBlogCategory = createAsyncThunk(
  'blogCategories/createBlogCategory',
  async (categoryData: Partial<BlogCategory>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blog-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to create blog category');
    }
  }
);

export const updateBlogCategory = createAsyncThunk(
  'blogCategories/updateBlogCategory',
  async ({ id, data }: { id: string; data: Partial<BlogCategory> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return rejectWithValue(result.error);
      }
      
      return result.data;
    } catch (error) {
      return rejectWithValue('Failed to update blog category');
    }
  }
);

export const deleteBlogCategory = createAsyncThunk(
  'blogCategories/deleteBlogCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blog-categories/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.error);
      }
      
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete blog category');
    }
  }
);

const blogCategoriesSlice = createSlice({
  name: 'blogCategories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCategories: (state, action: PayloadAction<BlogCategory[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    // Fetch blog categories
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create blog category
      .addCase(createBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update blog category
      .addCase(updateBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete blog category
      .addCase(deleteBlogCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(cat => cat._id !== action.payload);
      })
      .addCase(deleteBlogCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError , setCategories} = blogCategoriesSlice.actions;
export default blogCategoriesSlice.reducer;
