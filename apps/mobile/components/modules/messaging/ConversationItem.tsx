import { Text } from "react-native";

import { ThemedCard } from "../../themed/ThemedCard";

/**
 * Élément de liste de conversation.
 */
export function ConversationItem({ title }: { title: string }) {
  return (
    <ThemedCard>
      <Text className="text-lg font-semibold text-slate-900">{title}</Text>
      <Text className="mt-1 text-sm text-slate-500">Ouvrir le fil et répondre.</Text>
    </ThemedCard>
  );
}
