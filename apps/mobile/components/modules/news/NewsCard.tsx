import { Text } from "react-native";

import { ThemedCard } from "../../themed/ThemedCard";

/**
 * Carte résumé d'actualité.
 */
export function NewsCard({ title }: { title: string }) {
  return (
    <ThemedCard>
      <Text className="text-lg font-semibold text-slate-900">{title}</Text>
      <Text className="mt-2 text-sm text-slate-500">Voir le detail complet et les medias associes.</Text>
    </ThemedCard>
  );
}
