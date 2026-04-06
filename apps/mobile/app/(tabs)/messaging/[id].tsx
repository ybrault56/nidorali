import { ScrollView, View } from "react-native";

import { MessageBubble } from "../../../components/modules/messaging/MessageBubble";
import { MessageInput } from "../../../components/modules/messaging/MessageInput";

/**
 * Fil de conversation.
 */
export default function MessagingThreadScreen() {
  return (
    <View className="flex-1 bg-slate-50 px-4 py-6">
      <ScrollView className="flex-1" contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        <MessageBubble content="Bonjour à tous, la réunion commence à 18h." />
        <MessageBubble content="Parfait, je serai présent." mine />
      </ScrollView>
      <MessageInput />
    </View>
  );
}
