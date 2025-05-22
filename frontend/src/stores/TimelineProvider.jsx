import InstrumentsStore from "./instruments/InstrumentsStore";
import { TimelineContext } from "./TimelineContext";
import TimelineStore from "./timeline/timelineStore";

const instrumentsStore = new InstrumentsStore();
const instruStore = new TimelineStore(instrumentsStore);

const timeStore = {
  instrumentsStore,
  instruStore,
};

export const TimelineProvider = ({ children }) => {
  return <TimelineContext value={timeStore}>{children}</TimelineContext>;
};
