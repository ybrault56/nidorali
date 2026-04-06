import { Image, Text, View } from "react-native";

/**
 * Avatar circulaire avec fallback initiales.
 */
export function Avatar({ name, uri }: { name: string; uri?: string | null }) {
  if (uri) {
    return <Image className="h-12 w-12 rounded-full" source={{ uri }} />;
  }

  return (
    <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-100">
      <Text className="font-semibold text-brand-700">{name.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}
