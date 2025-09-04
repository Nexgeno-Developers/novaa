import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


// Define the structure of a media item
export interface MediaItem {
  _id: string;
  alt: any;
  public_id: string;
  resource_type: "image" | "video";
  secure_url: string;
  url: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
  folder?: string;
  tags?: string[];
}

// Define the state structure
interface MediaState {
  loading: boolean;
  items: MediaItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  query: string;
  type: string; // "all" | "image" | "video"
  cursor?: string;
  hasMore: boolean;
  totalCount: number;
}

const initialState: MediaState = {
  loading: false,
  items: [],
  status: "idle",
  error: null,
  query: "",
  type: "all",
  cursor: undefined,
  hasMore: true,
  totalCount: 0,
};

// Async thunk to fetch media from your API
export const fetchMedia = createAsyncThunk(
  "media/fetchMedia",
  async ({
    query,
    type,
    cursor,
    limit = 20,
    reset = false,
  }: {
    query?: string;
    type?: string;
    cursor?: string;
    limit?: number;
    reset?: boolean;
  }) => {
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (type && type !== "all") params.append("type", type);
    if (cursor && !reset) params.append("cursor", cursor);
    params.append("limit", limit.toString());

    const response = await axios.get(`/api/cms/media?${params.toString()}`);
    console.log("API fetchMedia response:", response.data);

    return {
      resources: response.data.data.resources as MediaItem[],
      totalCount: response.data.data.total_count || 0,
      nextCursor: response.data.data.next_cursor,
      reset,
    };
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    resetMedia: (state) => {
      state.items = [];
      state.cursor = undefined;
      state.hasMore = true;
      state.status = "idle";
    },
    addMediaItem: (state, action: PayloadAction<MediaItem>) => {
      // Check if item already exists to avoid duplicates
      const exists = state.items.find(
        (item) => item.public_id === action.payload.public_id
      );
      if (!exists) {
        state.items.unshift(action.payload);
        state.totalCount += 1;
      }
    },
    removeMediaItem: (state, action: PayloadAction<string>) => {
      const initialLength = state.items.length;
      state.items = state.items.filter(
        (item) => item.public_id !== action.payload
      );
      // Update total count if item was actually removed
      if (state.items.length < initialLength) {
        state.totalCount = Math.max(0, state.totalCount - 1);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";

        const { resources, totalCount, nextCursor, reset } = action.payload;

        if (reset || !state.cursor) {
          // Fresh search or initial load
          state.items = resources;
        } else {
          // Pagination - append new items
          state.items = [...state.items, ...resources];
        }

        state.totalCount = totalCount;
        state.cursor = nextCursor;
        state.hasMore = resources.length === 20; // Assuming limit is 20
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch media";
      });
  },
});

export const {
  setQuery,
  setType,
  resetMedia,
  addMediaItem,
  removeMediaItem,
  clearError,
} = mediaSlice.actions;

export default mediaSlice.reducer;
