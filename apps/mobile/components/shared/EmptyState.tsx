import { Text, View } from "react-native";

import { ThemedButton } from "../themed/ThemedButton";

/**
 * État vide avec action claire.
 */
export function EmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction?: () => void;
  title: string;
}) {
  return (
    <View className="items-start rounded-3xl border border-slate-200 bg-white p-5">
      <Text className="text-xl font-semibold text-slate-900">{title}</Text>
      <Text className="mt-2 text-base text-slate-600">{description}</Text>
      {onAction ? <ThemedButton className="mt-4" label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
