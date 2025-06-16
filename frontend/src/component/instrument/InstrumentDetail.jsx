import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import "./InstrumentDetail.scss";

const InstrumentDetail = observer(({ instrument, onClose }) => {
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
      className="instrument-detail"
      aria-labelledby="popup-title"
    >
      <div className="instrument-detail__container">
        <button
          onClick={handleClose}
          className="instrument-detail__close"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="instrument-detail__icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="instrument-detail__content">
          <h2 id="popup-title" className="instrument-detail__title">
            {instrument.name}
          </h2>

          <div className="instrument-detail__image-container">
            <img
              src={instrument.image}
              alt=""
              className="instrument-detail__image"
            />
          </div>

          <p className="instrument-detail__description">{instrument.description}</p>
          <p className="instrument-detail__year">
            Année de création: {instrument.created}
          </p>
        </div>
      </div>
    </dialog>
  );
});

InstrumentDetail.propTypes = {
  instrument: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default InstrumentDetail;
