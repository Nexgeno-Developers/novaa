import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the types for your state
interface ContactDetail {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

interface ContactState {
  loading: boolean;
  error: string | null;
  data: {
    details: ContactDetail[];
    formTitle: string;
    formDescription: string;
    formImage: string;
    mapImage: string;
  };
}

const initialState: ContactState = {
  loading: false,
  error: null,
  data: {
    details: [],
    formTitle: '',
    formDescription: '',
    formImage: '',
    mapImage: '',
  },
};

// Async thunk to fetch contact data
export const fetchContactData = createAsyncThunk('contact/fetchData', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/cms/contact');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch data');
  }
});

// Async thunk to update contact data
export const updateContactData = createAsyncThunk('contact/updateData', async (updatedData: Partial<ContactState['data']>, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/cms/contact', updatedData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update data');
  }
});

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Reducer to handle local state updates before saving
    setContactData: (state, action: PayloadAction<Partial<ContactState['data']>>) => {
      state.data = { ...state.data, ...action.payload };
    },
    setContactDetail: (state, action: PayloadAction<{ index: number; field: keyof ContactDetail; value: string }>) => {
        const { index, field, value } = action.payload;
        if (state.data.details[index]) {
            // This is a workaround because direct assignment is not always reactive
            const newDetails = [...state.data.details];
            newDetails[index] = { ...newDetails[index], [field]: value };
            state.data.details = newDetails;
        }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Data
      .addCase(fetchContactData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Data
      .addCase(updateContactData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        // Optionally add a success message/toast here
      })
      .addCase(updateContactData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setContactData, setContactDetail } = contactSlice.actions;
export default contactSlice.reducer;
