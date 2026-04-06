import { ScrollView, TextInput } from "react-native";

import { ThemedButton } from "../../components/themed/ThemedButton";

/**
 * Édition profil.
 */
export default function ProfileEditScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      <TextInput className="rounded-2xl border border-slate-200 bg-white px-4 py-4" placeholder="Nom affiché" />
      <TextInput className="rounded-2xl border border-slate-200 bg-white px-4 py-4" placeholder="Avatar URL" />
      <ThemedButton label="Enregistrer" />
    </ScrollView>
  );
}
