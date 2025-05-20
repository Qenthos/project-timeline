import Header from "../component/Header";
import "./Register.scss";

const Register = () => {
  const toggleShowPassword = () => {
    const inputPassword = document.querySelector("#password");
    const toggleButton = document.querySelector(".register__show-password");

    inputPassword.type = inputPassword.type === "text" ? "password" : "text";

    const isVisible = inputPassword.type === "text";
    toggleButton.classList.toggle("is-visible", isVisible);

    toggleButton.setAttribute(
      "aria-label",
      isVisible ? "Afficher le mot de passe" : "Masquer le mot de passe"
    );
  };

  const toggleConfirmShowPassword = () => {
    const inputPassword = document.querySelector("#confirm_password");
    const toggleButton = document.querySelector(
      ".register__confirm-show-password"
    );

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
      <main className="register">
        <section className="register__section">
          <h1 className="register__title">Créer un profil</h1>
          <form className="register__form" action="" method="post">
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
                    type="text"
                    name="mail"
                    placeholder="exemple@domaine.com"
                    required
                  />
                </li>
                <li className="register__item">
                  <label className="register__label" htmlFor="pseudo">
                    Pseudo
                  </label>
                  <input
                    className="register__input"
                    type="text"
                    name="pseudo"
                    placeholder="Albator"
                    required
                  />
                </li>
                <li className="register__item">
                  <label className="register__label" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    className="register__input"
                    type="password"
                    name="password"
                    id="password"
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                    required
                  />
                  <button
                    type="button"
                    className="register__show-password"
                    onClick={toggleShowPassword}
                    aria-label="Afficher ou masquer le mot de passe"
                  ></button>
                </li>
                <li className="register__item">
                  <label className="register__label" htmlFor="confirm_password">
                    Confirmer le mot de passe
                  </label>
                  <input
                    className="register__input"
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
                    required
                  />
                  {/* <span>
                    Minimum 8 caractères, une majuscule, un chiffre, un
                    caractère spécial
                  </span> */}
                  <button
                    type="button"
                    className="register__confirm-show-password"
                    onClick={toggleConfirmShowPassword}
                    aria-label="Afficher ou masquer le mot de passe"
                  ></button>
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
