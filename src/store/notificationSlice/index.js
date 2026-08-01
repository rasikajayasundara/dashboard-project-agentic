import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  recentItems: [],
  unreadCount: 0,
  isLoading: false,
  isLoadingRecent: false,
  isMarkingRead: false,
  error: "",
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    getNotificationsStart(state) {
      state.isLoading = true;
      state.error = "";
    },
    getNotificationsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload;
    },
    getNotificationsFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getRecentNotificationsStart(state) {
      state.isLoadingRecent = true;
      state.error = "";
    },
    getRecentNotificationsSuccess(state, action) {
      state.isLoadingRecent = false;
      state.recentItems = action.payload;
      state.unreadCount = action.payload.filter((n) => n.status === 0).length;
    },
    getRecentNotificationsFailed(state, action) {
      state.isLoadingRecent = false;
      state.error = action.payload;
    },
    markNotificationReadStart(state) {
      state.isMarkingRead = true;
      state.error = "";
    },
    markNotificationReadSuccess(state, action) {
      state.isMarkingRead = false;
      const updated = action.payload;

      const itemsIdx = state.items.findIndex((n) => n.id === updated.id);
      const recentIdx = state.recentItems.findIndex((n) => n.id === updated.id);

      const wasUnread =
        (itemsIdx !== -1 && state.items[itemsIdx].status === 0) ||
        (recentIdx !== -1 && state.recentItems[recentIdx].status === 0);

      if (itemsIdx !== -1) {
        state.items[itemsIdx] = { ...state.items[itemsIdx], ...updated };
      }
      if (recentIdx !== -1) {
        state.recentItems[recentIdx] = { ...state.recentItems[recentIdx], ...updated };
      }

      if (wasUnread && updated.status === 1 && state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    markNotificationReadFailed(state, action) {
      state.isMarkingRead = false;
      state.error = action.payload;
    },
  },
});

export const { actions: notificationAction, reducer: notificationReducer } = notificationSlice;
