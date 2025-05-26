import DroppableZoneTimeline from "./DroppableZoneTimeline";
import "./DroppableZoneTimeline.scss";
import React from "react";
import Instrument from "./../Instrument";

const TimelineDynamic = ({ instrumentExpoSlot, modeGame, instruStore }) => {
  return (
    <div className="timeline-dynamic" style={{ display: "flex" }}>
      {instrumentExpoSlot.map((instrument, zoneIndex) => {
        const id = instrument?.id;
        return (
          <React.Fragment key={`zone-${zoneIndex}`}>
            <DroppableZoneTimeline
              index={zoneIndex}
              onDrop={(idInstrument) => {
                instruStore.setInstrumentsSorted(
                  zoneIndex,
                  idInstrument,
                  modeGame
                );              
              }
            }
            />
            <Instrument
              instrumentDrop={instrument}
              key={`carte-${zoneIndex}`}
              draggable
              modeGame={modeGame}
              status={instruStore.highlightStatus?.[id] ?? null}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TimelineDynamic;
