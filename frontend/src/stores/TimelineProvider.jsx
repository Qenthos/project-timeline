import InstrumentStore from "./instrument/InstrumentStore";
import Game from "./game/Game";
import GameStore from "./game/GameStore";
import AuthStore from "./user/AuthStore";
import LeaderboardStore from "./user/LeaderboardStore";
import { TimelineContext } from "./TimelineContext";

const instrumentStore = new InstrumentStore();

const game = new Game();
const authStore = new AuthStore();
const leaderboardStore = new LeaderboardStore();

const gameStore = new GameStore(game, authStore, instrumentStore);

const timeStore = {   
  instrumentStore,
  gameStore,
  authStore,
  leaderboardStore
};


export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
