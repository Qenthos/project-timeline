import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import "./Instrument.scss";

const Instrument = ({ instrumentDrop, modeGame, status }) => {
  const [mode, setModeGame] = useState("");
  const [flipped, setFlipped] = useState(false);

  /**
   * Recup data depending on gamemode
   */
  useEffect(() => {
    if (!instrumentDrop) return;

    if (modeGame === "annee") {
      setModeGame(instrumentDrop.year);
    } else if (modeGame === "taille") {
      setModeGame(instrumentDrop.height);
    } else {
      setModeGame(instrumentDrop.weight);
    }
  }, [modeGame, instrumentDrop]);

  //Color style
  const borderColor =
    status === true ? "#4caf50" : status === false ? "#f44336" : "#9e9e9e";
  const backgroundColor =
    status === true
      ? "rgba(76, 175, 80, 0.2)"
      : status === false
      ? "rgba(244, 67, 54, 0.2)"
      : "rgba(158, 158, 158, 0.1)";

  return (
    <motion.div
      onClick={() => {
        if (instrumentDrop) setFlipped(!flipped);
      }}
      className={`card ${!instrumentDrop ? "card--disabled" : ""}`}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {instrumentDrop && (
        <ul className="card__face card__face--front">
          <li
            className={`card__droppable-zone ${
              instrumentDrop ? "" : "card__droppable-zone--hidden"
            } ${instrumentDrop ? "card__droppable-zone--disabled" : ""}`}
          >
            <img
              src={instrumentDrop.image}
              alt={instrumentDrop.name}
              className="card__image"
              draggable="false"
            />
            <p
              className="card__data-mode"
              style={{ borderColor, backgroundColor }}
            >
              {mode}
            </p>
          </li>
        </ul>
      )}
      {instrumentDrop && (
        <ul
          className="card__face card__face--back"
          style={{
            backgroundImage: `url(${instrumentDrop.image})`,
          }}
        >
          <li className="card__info">
            <p>{instrumentDrop.name}</p>
          </li>
          <li className="card__info">
            <p>{instrumentDrop.description}</p>
          </li>
          <li className="card__info">
            <p>Année de création : {mode}</p>
          </li>
        </ul>
      )}
    </motion.div>
  );
};

Instrument.propTypes = {
  instrumentDrop: PropTypes.object,
  modeGame: PropTypes.string.isRequired,
  status: PropTypes.oneOf([true, false, null]),
};

export default Instrument;
