// app/store/slices/novaaAdvantageSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';


// Define the types for our state
interface AdvantageItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order:number;
}

interface NovaaAdvantageState {
  data: {
    title: string;
        highlightedTitle: string;
    description: string;
    backgroundImage: string;
    logoImage: string;
    advantages: AdvantageItem[];
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NovaaAdvantageState = {
  data: null,
  status: 'idle',
  error: null,
};

// Async Thunk for fetching data
export const fetchNovaaAdvantageData = createAsyncThunk(
  'novaaAdvantage/fetchData',
  async () => {
    const response = await fetch('/api/cms/advantage');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  }
);

// Async Thunk for saving data
export const saveNovaaAdvantageData = createAsyncThunk(
  'novaaAdvantage/saveData',
  async (data: NovaaAdvantageState['data']) => {
    const response = await fetch('/api/cms/advantage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to save changes');
    }
    return await response.json();
  }
);

const novaaAdvantageSlice = createSlice({
  name: 'novaaAdvantage',
  initialState,
  reducers: {
    // Reducers for synchronous state updates
    updateMainField: (state, action: PayloadAction<{ field: 'title' | 'highlightedTitle'| 'description' | 'backgroundImage' | 'logoImage'; value: string }>) => {
      if (state.data) {
        state.data[action.payload.field] = action.payload.value;
      }
    },
    updateAdvantageItem: (state, action: PayloadAction<{ index: number; field: 'title' | 'description' | 'icon'; value: string }>) => {
      if (state.data) {
        const { index, field, value } = action.payload;
        state.data.advantages[index][field] = value;
      }
    },
    reorderAdvantages: (state, action: PayloadAction<AdvantageItem[]>) => {
  if (state.data) {
    // Map over the reordered array from the frontend
    const updatedAdvantages = action.payload.map((item, index) => ({
      ...item,
      // Assign the new index as the 'order' property
      order: index,
    }));
    // Save the new array with corrected order values to the state
    state.data.advantages = updatedAdvantages;
  }
}
  },
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchNovaaAdvantageData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNovaaAdvantageData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchNovaaAdvantageData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
        toast.error("Error fetching data!");
      })
      // Save Data
      .addCase(saveNovaaAdvantageData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveNovaaAdvantageData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        toast.success("Changes saved successfully!");
      })
      .addCase(saveNovaaAdvantageData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
        toast.error("Error saving changes!");
      });
  },
});

export const { 
  updateMainField,
  updateAdvantageItem,
  reorderAdvantages
} = novaaAdvantageSlice.actions;

export default novaaAdvantageSlice.reducer;