import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  order: number;
}

interface AdminCategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "adminCategories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/cms/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "default",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch categories");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "adminCategories/createCategory",
  async (data: Omit<Category, "_id" | "slug">) => {
    try {
      const response = await fetch("/api/cms/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Response from createCategory:", response);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  "adminCategories/updateCategory",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Omit<Category, "_id" | "slug">;
  }) => {
    const response = await fetch(`/api/cms/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "adminCategories/deleteCategory",
  async (id: string) => {
    const response = await fetch(`/api/cms/categories/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return id;
  }
);

// NEW: Batch reorder categories
export const reorderCategories = createAsyncThunk(
  "adminCategories/reorderCategories",
  async (categories: Category[], { rejectWithValue }) => {
    try {
            console.log('🚀 Dispatching reorder to API...');

      const response = await fetch("/api/cms/categories/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to reorder categories");
      }

      return categories;
    } catch (error) {
      console.error("Error reordering categories:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to reorder categories"
      );
    }
  }
);

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // NEW: Optimistic update for drag and drop
    optimisticReorder: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      // NEW: Handle reorder
      .addCase(reorderCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(reorderCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(reorderCategories.rejected, (state, action) => {
        state.error = action.error.message || "Failed to reorder categories";
      });
  },
});

export const { clearError, optimisticReorder } = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;