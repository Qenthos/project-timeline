import { useLocation } from "react-router";
import { observer } from "mobx-react-lite";
import Header from "../components/Header";
import { useContext } from "react";
import { InstrumentContext } from "./../stores/InstrumentContext";
import DroppableZoneTimeline from "./../components/expo/DroppableZoneTimeline";
import DraggableInstrument from "./../components/expo/DraggableInstrument";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

const TimelineComposer = observer(() => {
  const location = useLocation();
  const { timer, cards, round, isUnlimited } = location.state || {};
  console.log(timer);
  console.log(cards);
  console.log(round);
  console.log(isUnlimited);

  const { instruStore } = useContext(InstrumentContext);

  const instrumentsNotInExpo = instruStore._instrumentsStore.instruments.filter(
    (instrument) => !instruStore.existsInTimeline(instrument.id)
  );

  const instrumentExpoSlot = instruStore.instrumentsExpoBySlot;

  const isToucheDevice = window.matchMedia("(pointer: coarse)").matches;

  const backend = isToucheDevice ? TouchBackend : HTML5Backend;

  return (
    <>
      <DndProvider backend={backend}>
        <Header />
        <main className="timeline">
          <section className="timeline__section">
            <h2 className="timeline__title">
              Composer votre expo
              <span className="timeline__subtitle">
                (Déplacez les œuvres vers la zone d'exposition )
              </span>
            </h2>

            <div className="timeline__instruments">
              {instrumentsNotInExpo.map((instru) => (
                <DraggableInstrument key={instru.id} instrument={instru} />
              ))}
            </div>

            <div className="timeline__dropzones">
              {instrumentExpoSlot.map((instrument, id) => (
                <DroppableZoneTimeline
                  key={id}
                  index={id}
                  instrumentDrop={instrument}
                  onDrop={(idInstrument) =>
                    instruStore.setInstrumentAt(id, idInstrument)
                  }
                />
              ))}
            </div>

            <button
              onClick={() => instruStore.reset()}
              className="timeline__reset-button"
            >
              Recommencer l'exposition
            </button>
          </section>
        </main>
      </DndProvider>
    </>
  );
});

export default TimelineComposer;
