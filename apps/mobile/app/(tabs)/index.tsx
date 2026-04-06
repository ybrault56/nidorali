import { ScrollView, Text, View } from "react-native";

import { TenantHeader } from "../../components/themed/TenantHeader";
import { ThemedCard } from "../../components/themed/ThemedCard";
import { useTenant } from "../../hooks/useTenant";

/**
 * Accueil du dashboard mobile.
 */
export default function HomeTab() {
  const tenant = useTenant();

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <TenantHeader />
      <ThemedCard>
        <Text className="text-xl font-semibold text-slate-900">{tenant?.app_name ?? "Nidorali"}</Text>
        <Text className="mt-2 text-base text-slate-600">Application mobile mutualisée, configurée à partir du dashboard SaaS.</Text>
      </ThemedCard>
      <ThemedCard>
        <Text className="text-sm text-slate-500">Modules actifs</Text>
        <View className="mt-3 gap-2">
          {Object.entries(tenant?.config ?? {}).map(([key, value]) =>
            typeof value === "boolean" && value ? (
              <Text className="text-base text-slate-700" key={key}>
                • {key}
              </Text>
            ) : null,
          )}
        </View>
      </ThemedCard>
    </ScrollView>
  );
}
