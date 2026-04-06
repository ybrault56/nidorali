import { ScrollView, Text, View } from "react-native";

import { EmptyState } from "../../components/shared/EmptyState";
import { ThemedCard } from "../../components/themed/ThemedCard";
import { useTenant } from "../../hooks/useTenant";

/**
 * Écran plus : formulaires, carte, profil.
 */
export default function MoreTab() {
  const tenant = useTenant();

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 16, padding: 20 }}>
      {tenant?.config.module_forms ? (
        <ThemedCard>
          <Text className="text-lg font-semibold text-slate-900">Formulaires</Text>
          <Text className="mt-2 text-base text-slate-600">Accès aux formulaires configurés depuis le dashboard.</Text>
        </ThemedCard>
      ) : (
        <EmptyState actionLabel="Ouvrir le profil" description="Aucun formulaire actif pour ce tenant." title="Pas de formulaires" />
      )}
      <ThemedCard>
        <Text className="text-lg font-semibold text-slate-900">Carte</Text>
        <Text className="mt-2 text-base text-slate-600">
          {tenant?.config.module_map ? "Module carte activé. Intégrez vos points d'intérêt métier." : "Module carte inactif pour ce tenant."}
        </Text>
      </ThemedCard>
      <View className="rounded-3xl border border-slate-200 bg-white p-5">
        <Text className="text-lg font-semibold text-slate-900">Profil</Text>
        <Text className="mt-2 text-base text-slate-600">Retrouvez vos informations personnelles et vos préférences push.</Text>
      </View>
    </ScrollView>
  );
}
