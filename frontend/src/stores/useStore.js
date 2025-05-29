import { useContext } from "react";
import { TimelineContext } from "./TimelineContext";

// Hook pour accéder au store principal du contexte Timeline
export const useTimelineStore = () => {
  const timelineStore = useContext(TimelineContext);
  if (!timelineStore) {
    throw new Error("useTimelineStore must be used within a TimelineProvider");
  }
  return timelineStore;
};

// Hook pour accéder au sous-store des instruments
export const useInstrumentsStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.instrumentsStore;
};

export const useUsersStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.usersStore;
};

// // Hook pour accéder au sous-store expo
// export const useExpoStore = () => {
//   const timelineStore = useTimelineStore();
//   return timelineStore.instruStore; 
// };

// // Hook pour accéder au sous-store jeu (commenté, à activer si besoin)
export const useGameStore = () => {
  const timelineStore = useTimelineStore();
  return timelineStore.gameStore;  // à adapter selon ta structure
};
