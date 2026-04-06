import { ActivityIndicator, View } from "react-native";

/**
 * Spinner de chargement simple.
 */
export function LoadingSpinner() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator color="#0F62FE" size="large" />
    </View>
  );
}
