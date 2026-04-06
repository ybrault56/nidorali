import type { ComponentProps } from "react";
import { View } from "react-native";

/**
 * Carte standard réutilisable.
 */
export function ThemedCard(props: ComponentProps<typeof View>) {
  return <View className={`rounded-3xl border border-slate-200 bg-white p-5 ${props.className ?? ""}`} {...props} />;
}
