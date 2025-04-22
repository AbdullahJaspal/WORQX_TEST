import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoaderState } from '../types';


const initialState: LoaderState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    showLoader: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { showLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
