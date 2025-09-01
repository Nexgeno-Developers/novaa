import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; // Keep uuid for client-side keys

// Define the types for our state
interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

interface FaqState {
  data: {
    title: string;
    description: string;
    backgroundImage: string;
    faqs: FaqItem[];
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FaqState = {
  data: null,
  status: "idle",
  error: null,
};

// Async Thunk for fetching data from the API
export const fetchFaqData = createAsyncThunk("faq/fetchData", async () => {
  const response = await fetch("/api/cms/faq");
  if (!response.ok) {
    throw new Error("Failed to fetch FAQ data");
  }
  return await response.json();
});

// Async Thunk for saving data to the API
export const saveFaqData = createAsyncThunk(
  "faq/saveData",
  async (data: FaqState["data"]) => {
    const response = await fetch("/api/cms/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to save FAQ changes");
    }
    return await response.json();
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    // Reducers for synchronous (instant) state updates
    updateMainField: (
      state,
      action: PayloadAction<{
        field: "title" | "description" | "backgroundImage";
        value: string;
      }>
    ) => {
      if (state.data) {
        state.data[action.payload.field] = action.payload.value;
      }
    },
    addFaqItem: (state) => {
      if (state.data) {
        const newFaq: FaqItem = {
          _id: uuidv4(),
          question: "New Question",
          answer: "<p>New answer.</p>",
          order: state.data.faqs.length,
        };
        state.data.faqs.push(newFaq);
      }
    },
    removeFaqItem: (state, action: PayloadAction<number>) => {
      if (state.data) {
        // Step 1: Remove the item at the specified index
        state.data.faqs.splice(action.payload, 1);
        // Step 2: Re-assign the order for all remaining items to ensure the sequence is correct
        state.data.faqs.forEach((item, index) => {
          item.order = index;
        });
      }
    },
    updateFaqItem: (
      state,
      action: PayloadAction<{
        index: number;
        field: "question" | "answer";
        value: string;
      }>
    ) => {
      if (state.data) {
        const { index, field, value } = action.payload;
        state.data.faqs[index][field] = value;
      }
    },
    reorderFaqs: (state, action: PayloadAction<FaqItem[]>) => {
      if (state.data) {
        // Map over the visually reordered array and update the `order` property
        // of each item to match its new index.
        const updatedFaqs = action.payload.map((item, index) => ({
          ...item,
          order: index,
        }));
        state.data.faqs = updatedFaqs;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Data states
      .addCase(fetchFaqData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFaqData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFaqData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
        toast.error("Error fetching FAQ data!");
      })
      // Save Data states
      .addCase(saveFaqData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveFaqData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        toast.success("FAQ changes saved successfully!");
      })
      .addCase(saveFaqData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
        toast.error("Error saving FAQ changes!");
      });
  },
});

export const {
  updateMainField,
  addFaqItem,
  removeFaqItem,
  updateFaqItem,
  reorderFaqs,
} = faqSlice.actions;

export default faqSlice.reducer;
