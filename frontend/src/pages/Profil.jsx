import { useState } from "react";
import Header from "../component/Header";
import { useUsersStore } from "./../stores/useStore";
import ConfirmDialog from "../component/ConfirmDialog";
import "./Profil.scss";

const Profil = () => {
  const usersStore = useUsersStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!usersStore.currentUser) {
    return <p>Chargement du profil...</p>;
  }

  /**
   * Delete user and close popup
   */
  const handleDelete = () => {
    usersStore.deleteUser();
    setShowConfirmDialog(false);
  };

  /**
   * Close popup
   */
  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
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
            <img
              src="./../../public/media/bg-home.webp"
              alt="Image de couverture"
              className="profile__banner"
            />
            <img
              src="./../../public/media/piano-bg.jpg"
              alt="Photo de profil"
              className="profile__avatar"
            />
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
                  value={usersStore.currentUser.username}
                  readOnly
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
                  value={usersStore.currentUser.email}
                  readOnly
                />
              </li>

              <li className="profile__field">
                <label htmlFor="password" className="profile__label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="profile__input"
                  value=""
                  placeholder="••••••••"
                  readOnly
                />
              </li>

              <li className="profile__field">
                <p className="profile__date-inscription">
                  Inscrit depuis le 28 mai 2025
                </p>
              </li>

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
            message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
            onConfirm={handleDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </main>
    </>
  );
};

export default Profil;
