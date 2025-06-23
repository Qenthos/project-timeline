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
      setModeGame(instrumentDrop.created);
    } else if (modeGame === "taille") {
      setModeGame(instrumentDrop.height);
    } else {
      setModeGame(instrumentDrop.weight);
    }
  }, [modeGame, instrumentDrop]);

  const borderColor =
    status === true
      ? "#4caf50"
      : status === false
      ? "#f44336"
      : status === "default"
      ? "#bdbdbd"
      : "#9e9e9e";

  const backgroundColor =
    status === true
      ? "rgba(76, 175, 80, 0.2)"
      : status === false
      ? "rgba(244, 67, 54, 0.2)"
      : status === "default"
      ? "rgba(200, 200, 200, 0.3)"
      : "rgba(158, 158, 158, 0.1)";

  const modeLabels = {
    annee: "Année de création",
    taille: "Taille (cm)",
    poids: "Poids (kg)",
  };

  return (
    <motion.div
      onClick={() => {
        if (instrumentDrop) setFlipped(!flipped);
      }}
      className={`card ${!instrumentDrop ? "card--disabled" : ""}`}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.4 }}
      title="Cliquez sur la carte pour voir la description associée."
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
        <ul className="card__face card__face--back">
          <li className="card__info">
            <p className="card__text">{instrumentDrop.name}</p>
          </li>
          <li className="card__info">
            <p className="card__text">{instrumentDrop.description}</p>
          </li>
          <li className="card__info">
            <p className="card__text">
              {modeLabels[modeGame] || "Valeur"} : {mode}
            </p>
          </li>
        </ul>
      )}
    </motion.div>
  );
};

Instrument.propTypes = {
  instrumentDrop: PropTypes.object,
  modeGame: PropTypes.string.isRequired,
  status: PropTypes.oneOf([true, false, null, "default"]),
};

export default Instrument;
