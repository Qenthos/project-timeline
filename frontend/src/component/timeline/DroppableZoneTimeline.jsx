import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import "./DroppableZoneTimeline.scss";

const DroppableZoneTimeline = ({ index, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "instrument",
    drop: (item) => onDrop(index, item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const classNames = ["droppable-zone"];
  if (isOver) classNames.push("droppable-zone--active");
  if (canDrop && isOver) classNames.push("droppable-zone--valid");

  return (
    <div
      className={classNames.join(" ")}
      ref={drop}
      role="region"
      aria-label={`Zone de drop numéro ${index + 1}`}
    />
  );
};

DroppableZoneTimeline.propTypes = {
  index: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default DroppableZoneTimeline;
