import { ScrollView, Text } from "react-native";

import { Avatar } from "../../components/shared/Avatar";
import { ThemedCard } from "../../components/themed/ThemedCard";
import { useAuth } from "../../hooks/useAuth";

/**
 * Profil utilisateur.
 */
export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 16, padding: 20 }}>
      <ThemedCard className="items-center gap-4">
        <Avatar name={user?.display_name ?? "Utilisateur"} />
        <Text className="text-xl font-semibold text-slate-900">{user?.display_name ?? "Utilisateur"}</Text>
        <Text className="text-base text-slate-600">{user?.email}</Text>
      </ThemedCard>
    </ScrollView>
  );
}
