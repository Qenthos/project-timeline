import Header from "../component/Header";
import "./Login.scss";
import { Link } from "react-router";

const Login = () => {
  const toggleShowPassword = () => {
    const inputPassword = document.querySelector("#password");
    const toggleButton = document.querySelector(".login__show-password");

    inputPassword.type = inputPassword.type === "text" ? "password" : "text";

    const isVisible = inputPassword.type === "text";
    toggleButton.classList.toggle("is-visible", isVisible);

    toggleButton.setAttribute(
      "aria-label",
      isVisible ? "Afficher le mot de passe" : "Masquer le mot de passe"
    );
  };

  return (
    <>
      <Header />
      <main className="login">
        <h1 className="login__title">Se connecter</h1>
        <form className="login__form" action="" method="get">
          <fieldset className="login__fieldset">
            <legend className="login__legend">Formulaire de connexion</legend>

            <ul className="login__list">
              <li className="login__item">
                <label className="login__label" htmlFor="mail">
                  Adresse mail
                </label>
                <input
                  className="login__input"
                  id="mail"
                  type="text"
                  name="mail"
                  placeholder="exemple@domaine.com"
                  required
                />
              </li>
              <li className="login__item">
                <label className="login__label" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  className="login__input login__input--password"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  required
                />
                <button
                  type="button"
                  className="login__show-password"
                  onClick={toggleShowPassword}
                  aria-label="Afficher ou masquer le mot de passe"
                ></button>
              </li>
            </ul>

            <ul className="login__buttons">
              <li className="login__button-item">
                <input
                  className="login__button login__button--reset"
                  type="reset"
                  value="Annuler"
                />
              </li>
              <li className="login__button-item">
                <input
                  className="login__button login__button--submit"
                  type="submit"
                  value="Se connecter"
                />
              </li>
            </ul>
            <Link to="/register" className="login__link-register">Créer un compte</Link>
          </fieldset>
        </form>
      </main>
    </>
  );
};

export default Login;
