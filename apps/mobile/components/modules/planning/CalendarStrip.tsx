import { Text, View } from "react-native";

/**
 * Bandeau de dates compact.
 */
export function CalendarStrip() {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven"];

  return (
    <View className="flex-row justify-between rounded-3xl border border-slate-200 bg-white p-4">
      {days.map((day, index) => (
        <View className="items-center" key={day}>
          <Text className="text-xs text-slate-500">{day}</Text>
          <Text className={`mt-2 text-base font-semibold ${index === 2 ? "text-brand-600" : "text-slate-900"}`}>{index + 18}</Text>
        </View>
      ))}
    </View>
  );
}
