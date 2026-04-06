import { ScrollView, Text } from "react-native";

import { Avatar } from "../../components/shared/Avatar";
import { ThemedCard } from "../../components/themed/ThemedCard";

/**
 * Liste des membres.
 */
export default function MembersTab() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      {["Alice Martin", "Lucas Bernard", "Sarah Colin"].map((name) => (
        <ThemedCard className="flex-row items-center gap-4" key={name}>
          <Avatar name={name} />
          <Text className="text-base font-semibold text-slate-900">{name}</Text>
        </ThemedCard>
      ))}
    </ScrollView>
  );
}
