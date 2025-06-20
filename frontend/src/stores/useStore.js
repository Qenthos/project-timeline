import { useContext } from "react";
import { TimelineContext } from "./TimelineContext";

// store principal du contexte Timeline
export const useTimelineStore = () => {
  const timelineStore = useContext(TimelineContext);
  if (!timelineStore) {
    throw new Error("useTimelineStore must be used within a TimelineProvider");
  }
  return timelineStore;
};

// sous-store des instruments
export const useInstrumentsStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.instrumentsStore;
};


//sous-store des utilisateurs
export const useUsersStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.usersStore;
};

// sous-store des parties de jeux
export const useGameStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.gameStore;  
};
