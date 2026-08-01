import { useEffect } from "react";

import { Provider } from "react-redux";

import socket from "./utils/socket";
import RouteNavigation from "./routes";
import store from "./store/store";
import { BrowserRouter } from "react-router-dom";
import { useAuthBootstrap, PermissionGuard } from "./hooks/useLoginSync";
import Snackbar from "./components/AppSnackbar";
import PushNotificationToast from "./components/PushNotificationToast";
import { pushNotificationAction } from "./store/pushNotificationSlice";

function AppContent() {
  // Attempts to restore the session from the httpOnly refresh-token cookie
  // before any route renders, so no page mounts with stale/empty auth state.
  const isBootstrapping = useAuthBootstrap();

  if (isBootstrapping) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <img src="/assets/images/loading-spinner.gif" alt="Loading" width={100} />
      </div>
    );
  }

  return (
    <>
      <PermissionGuard />
      <Snackbar />
      <PushNotificationToast />
      <RouteNavigation />
    </>
  );
}

// Mirrors the old notificationToast switch (src/utils/notification.js) that
// mapped backend notification type codes to toast variants.
const mapType = (code) => {
  switch (code) {
    case 21:
      return "success";
    case 2:
      return "info";
    case 3:
      return "warning";
    case 22:
      return "error";
    default:
      return "success";
  }
};

function App() {
  // ----------------------------------------------------
  // 3️⃣ Socket Notifications (Runs ONCE)
  // ----------------------------------------------------
  useEffect(() => {
    socket.on("notification", (data) => {
      store.dispatch(
        pushNotificationAction.addPushNotification({
          title: data.title,
          message: data.message,
          type: mapType(data.type),
          notificationId: data.id,
          deepLink: data.dataJson?.deepLink,
        })
      );
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
