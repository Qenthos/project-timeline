import { Link } from "react-router";
import { useState } from "react";
import Header from "../component/Header";
import "./Login.scss";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Hide / show password
   */
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Form
   * @param {*} e
   */ 
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Header />
      <main className="login">
        <h1 className="login__title">Se connecter</h1>
        <form className="login__form" onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  required
                  aria-describedby="togglePasswordLabel"
                />
                <button
                  type="button"
                  className={`login__show-password ${
                    showPassword ? "is-visible" : ""
                  }`}
                  onClick={toggleShowPassword}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  id="togglePasswordLabel"
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
            <Link to="/register" className="login__link-register">
              Créer mon compte
            </Link>
          </fieldset>
        </form>
      </main>
    </>
  );
};

export default Login;
