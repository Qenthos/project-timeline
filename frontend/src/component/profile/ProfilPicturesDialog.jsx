import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import "./ProfilPicturesDialog.scss";

const ProfilPicturesDialog = ({ onSelected, onCancel }) => {
  const dialogRef = useRef(null);

  const imageNames = ["pdp-deux.png", "pdp-trois.png"];

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

  const handleImageSelect = (name) => {
    dialogRef.current.close();
    const imagePath = `/media/profile-pictures/${name}`;
    onSelected(imagePath);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="profil-dialog"
      aria-labelledby="profil-dialog-title"
    >
      <div className="profil-dialog__container">
        <h2 id="profil-dialog-title" className="profil-dialog__title">
          Sélection photo de profil
        </h2>
        <ul className="profil-dialog__gallery" role="list">
          {imageNames.map((name, index) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => handleImageSelect(name)}
                className="profil-dialog__image-btn"
                aria-label={`Sélectionner l’image ${index + 1}`}
              >
                <img
                  src={`/media/profile-pictures/${name}`}
                  alt={`Image ${index + 1}`}
                  className="profil-dialog__image"
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="profil-dialog__actions">
          <button
            onClick={handleClose}
            className="profil-dialog__button profil-dialog__button--cancel"
          >
            Annuler
          </button>
        </div>
      </div>
    </dialog>
  );
};

ProfilPicturesDialog.propTypes = {
  onSelected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProfilPicturesDialog;
