import { View } from "react-native";

import { EmptyState } from "../components/shared/EmptyState";

/**
 * Fallback route non trouvée.
 */
export default function NotFoundScreen() {
  return (
    <View className="flex-1 bg-white p-6">
      <EmptyState actionLabel="Retourner à l'accueil" description="La route demandée n'existe pas dans cette build Expo." title="Écran introuvable" />
    </View>
  );
}
