import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import "./EndGame.scss";

const EndGame = ({ win, error, good, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    const handleClickOutside = (event) => {
      if (dialogRef.current && event.target === dialogRef.current) {
        dialogRef.current?.close();
        onClose();
      }
    };

    const dialog = dialogRef.current;
    dialog.addEventListener("click", handleClickOutside);

    return () => {
      dialog.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleClose = () => {
    dialogRef.current.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="endgame-detail"
      aria-labelledby="popup-title"
    >
      <div className="endgame-detail__container">
        <button
          onClick={handleClose}
          className="endgame-detail__close"
          aria-label="Fermer"
        ></button>
        <div>
          {win ? <p>Gagné !</p> : <p>Perdu !</p>}
          <p>Nb erreurs : {error}</p>
          <p>Nb bonnes : {good}</p>
        </div>

        {/* <div className="endgame-detail__content">
          <h2 id="popup-title" className="endgame-detail__title">
            {endgame.name}
          </h2>

          <div className="endgame-detail__image-container">
            <img
              src={endgame.image}
              alt=""
              className="endgame-detail__image"
            />
          </div>

          <p className="endgame-detail__description">{endgame.description}</p>
          <p className="endgame-detail__year">
            Année de création: {endgame.year}
          </p>
        </div> */}
      </div>
    </dialog>
  );
};

EndGame.propTypes = {
  endgame: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EndGame;
