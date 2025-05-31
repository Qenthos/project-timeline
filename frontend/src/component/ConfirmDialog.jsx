import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import "./ConfirmDialog.scss";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }

    const handleClickOutside = (event) => {
      if (dialogRef.current && event.target === dialogRef.current) {
        dialogRef.current.close();
        onCancel();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        dialogRef.current.close();
        onCancel();
      }
    };

    const dialog = dialogRef.current;
    dialog.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  const handleClose = () => {
    dialogRef.current.close();
    onCancel();
  };

  const handleConfirm = () => {
    dialogRef.current.close();
    onConfirm();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="confirm-dialog"
      aria-labelledby="confirm-title"
    >
      <div className="confirm-dialog__container">
        <h2 id="confirm-title" className="confirm-dialog__title">
          Confirmation
        </h2>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button
            onClick={handleClose}
            className="confirm-dialog__button confirm-dialog__button--cancel"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="confirm-dialog__button confirm-dialog__button--confirm"
          >
            Supprimer mon compte
          </button>
        </div>
      </div>
    </dialog>
  );
};

ConfirmDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmDialog;
