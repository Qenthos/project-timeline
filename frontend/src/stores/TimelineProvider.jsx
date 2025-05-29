import InstrumentsStore from "./instruments/InstrumentsStore";
import TimelineStore from "./timeline/timelineStore";
import GameStore from "./game/GameStore";
import UsersStore from "./user/usersStore";
import { TimelineContext } from "./TimelineContext";

const instrumentsStore = new InstrumentsStore();
const instruStore = new TimelineStore(instrumentsStore);
const gameStore = new GameStore();
const usersStore = new UsersStore();

const timeStore = {
  instrumentsStore,
  instruStore,
  gameStore,
  usersStore
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
