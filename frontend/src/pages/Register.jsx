import { useState } from "react";
import { useUsersStore } from "../stores/useStore";
import { useNavigate } from "react-router";
import Header from "../component/Header";
import "./Register.scss";

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  let navigate = useNavigate();

  const userStore = useUsersStore();

  /**
   * Get password from first input
   */
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePasswords(value, confirmPassword);
  };

  /**
   * Get password from second input
   * @param {*} e
   */
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePasswords(password, value);
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
   *Show / hide password
   * @param {*} setter
   */
  const toggleVisibility = (setterVisiblePassword) => {
    setterVisiblePassword((prev) => !prev);
  };

  /**
   * Send form and create account
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError) {
      try {
        userStore.createAccount(email, username, password);
        navigate("/profil");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="register">
        <section className="register__section">
          <h1 className="register__title">Créer un profil</h1>
          <form
            className="register__form"
            method="post"
            onSubmit={handleSubmit}
          >
            <fieldset className="register__fieldset">
              <legend className="register__legend">
                Formulaire de création
              </legend>
              <ul className="register__list">
                <li className="register__item">
                  <label className="register__label" htmlFor="mail">
                    Adresse mail
                  </label>
                  <input
                    className="register__input"
                    type="email"
                    name="mail"
                    placeholder="exemple@domaine.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </li>

                <li className="register__item">
                  <label className="register__label" htmlFor="username">
                    Pseudo
                  </label>
                  <input
                    className="register__input"
                    type="text"
                    name="username"
                    placeholder="Albator"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </li>

                <li className="register__item">
                  <label className="register__label" htmlFor="password">
                    Mot de passe
                  </label>
                  <div className="register__password-container">
                    <input
                      className="register__input"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                      value={password}
                      onInvalid={(e) =>
                        e.target.setCustomValidity(
                          "8 caractères min. avec une majuscule, un chiffre et un caractère spécial."
                        )
                      }
                      onInput={(e) => e.target.setCustomValidity("")}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className={`register__show-password ${
                        passwordVisible ? "is-visible" : ""
                      }`}
                      onClick={() => toggleVisibility(setPasswordVisible)}
                      aria-label={
                        passwordVisible
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    ></button>
                  </div>
                </li>

                <li className="register__item">
                  <label className="register__label" htmlFor="confirm_password">
                    Confirmer le mot de passe
                  </label>
                  <div className="register__password-container">
                    <input
                      className="register__input"
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirm_password"
                      id="confirm_password"
                      pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onInvalid={(e) =>
                        e.target.setCustomValidity(
                          "8 caractères min. avec une majuscule, un chiffre et un caractère spécial."
                        )
                      }
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                    <button
                      type="button"
                      className={`register__confirm-show-password ${
                        confirmPasswordVisible ? "is-visible" : ""
                      }`}
                      onClick={() =>
                        toggleVisibility(setConfirmPasswordVisible)
                      }
                      aria-label={
                        confirmPasswordVisible
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    ></button>
                  </div>
                  {passwordError && (
                    <p className="register__error">{passwordError}</p>
                  )}
                </li>
              </ul>

              <ul className="register__buttons">
                <li className="register__button-item">
                  <input
                    className="register__button register__button--reset"
                    type="reset"
                    value="Annuler"
                  />
                </li>
                <li className="register__button-item">
                  <input
                    className="register__button register__button--submit"
                    type="submit"
                    value="Créer un compte"
                    disabled={passwordError}
                  />
                </li>
              </ul>
            </fieldset>
          </form>
        </section>
      </main>
    </>
  );
};

export default Register;
