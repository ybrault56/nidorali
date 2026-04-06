import type { ReactNode } from "react";

import { View } from "react-native";

import { EmptyState } from "./EmptyState";

/**
 * Boundary minimaliste pour l'application mobile.
 */
export function ErrorBoundary({ children, hasError }: { children: ReactNode; hasError: boolean }) {
  if (hasError) {
    return (
      <View className="flex-1 bg-white p-6">
        <EmptyState
          actionLabel="Réessayer"
          description="Une erreur de rendu est survenue sur cet écran."
          title="Impossible d'afficher le contenu"
        />
      </View>
    );
  }

  return <>{children}</>;
}
