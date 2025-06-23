import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useUserStore } from "../../stores/useStore";
import Header from "../../component/header/Header";
import "./Login.scss";

const Login = observer(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const usersStore = useUserStore();
  let navigate = useNavigate();

  /**
   * Auto redirection if user is already connected
   */
  useEffect(() => {
    if (usersStore.currentUser) {
      navigate("/profil");
    }
  }, [usersStore.currentUser, navigate]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersStore.login(email, password);
      if (usersStore.currentUser) {
        navigate("/profil");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      <Header />
      <main className="login">
        <section className="login__section">
          <h1 className="login__title">Se connecter</h1>
          <form className="login__form" onSubmit={handleSubmit}>
            <fieldset className="login__fieldset">
              {/* <legend className="login__legend">Formulaire de connexion</legend> */}
              <ul className="login__list">
                <li className="login__item">
                  <label className="login__label" htmlFor="mail">
                    Adresse mail
                  </label>
                  <input
                    className="login__input"
                    id="mail"
                    type="email"
                    name="mail"
                    autoComplete="email"
                    placeholder="exemple@domaine.com"
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe"
                    onChange={(e) => setPassword(e.target.value)}
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
              {errorMessage && (
                <p
                  className="login__error"
                  style={{ color: "red", marginTop: "1rem" }}
                >
                  {errorMessage}
                </p>
              )}
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
        </section>
      </main>
    </>
  );
});

export default Login;
