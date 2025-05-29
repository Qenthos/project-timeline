import Header from "../component/Header";
import "./Profil.scss";

const Profil = () => {
  return (
    <>
      <Header />
      <main className="profile">
        <section className="profile__section">
          <div className="profile__banner-wrapper">
            <p className="profile__score">Score</p>
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
                <label for="username" className="profile__label">
                  Nom utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="profile__input"
                  value="Jean Dupont"
                />
              </li>

              <li className="profile__field">
                <label for="email" className="profile__label">
                  Adresse mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="profile__input"
                  value="jean.dupont@mail.com"
                />
              </li>

              <li className="profile__field">
                <label for="password" className="profile__label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="profile__input"
                />
              </li>

              <li className="profile__field">
                <p className="profile__date-inscription">
                  Inscrit depuis le 28 mai 2025
                </p>
              </li>
            </ul>
          </form>
        </section>
      </main>
    </>
  );
};

export default Profil;
