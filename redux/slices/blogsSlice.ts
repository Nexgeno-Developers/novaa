import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Main Blog interface (for populated data from API)
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: {
    _id: string;
    title: string;
    slug: string;
  };
  categoryName: string;
  isActive: boolean;
  order: number;
  readTime: string;
  views: number;
  author: {
    name: string;
    avatar: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Interface for creating/updating blogs (category as string ID)
export interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string; // Category ID as string
  categoryName: string;
  isActive: boolean;
  order: number;
  author: {
    name: string;
    avatar: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  tags: string[];
}

interface BlogsState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const initialState: BlogsState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// Async thunks
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (
    params: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      status?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.category) searchParams.append("category", params.category);
      if (params.search) searchParams.append("search", params.search);
      if (params.status) searchParams.append("status", params.status);

      const response = await fetch(`/api/blogs?${searchParams.toString()}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch blogs");
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch blog");
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blogs/slug/${slug}`);
      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch blog");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData: Partial<BlogFormData>, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return data.data;
    } catch (error) {
      return rejectWithValue("Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async (
    { id, data }: { id: string; data: Partial<BlogFormData> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return rejectWithValue(result.error);
      }

      return result.data;
    } catch (error) {
      return rejectWithValue("Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.error);
      }

      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete blog");
    }
  }
);

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch blog by slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.blogs.findIndex(
          (blog) => blog._id === action.payload._id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if (state.currentBlog?._id === action.payload._id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        if (state.currentBlog?._id === action.payload) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBlog , setBlogs} = blogsSlice.actions;
export default blogsSlice.reducer;
