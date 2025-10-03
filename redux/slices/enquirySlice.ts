import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Enquiry {
  _id: string;
  fullName: string;
  emailAddress?: string;
  phoneNo: string;
  location: string;
  message?: string;
  status: 'new' | 'contacted' | 'interested' | 'closed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryFormData {
  fullName: string;
  emailAddress?: string;
  phoneNo: string;
  location: string;
  message?: string;
}

export interface EnquiryUpdateData {
  id: string;
  status?: 'new' | 'contacted' | 'interested' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface EnquiryFilters {
  page: number;
  limit: number;
  status?: string;
  priority?: string;
  search?: string;
}

export interface StatusSummary {
  total: number;
  new: number;
  contacted: number;
  interested: number;
  closed: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalEnquiries: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface EnquiryState {
  enquiries: Enquiry[];
  selectedEnquiry: Enquiry | null;
  statusSummary: StatusSummary;
  pagination: Pagination;
  filters: EnquiryFilters;
  loading: boolean;
  error: string | null;
  submissionStatus: 'idle' | 'submitting' | 'success' | 'error';
}

const initialState: EnquiryState = {
  enquiries: [],
  selectedEnquiry: null,
  statusSummary: {
    total: 0,
    new: 0,
    contacted: 0,
    interested: 0,
    closed: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEnquiries: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    page: 1,
    limit: 10,
    status: 'all',
    priority: 'all',
    search: '',
  },
  loading: false,
  error: null,
  submissionStatus: 'idle',
};

// Async thunks
export const fetchEnquiries = createAsyncThunk(
  'enquiry/fetchEnquiries',
  async (filters: Partial<EnquiryFilters> = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/enquiries?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch enquiries');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const fetchSingleEnquiry = createAsyncThunk(
  'enquiry/fetchSingleEnquiry',
  async (id: string) => {
    const response = await fetch(`/api/enquiries/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch enquiry');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const createEnquiry = createAsyncThunk(
  'enquiry/createEnquiry',
  async (enquiryData: EnquiryFormData) => {
    const response = await fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enquiryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit enquiry');
    }
    
    return data.data;
  }
);

export const updateEnquiry = createAsyncThunk(
  'enquiry/updateEnquiry',
  async ({ id, ...updateData }: EnquiryUpdateData) => {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update enquiry');
    }
    
    return data.data;
  }
);

export const deleteEnquiry = createAsyncThunk(
  'enquiry/deleteEnquiry',
  async (id: string) => {
    const response = await fetch(`/api/enquiries/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete enquiry');
    }
    
    return id;
  }
);

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<EnquiryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedEnquiry: (state) => {
      state.selectedEnquiry = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSubmissionStatus: (state) => {
      state.submissionStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch enquiries
      .addCase(fetchEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload.enquiries;
        state.statusSummary = action.payload.statusSummary;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch enquiries';
      })
      
      // Fetch single enquiry
      .addCase(fetchSingleEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEnquiry = action.payload;
      })
      .addCase(fetchSingleEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch enquiry';
      })
      
      // Create enquiry
      .addCase(createEnquiry.pending, (state) => {
        state.submissionStatus = 'submitting';
        state.error = null;
      })
      .addCase(createEnquiry.fulfilled, (state) => {
        state.submissionStatus = 'success';
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.submissionStatus = 'error';
        state.error = action.error.message || 'Failed to submit enquiry';
      })
      
      // Update enquiry
      .addCase(updateEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.enquiries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.enquiries[index] = action.payload;
        }
        if (state.selectedEnquiry?._id === action.payload._id) {
          state.selectedEnquiry = action.payload;
        }
      })
      .addCase(updateEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update enquiry';
      })
      
      // Delete enquiry
      .addCase(deleteEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = state.enquiries.filter(e => e._id !== action.payload);
        if (state.selectedEnquiry?._id === action.payload) {
          state.selectedEnquiry = null;
        }
      })
      .addCase(deleteEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete enquiry';
      });
  },
});

export const { setFilters, clearSelectedEnquiry, clearError, resetSubmissionStatus } = enquirySlice.actions;
export default enquirySlice.reducer;