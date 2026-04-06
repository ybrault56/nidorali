import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { ThemedButton } from "../../components/themed/ThemedButton";
import { useAuth } from "../../hooks/useAuth";

/**
 * Écran de connexion mobile.
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <View className="flex-1 justify-center gap-4 bg-white px-6">
      <Text className="text-3xl font-semibold text-slate-900">Connexion</Text>
      <TextInput className="rounded-2xl border border-slate-200 px-4 py-4" onChangeText={setEmail} placeholder="Email" value={email} />
      <TextInput className="rounded-2xl border border-slate-200 px-4 py-4" onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry value={password} />
      {error ? <Text className="text-sm text-rose-600">{error}</Text> : null}
      <ThemedButton
        label="Se connecter"
        onPress={async () => {
          try {
            await login({ email, password });
            router.replace("/(tabs)");
          } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : "Connexion impossible");
          }
        }}
      />
      <ThemedButton className="bg-slate-100" label="Créer un compte" onPress={() => router.push("/(auth)/register")} />
    </View>
  );
}
