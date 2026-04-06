import { ScrollView } from "react-native";

import { ConversationItem } from "../../../components/modules/messaging/ConversationItem";

/**
 * Liste des conversations.
 */
export default function MessagingIndexScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      <ConversationItem title="Bureau - annonces" />
      <ConversationItem title="Commission communication" />
    </ScrollView>
  );
}
