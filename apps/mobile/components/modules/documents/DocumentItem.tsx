import { Text } from "react-native";

import { ThemedCard } from "../../themed/ThemedCard";

/**
 * Ligne document.
 */
export function DocumentItem({ name }: { name: string }) {
  return (
    <ThemedCard>
      <Text className="text-base font-semibold text-slate-900">{name}</Text>
      <Text className="mt-1 text-sm text-slate-500">PDF • 420 KB</Text>
    </ThemedCard>
  );
}
