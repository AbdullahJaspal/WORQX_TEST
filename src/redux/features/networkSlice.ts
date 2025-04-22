import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkState } from '../types';


const initialState: NetworkState = {
  isConnected: true,
  showNetworkError: false,
};

const networkSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    checkConnection: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setShowNetworkError: (state, action: PayloadAction<boolean>) => {
      state.showNetworkError = action.payload;
    },
  },
});

export const { checkConnection, setShowNetworkError } = networkSlice.actions;
export default networkSlice.reducer;
