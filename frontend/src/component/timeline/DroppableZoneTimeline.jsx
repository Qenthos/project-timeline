import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import "./DroppableZoneTimeline.scss";

const DroppableZoneTimeline = ({ index, instrumentDrop, onDrop }) => {
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
        <img
          src={instrumentDrop.image}
          alt={instrumentDrop.title}
          className="droppable-zone__image"
        />
      )}

      <p className="droppable-zone__index">{index + 1}</p>
    </div>
  );
};

DroppableZoneTimeline.propTypes = {
  index: PropTypes.number.isRequired,
  instrumentDrop: PropTypes.object,
  onDrop: PropTypes.func.isRequired,
};

export default DroppableZoneTimeline;
