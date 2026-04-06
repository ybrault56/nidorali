import { Image, Text, View } from "react-native";

import { useTenant } from "../../hooks/useTenant";
import { useTheme } from "../../hooks/useTheme";

/**
 * Header commun affichant le logo et le nom du tenant.
 */
export function TenantHeader() {
  const tenant = useTenant();
  const theme = useTheme();

  return (
    <View className="flex-row items-center gap-3 rounded-3xl px-4 py-4" style={{ backgroundColor: theme.primary }}>
      {tenant?.config.logo_url ? (
        <Image className="h-12 w-12 rounded-2xl" source={{ uri: tenant.config.logo_url }} />
      ) : (
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Text className="font-semibold text-white">{tenant?.app_name.slice(0, 2).toUpperCase() ?? "NI"}</Text>
        </View>
      )}
      <View>
        <Text className="text-xs text-white/80">Tenant</Text>
        <Text className="text-lg font-semibold text-white">{tenant?.app_name ?? "Nidorali"}</Text>
      </View>
    </View>
  );
}
