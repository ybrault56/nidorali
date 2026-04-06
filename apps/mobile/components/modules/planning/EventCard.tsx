import { Text } from "react-native";

import { ThemedCard } from "../../themed/ThemedCard";

/**
 * Carte événement du planning.
 */
export function EventCard({ title }: { title: string }) {
  return (
    <ThemedCard>
      <Text className="text-lg font-semibold text-slate-900">{title}</Text>
      <Text className="mt-1 text-sm text-slate-500">19 mars • 18:30 • Salle polyvalente</Text>
    </ThemedCard>
  );
}
