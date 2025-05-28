import InstrumentsStore from "./instruments/InstrumentsStore";
import TimelineStore from "./timeline/TimelineStore";
import { TimelineContext } from "./TimelineContext";

const instrumentsStore = new InstrumentsStore();
const instruStore = new TimelineStore(instrumentsStore);

const timeStore = {
  instrumentsStore,
  instruStore,
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
