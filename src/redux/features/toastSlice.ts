import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastState } from '../types';


const initialState: ToastState = {
  toastStack: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
      }>,
    ) => {
      const newToast = {
        id: Date.now().toString(),
        message: action.payload.message,
        visible: true,
        type: action.payload.type,
      };
      state.toastStack.push(newToast);
    },
    hideToast: (state, action: PayloadAction<string>) => {
      state.toastStack = state.toastStack.filter(
        toast => toast.id !== action.payload,
      );
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
