import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isNavigationLoading: boolean;
  isRegionTabLoading: boolean;
}

const initialState: LoadingState = {
  isNavigationLoading: false,
  isRegionTabLoading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setNavigationLoading: (state, action: PayloadAction<boolean>) => {
      state.isNavigationLoading = action.payload;
    },
    setRegionTabLoading: (state, action: PayloadAction<boolean>) => {
      state.isRegionTabLoading = action.payload;
    },
  },
});

export const { setNavigationLoading, setRegionTabLoading } = loadingSlice.actions;
export default loadingSlice.reducer;