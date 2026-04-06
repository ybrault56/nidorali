import { Text, View } from "react-native";

/**
 * Bulle de message simple.
 */
export function MessageBubble({ content, mine = false }: { content: string; mine?: boolean }) {
  return (
    <View className={`max-w-[85%] rounded-3xl px-4 py-3 ${mine ? "self-end bg-brand-500" : "bg-slate-100"}`}>
      <Text className={mine ? "text-white" : "text-slate-800"}>{content}</Text>
    </View>
  );
}
