import { ScrollView } from "react-native";

import { NewsCard } from "../../../components/modules/news/NewsCard";

/**
 * Fil d'actualités.
 */
export default function NewsIndexScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      <NewsCard title="Lancement du portail adhérents" />
      <NewsCard title="Nouvelle version de l'application" />
    </ScrollView>
  );
}
