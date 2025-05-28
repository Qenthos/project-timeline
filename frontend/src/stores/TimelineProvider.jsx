import InstrumentsStore from "./instruments/InstrumentsStore";
import TimelineStore from "./timeline/timelineStore";
import GameStore from "./game/GameStore";
import { TimelineContext } from "./TimelineContext";

const instrumentsStore = new InstrumentsStore();
const instruStore = new TimelineStore(instrumentsStore);
const gameStore = new GameStore();

const timeStore = {
  instrumentsStore,
  instruStore,
  gameStore
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
