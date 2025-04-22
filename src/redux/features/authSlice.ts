import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserInfoObject } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userInfo: null,
  myBusinesses: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string | null }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.userInfo = null;
    },
    saveInfo: (state, action: PayloadAction<{ userInfo: UserInfoObject | null }>) => {
      state.userInfo = action.payload.userInfo;
    },
    saveBusiness: (
      state,
      action: PayloadAction<{ businesses: Array<object> | null }>,
    ) => {
      state.myBusinesses = action.payload.businesses || [];
    },
  },
});

export const { login, logout, saveInfo, saveBusiness } = authSlice.actions;
export default authSlice.reducer;
