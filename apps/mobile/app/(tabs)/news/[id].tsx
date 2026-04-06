import { ScrollView } from "react-native";

import { NewsContent } from "../../../components/modules/news/NewsContent";

/**
 * Article complet.
 */
export default function NewsDetailScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 20 }}>
      <NewsContent title="Lancement du portail adhérents" />
    </ScrollView>
  );
}
