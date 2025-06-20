import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useUsersStore } from "./../stores/useStore";
import { Link } from "react-router";
import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";
import ConfirmDialog from "../component/ConfirmDialog";
import ProfilPicturesDialog from "../component/profile/ProfilPicturesDialog";
import BannerImagesDialog from "../component/profile/BannerImagesDialog";
import "./Profil.scss";

const Profil = observer(() => {
  const usersStore = useUsersStore();
  let navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showProfilPictureDialog, setShowProfilPictureDialog] = useState(false);
  const [showBannerImageDialog, setShowBannerImageDialog] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [positionLeaderbord, setPositionLeaderboard] = useState("");

  useEffect(() => {
    if (!usersStore.currentUser) {
      navigate("/");
    }
  }, [usersStore.currentUser]);

  useEffect(() => {
    const fetchPosition = async () => {
      if (usersStore.currentUser) {
        try {
          const data = await usersStore.getPositionLeaderboard();
          setPositionLeaderboard(data.position);
        } catch (err) {
          console.error(
            "Erreur lors de la récupération de la position du joueur dans le classement:",
            err
          );
        }
      }
    };

    fetchPosition();
  }, [usersStore.currentUser]);

  useEffect(() => {
    if (usersStore.currentUser) {
      setEditedUser({
        username: usersStore.currentUser.username || "",
        email: usersStore.currentUser.email || "",
        password: "",
      });
    }
  }, [usersStore.currentUser]);

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
  const handleSave = (e) => {
    e.preventDefault();

    const { id } = usersStore.currentUser;
    const { username, email, password } = editedUser;

    if (password.trim() === "" && passwordError) {
      usersStore.updateUser(id, username, email, usersStore.currentUser.score);
    } else {
      usersStore.updateUser(
        id,
        username,
        email,
        usersStore.currentUser.score,
        password
      );
    }

    setIsEditing(false);
    setConfirmPassword("");
    setPasswordError("");
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
  const handleSelectedBannerImage = (idBannerImage) => {
    usersStore.updateBannerImage(idBannerImage);
    setShowBannerImageDialog(false);
  };

  /**
   * Get password from first input
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setEditedUser((prev) => ({ ...prev, password: value }));
    validatePasswords(value, confirmPassword);
  };

  /**
   * Get password from second input
   * @param {*} e
   */
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswords(editedUser.password, value);
  };

  /**
   * Compare password one and two
   * @param {String} password1 : password on the first input
   * @param {String} password2 : password on the second input
   */
  const validatePasswords = (password1, password2) => {
    if (password1 && password2 && password1 !== password2) {
      setPasswordError("Les deux champs doivent être identiques !");
    } else {
      setPasswordError("");
    }
  };

  /**
   * Logout
   */
  const handleLogout = () => {
    usersStore.logout();
    navigate("/");
  };

  return !usersStore.isLoaded ? (
    <LoadingScreen message="Chargement de votre profil en cours..." />
  ) : (
    <>
      <Header />
      <main className="profile">
        <section className="profile__section">
          <div className="profile__banner-wrapper">
            <ul className="profile__score-list">
              <li className="profile__score-item">
                <p className="profile__score-text">
                  Score : {usersStore.currentUser.score}
                </p>
              </li>
              <li className="profile__score-item">
                <p className="profile__score-text">
                  Elo : {usersStore.currentUser.elo}
                </p>
              </li>
              <li className="profile__score-item">
                <p className="profile__score-text">
                  Position classement : {positionLeaderbord}
                  {positionLeaderbord === 1 ? "er" : "ème"}
                </p>
              </li>
            </ul>

            {showBannerImageDialog && (
              <BannerImagesDialog
                onSelected={handleSelectedBannerImage}
                onCancel={() => setShowBannerImageDialog(false)}
              />
            )}

            <div className="profile__banner-container">
              <img
                src={usersStore.currentUser.pfbUrl}
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
                src={usersStore.currentUser.pfpUrl}
                alt="Photo de profil"
                onClick={() => setShowProfilPictureDialog(true)}
              />
            </div>
          </div>

          <div className="profile__buttons">
            <Link className="profile__start-game" to="/settings-game">
              Commencez une partie !
            </Link>
            <button className="profile__logout" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>

          <form className="profile__form" onSubmit={handleSave}>
            <ul className="profile__fields">
              <li className="profile__field">
                <label htmlFor="username" className="profile__label">
                  Nom utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  className="profile__input"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  max="50"
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
                  autoComplete="email"
                  className="profile__input"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </li>
              <li className="profile__field">
                <label className="profile__label" htmlFor="password">
                  Nouveau mot de passe
                </label>
                <div className="profile__password-container">
                  <input
                    className="profile__input"
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    pattern={
                      isEditing
                        ? "^(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$"
                        : undefined
                    }
                    value={editedUser.password}
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "8 caractères min. avec une majuscule, un chiffre et un caractère spécial."
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    onChange={handlePasswordChange}
                    readOnly={!isEditing}
                  />
                  <button
                    type="button"
                    className={`profile__confirm-show-password ${
                      passwordVisible ? "is-visible" : ""
                    }`}
                    onClick={
                      isEditing
                        ? () => toggleVisibility(setPasswordVisible)
                        : undefined
                    }
                    aria-label={
                      passwordVisible
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  ></button>
                </div>
              </li>

              <li className="profile__field">
                <label className="profile__label" htmlFor="confirm_password">
                  Confirmer le mot de passe
                </label>
                <div className="profile__password-container">
                  <input
                    className="profile__input"
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirm_password"
                    autoComplete="new-password"
                    id="confirm_password"
                    pattern={
                      isEditing
                        ? "^(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$"
                        : undefined
                    }
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "8 caractères min. avec une majuscule, un chiffre et un caractère spécial."
                      )
                    }
                    onInput={(e) => e.target.setCustomValidity("")}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    readOnly={!isEditing}
                  />
                  <button
                    type="button"
                    className={`profile__confirm-show-password ${
                      confirmPasswordVisible ? "is-visible" : ""
                    }`}
                    onClick={
                      isEditing
                        ? () => toggleVisibility(setConfirmPasswordVisible)
                        : undefined
                    }
                    aria-label={
                      confirmPasswordVisible
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  ></button>
                </div>
                {passwordError && (
                  <p className="profile__error">{passwordError}</p>
                )}
              </li>
              <li className="profile__field">
                <p className="profile__played-games">
                  Nombre de parties jouées :{" "}
                  {usersStore.currentUser.played_games}
                </p>
              </li>
              <li className="profile__field">
                <p className="profile__date-inscription">
                  Inscrit depuis le{" "}
                  {usersStore.currentUser.createdAt.toLocaleDateString()}
                </p>
              </li>

              {isEditing ? (
                <li className="profile__field">
                  <input
                    type="submit"
                    className="profile__save-btn"
                    value=" Enregistrer"
                    disabled={passwordError}
                  ></input>
                  <input
                    type="reset"
                    onClick={() => setIsEditing(false)}
                    className="profile__cancel-btn"
                    value="Annuler"
                  ></input>
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
});

export default Profil;
