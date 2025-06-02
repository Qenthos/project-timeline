import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../component/Header";
import { useUsersStore } from "./../stores/useStore";
import ConfirmDialog from "../component/ConfirmDialog";
import ProfilPicturesDialog from "../component/profile/ProfilPicturesDialog";
import BannerImagesDialog from "../component/profile/BannerImagesDialog";
import "./Profil.scss";

const Profil = () => {
  const usersStore = useUsersStore();
  let navigate = useNavigate();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(() => {
    const user = usersStore.currentUser;
    return user ? { username: user.username, email: user.email, password: user.password } : {};
  });

  const [showProfilPictureDialog, setShowProfilPictureDialog] = useState(false);
  const [showBannerImageDialog, setShowBannerImageDialog] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  if (!usersStore.currentUser) {
    return <p>Chargement du profil...</p>;
  }

  /**
   *Show / hide password
   * @param {*} setter
   */
  const toggleVisibility = (setterVisiblePassword) => {
    setterVisiblePassword((prev) => !prev);
  };

  /**
   * Delete user and close popup
   */
  const handleDelete = () => {
    const { id } = usersStore.currentUser;
    usersStore.deleteUser(id);
    usersStore.logout();
    setShowConfirmDialog(false);
    navigate("/");
  };

  /**
   * Close popup
   */
  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  console.log(editedUser.password)

  /**
   * Save new values
   * @param {*} e
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Update user and close mode edit
   */
  const handleSave = () => {
    const { id } = usersStore.currentUser;
    const { username, email, password } = editedUser;

    usersStore.updateUser(id, username, email, password);
    setIsEditing(false);
  };

  /**
   * Update profil picture
   * @param {*} profilPicture
   */
  const handleSelectedProfilPicture = (profilPicture) => {
    usersStore.updateProfilPicture(profilPicture);
    setShowProfilPictureDialog(false);
  };

  /**
   * Update banner
   * @param {*} bannerImage
   */
  const handleSelectedBannerImage = (bannerImage) => {
    usersStore.updateBannerImage(bannerImage);
    setShowBannerImageDialog(false);
  };

  return (
    <>
      <Header />
      <main className="profile">
        <section className="profile__section">
          <div className="profile__banner-wrapper">
            <p className="profile__score">
              Score : {usersStore.currentUser.score}
            </p>

            {showBannerImageDialog && (
              <BannerImagesDialog
                onSelected={handleSelectedBannerImage}
                onCancel={() => setShowBannerImageDialog(false)}
              />
            )}

            <div className="profile__banner-container">
              <img
                src={usersStore.currentUser.bannerImage}
                alt="Image de couverture"
                className="profile__banner"
                onClick={() => setShowBannerImageDialog(true)}
              />

              <button
                className="profile__banner-edit-btn"
                onClick={() => setShowBannerImageDialog(true)}
              >
                Modifier
              </button>
            </div>

            {showProfilPictureDialog && (
              <ProfilPicturesDialog
                onSelected={handleSelectedProfilPicture}
                onCancel={() => setShowProfilPictureDialog(false)}
              />
            )}

            <div className="profile__avatar">
              <img
                src={usersStore.currentUser.profilePicture}
                alt="Photo de profil"
                onClick={() => setShowProfilPictureDialog(true)}
              />
            </div>
          </div>

          <form className="profile__form">
            <ul className="profile__fields">
              <li className="profile__field">
                <label htmlFor="username" className="profile__label">
                  Nom utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="profile__input"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </li>

              <li className="profile__field">
                <label htmlFor="email" className="profile__label">
                  Adresse mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="profile__input"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </li>

              <li className="profile__field">
                <label htmlFor="password" className="profile__label">
                  Mot de passe
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  className="profile__input"
                  value={editedUser.password}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
                <button
                  type="button"
                  className={`profile__show-password ${
                    passwordVisible ? "is-visible" : ""
                  }`}
                  onClick={() => toggleVisibility(setPasswordVisible)}
                  aria-label={
                    passwordVisible
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                ></button>
              </li>

              <li className="profile__field">
                <p className="profile__date-inscription">
                  Inscrit depuis le{" "}
                  {usersStore.currentUser.createdAt.toLocaleDateString()}
                </p>
              </li>

              {isEditing ? (
                <li className="profile__field">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="profile__save-btn"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="profile__cancel-btn"
                  >
                    Annuler
                  </button>
                </li>
              ) : (
                <li className="profile__field">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="profile__edit-btn"
                  >
                    Modifier mon profil
                  </button>
                </li>
              )}
              <li className="profile__field">
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(true)}
                  className="profile__delete-account"
                >
                  Supprimer mon compte
                </button>
              </li>
            </ul>
          </form>
        </section>

        {showConfirmDialog && (
          <ConfirmDialog
            message={`Êtes-vous sûr de vouloir supprimer votre compte ? \n Cette action est irréversible.`}
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </main>
    </>
  );
};

export default Profil;
