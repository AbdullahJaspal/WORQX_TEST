import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from '../types';



const initialState: NotificationState = {
  notifications: [],
  badgeCount: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.badgeCount = action.payload.filter(n => !n.read).length;
    },
    setBadge: (state, action: PayloadAction<number>) => {
      state.badgeCount = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        n => n.id === action.payload,
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.badgeCount -= 1;
      }
    },
    markAsUnread: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        n => n.id === action.payload,
      );
      if (notification && notification.read) {
        notification.read = false;
        state.badgeCount += 1;
      }
    },
    markAllAsRead: state => {
      state.notifications.forEach(n => (n.read = true));
      state.badgeCount = 0;
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  setBadge,
} = notificationSlice.actions;
export default notificationSlice.reducer;
