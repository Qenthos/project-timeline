import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import "./BannerImagesDialog.scss";

const BannerImagesDialog = ({ onSelected, onCancel }) => {
  const dialogRef = useRef(null);

  const [bannerImages, setBannerImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/banners")
      .then((res) => res.json())
      .then((data) => {
        setBannerImages(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setIsLoading(false);
      });
  }, []);

  // const bannerImages = [
  //   { id: 1, name: "PFP1", image: "wallpaper-un.jpg" },
  //   { id: 2, name: "PFP2", image: "wallpaper-deux.jpg" },
  // ];

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
      className="banner-dialog"
      aria-labelledby="banner-dialog__title"
    >
      <div className="banner-dialog__container">
        <h2 id="banner-dialog__title" className="banner-dialog__title">
          Sélection photo de profil
        </h2>

        {isLoading ? (
          <p className="profil-dialog__loading">Chargement en cours...</p>
        ) : (
          <ul className="banner-dialog__gallery" role="list">
            {bannerImages.map((img, index) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => handleImageSelect(img.id)}
                  className="banner-dialog__image-btn"
                  aria-label={`Sélectionner l’image ${index + 1}`}
                >
                  <img
                    src={`/media/banner-images/${img.image}`}
                    alt={`Image ${index + 1}`}
                    className="banner-dialog__image"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="banner-dialog__actions">
          <button
            onClick={handleClose}
            className="banner-dialog__button banner-dialog__button--cancel"
          >
            Annuler
          </button>
        </div>
      </div>
    </dialog>
  );
};

BannerImagesDialog.propTypes = {
  onSelected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BannerImagesDialog;
