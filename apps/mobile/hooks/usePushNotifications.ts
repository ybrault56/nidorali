import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { savePushToken } from "../lib/api";
import { useAuthStore } from "../store/auth";

/**
 * Enregistre le token push Expo côté API si disponible.
 */
export function usePushNotifications() {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void Notifications.getPermissionsAsync()
      .then(async (permission) => {
        if (!permission.granted) {
          return Notifications.requestPermissionsAsync();
        }

        return permission;
      })
      .then(async (permission) => {
        if (!permission.granted) {
          return;
        }

        const pushToken = await Notifications.getExpoPushTokenAsync();
        await savePushToken(pushToken.data, accessToken);
      });
  }, [accessToken]);
}
