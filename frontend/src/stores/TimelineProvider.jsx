import InstrumentsStore from "./instruments/InstrumentsStore";
import TimelineStore from "./timeline/timelineStore";
import Games from "./game/Games";
import GameStore from "./game/GameStore";
import UsersStore from "./user/usersStore";
import { TimelineContext } from "./TimelineContext";

const instrumentsStore = new InstrumentsStore();
const instruStore = new TimelineStore(instrumentsStore);

const games = new Games();
const usersStore = new UsersStore();
const gameStore = new GameStore(games, usersStore, instruStore);

const timeStore = {
  instrumentsStore,
  instruStore,
  gameStore,
  usersStore
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
