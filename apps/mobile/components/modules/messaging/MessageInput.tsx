import { useState } from "react";
import { TextInput, View } from "react-native";

import { ThemedButton } from "../../themed/ThemedButton";

/**
 * Saisie de message inline.
 */
export function MessageInput() {
  const [value, setValue] = useState("");

  return (
    <View className="flex-row items-center gap-3">
      <TextInput
        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900"
        onChangeText={setValue}
        placeholder="Écrire un message"
        value={value}
      />
      <ThemedButton label="Envoyer" onPress={() => setValue("")} />
    </View>
  );
}
