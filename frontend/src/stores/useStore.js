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
export const useInstrumentStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.instrumentStore;
};


//sous-store des utilisateurs
export const useUserStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.userStore;
};

// sous-store des parties de jeux
export const useGameStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.gameStore;  
};
