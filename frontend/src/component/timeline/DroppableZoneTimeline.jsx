import { useDrop } from "react-dnd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./DroppableZoneTimeline.scss";

const DroppableZoneTimeline = ({ index, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "instrument",
    drop: (item) => {
      onDrop(index, item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      className="droppable-zone"
      ref={drop}
      style={{
        border: isOver ? "3px dashed green" : "3px dashed gray",
      }}
    ></div>
  );
};

DroppableZoneTimeline.propTypes = {
  index: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default DroppableZoneTimeline;
