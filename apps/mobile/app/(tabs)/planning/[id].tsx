import { ScrollView } from "react-native";

import { AttendButton } from "../../../components/modules/planning/AttendButton";
import { EventCard } from "../../../components/modules/planning/EventCard";

/**
 * Détail d'événement.
 */
export default function PlanningDetailScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 16, padding: 20 }}>
      <EventCard title="Assemblée générale" />
      <AttendButton />
    </ScrollView>
  );
}
