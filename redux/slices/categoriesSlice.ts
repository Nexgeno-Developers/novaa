import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
        // Add cache control for admin pages
        cache: "no-store",
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
    const response = await fetch("/api/cms/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
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

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
      });
  },
});

export const { clearError } = adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
