import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import "./DraggableInstrument.scss";

const DraggableInstrument = ({ instrument }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "instrument",
      item: { id: instrument.id, },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [instrument]
  );

  return (
    <div
      className="draggable-instrument"
      ref={drag}
      style={{
        opacity: isDragging ? 0 : 1,
        zIndex: isDragging ? 1000 : "auto",
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
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default DraggableInstrument;
