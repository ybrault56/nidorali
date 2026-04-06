import { ScrollView } from "react-native";

import { DocumentItem } from "../../components/modules/documents/DocumentItem";

/**
 * Bibliothèque documents.
 */
export default function DocumentsTab() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      <DocumentItem name="Règlement intérieur" />
      <DocumentItem name="Compte-rendu AG" />
    </ScrollView>
  );
}
