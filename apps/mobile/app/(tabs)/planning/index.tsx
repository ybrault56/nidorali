import { ScrollView } from "react-native";

import { CalendarStrip } from "../../../components/modules/planning/CalendarStrip";
import { EventCard } from "../../../components/modules/planning/EventCard";

/**
 * Vue planning.
 */
export default function PlanningIndexScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ gap: 12, padding: 20 }}>
      <CalendarStrip />
      <EventCard title="Réunion du conseil" />
      <EventCard title="Permanence hebdomadaire" />
    </ScrollView>
  );
}
