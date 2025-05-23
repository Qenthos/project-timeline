import { useDrop } from "react-dnd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DroppableZoneTimeline.scss";

const DroppableZoneTimeline = ({ index, instrumentDrop, gamemode, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "instrument",
    drop: (item) => {
      onDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const [modeGame, setModeGame] = useState("");

  useEffect(() => {
    if (!instrumentDrop) return;  

    if (gamemode === "annee") {
      setModeGame(instrumentDrop.year);
    } else if (gamemode === "taille") {
      setModeGame(instrumentDrop.height);
    } else {
      setModeGame(instrumentDrop.weight);
    }
  }, [gamemode, instrumentDrop]);

  return (
    <div
      className={`droppable-zone ${
        instrumentDrop ? "droppable-zone--disabled" : ""
      } ${
        isOver ? "droppable-zone--over" : canDrop ? "droppable-zone--ready" : ""
      }`}
      ref={drop}
    >
      {instrumentDrop && (
        <>
          <img
            src={instrumentDrop.image}
            alt={instrumentDrop.title}
            className="droppable-zone__image"
          />
          <p>{modeGame}</p>
        </>
      )}

      <p className="droppable-zone__index">{index + 1}</p>
    </div>
  );
};

DroppableZoneTimeline.propTypes = {
  index: PropTypes.number.isRequired,
  instrumentDrop: PropTypes.object,
  gamemode: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default DroppableZoneTimeline;
