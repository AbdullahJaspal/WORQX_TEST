import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './features/authSlice';
import toastReducer from './features/toastSlice';
import loaderReducer from './features/loaderSlice';
import eventReducer from './features/eventSlice';
import notificationReducer from './features/notificationSlice';
import networkReducer from './features/networkSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  loader: loaderReducer,
  event: eventReducer,
  notifications: notificationReducer,
  network: networkReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
