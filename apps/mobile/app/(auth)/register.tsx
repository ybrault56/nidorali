import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { ThemedButton } from "../../components/themed/ThemedButton";
import { useAuth } from "../../hooks/useAuth";

/**
 * Écran d'inscription mobile.
 */
export default function RegisterScreen() {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center gap-4 bg-white px-6">
      <Text className="text-3xl font-semibold text-slate-900">Créer un compte</Text>
      <TextInput className="rounded-2xl border border-slate-200 px-4 py-4" onChangeText={setDisplayName} placeholder="Nom affiché" value={displayName} />
      <TextInput className="rounded-2xl border border-slate-200 px-4 py-4" onChangeText={setEmail} placeholder="Email" value={email} />
      <TextInput className="rounded-2xl border border-slate-200 px-4 py-4" onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry value={password} />
      <ThemedButton
        label="Créer le compte"
        onPress={async () => {
          await register({ display_name: displayName, email, password });
          router.replace("/(tabs)");
        }}
      />
    </View>
  );
}
