import { Text, View } from "react-native";

/**
 * Contenu d'article détaillé.
 */
export function NewsContent({ title }: { title: string }) {
  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-5">
      <Text className="text-2xl font-semibold text-slate-900">{title}</Text>
      <Text className="mt-3 text-base leading-6 text-slate-600">
        Nidorali permet de déployer une même base mobile sous plusieurs identités visuelles et fonctionnelles.
      </Text>
    </View>
  );
}
