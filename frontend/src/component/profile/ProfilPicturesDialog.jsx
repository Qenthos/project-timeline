import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import "./ProfilPicturesDialog.scss";

const ProfilPicturesDialog = ({ onSelected, onCancel }) => {
  const dialogRef = useRef(null);
  const [profilPicture, setProfilPicture] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    fetch("http://localhost:8000/api/pictures")
      .then((res) => res.json())
      .then((data) => {
        setProfilPicture(data);
        setIsLoading(false); 
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setIsLoading(false); 
      });
  }, []);

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

  const handleImageSelect = (cosmetic) => {
    dialogRef.current.close();
    onSelected(cosmetic);
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

        {isLoading ? (
          <p className="profil-dialog__loading">Chargement en cours...</p> 
        ) : (
          <ul className="profil-dialog__gallery" role="list">
            {profilPicture.map((img, index) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => handleImageSelect(img.id)}
                  className="profil-dialog__image-btn"
                  aria-label={`Sélectionner l’image ${index + 1}`}
                >
                  <img
                    src={`/media/profile-pictures/${img.image}`}
                    alt={`Image ${index + 1}`}
                    className="profil-dialog__image"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

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
