import "../lib/notifications";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { useAuthStore } from "../store/auth";
import { useTenantStore } from "../store/tenant";
import { bootstrapTenant } from "../hooks/useTenant";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { EmptyState } from "../components/shared/EmptyState";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

const queryClient = new QueryClient();

function RootNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isBootstrapping = useTenantStore((state) => state.isBootstrapping);
  const segments = useSegments();
  const [tenantError, setTenantError] = useState(false);

  usePushNotifications();

  useEffect(() => {
    void bootstrapTenant().catch(() => {
      setTenantError(true);
      useTenantStore.getState().setBootstrapping(false);
    });
  }, []);

  if (isBootstrapping) {
    return <LoadingSpinner />;
  }

  const inAuthGroup = segments[0] === "(auth)";
  if (!accessToken && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (accessToken && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }
  if (tenantError) {
    return (
      <View className="flex-1 bg-white p-6">
        <EmptyState
          actionLabel="Relancer l'application"
          description="La configuration du tenant n'a pas pu être chargée localement."
          title="Tenant introuvable"
        />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * Layout racine Expo Router.
 */
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <RootNavigator />
    </QueryClientProvider>
  );
}
