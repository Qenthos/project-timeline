import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router";
// import "./Instrument.scss";

const Instrument = ({instrumentDrop, modeGame, status}) => {

    const [mode, setModeGame] = useState("");

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
  
    const borderColor =
      status === true
        ? "#4caf50"
        : status === false
        ? "#f44336"
        : "#9e9e9e";
    const backgroundColor =
      status === true
        ? "rgba(76, 175, 80, 0.2)"
        : status === false
        ? "rgba(244, 67, 54, 0.2)"
        : "rgba(158, 158, 158, 0.1)";
  
        
  return (
    <div
    className={`droppable-zone ${
      instrumentDrop ? "" : "droppable-zone--hidden"
    } ${instrumentDrop ? "droppable-zone--disabled" : ""}
    }`}

  >
    {instrumentDrop ? (
      <>
        <img src={instrumentDrop.image} alt={instrumentDrop.title} className="droppable-zone__image" />
        <p style={{borderColor, backgroundColor}}>{mode}</p>
      </>
    ) : null}
  </div>
  );
};

Instrument.propTypes = {
    instrumentDrop: PropTypes.object,
    modeGame: PropTypes.string.isRequired,
    status: PropTypes.oneOf([true, false, null]),
  };

export default Instrument;
