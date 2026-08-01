// store/pushNotificationSlice/index.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [],
};

const pushNotificationSlice = createSlice({
  name: "pushNotifications",
  initialState,
  reducers: {
    addPushNotification: (state, action) => {
      const { title, message, type, notificationId, deepLink } = action.payload;
      state.queue.push({
        id: `${Date.now()}-${Math.random()}`,
        title,
        message,
        type: type || "success",
        notificationId,
        deepLink,
      });
    },
    removePushNotification: (state, action) => {
      const { id } = action.payload;
      state.queue = state.queue.filter((item) => item.id !== id);
    },
  },
});

export const { actions: pushNotificationAction, reducer: pushNotificationReducer } =
  pushNotificationSlice;
