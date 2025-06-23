import InstrumentStore from "./instrument/InstrumentStore";
import TimelineStore from "./timeline/TimelineStore";
import Game from "./game/Game";
import GameStore from "./game/GameStore";
import UserStore from "./user/UserStore";
import { TimelineContext } from "./TimelineContext";

const instrumentStore = new InstrumentStore();
const instruStore = new TimelineStore(instrumentStore);

const games = new Game();
const userStore = new UserStore();
const gameStore = new GameStore(games, userStore, instruStore);

const timeStore = {
  instrumentStore,
  instruStore,
  gameStore,
  userStore
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
