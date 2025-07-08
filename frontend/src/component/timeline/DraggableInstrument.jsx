import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import "./DraggableInstrument.scss";

const DraggableInstrument = ({ instrument, isPaused }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "instrument",
      item: { id: instrument.id },
      canDrag: !isPaused, 
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [instrument, isPaused]
  );

  return (
    <div
      className="draggable-instrument"
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : "auto",
        pointerEvents: isPaused ? "none" : "auto", 
      }}
    >
      <img
        src={`/media/instru-cards/${instrument.image}`}
        alt={instrument.name}
        draggable="false"
        className="draggable-instrument__image"
      />
      <h2 className="draggable-instrument__name">{instrument.name}</h2>
    </div>
  );
};

DraggableInstrument.propTypes = {
  instrument: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isPaused: PropTypes.bool, // Ajouté ici
};

export default DraggableInstrument;
