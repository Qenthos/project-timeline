import Header from "../component/Header";
import { useNavigate } from "react-router";
import { useUsersStore } from "./../stores/useStore";
import { useState } from "react";
import "./LoginAdmin.scss";

const Admin = () => {
  const navigate = useNavigate();
  const usersStore = useUsersStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersStore.loginAdmin(email, password);
      if (usersStore.currentUser?.admin) {
        navigate("/hub-admin");
      } else {
        setErrorMessage("Accès refusé : non administrateur");
      }
    } catch (err) {
      setErrorMessage(err.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <Header />
      <main className="admin">
        <section className="admin__section">
          <h1 className="admin__title">Connexion : espace administrateur</h1>
          <form className="admin__form" onSubmit={handleSubmit}>
            <fieldset className="admin__fieldset">
              <legend className="admin__legend">Formulaire</legend>
              <ul className="admin__list">
                <li className="admin__item">
                  <label htmlFor="mail" className="admin__label">
                    Adresse mail
                  </label>
                  <input
                    type="email"
                    id="mail"
                    name="mail"
                    required
                    className="admin__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </li>
                <li className="admin__item">
                  <label htmlFor="password" className="admin__label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="admin__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </li>
              </ul>

              {errorMessage && (
                <p className="admin__error">{errorMessage}</p>
              )}

              <ul className="admin__buttons">
                <li className="admin__buttons-item">
                  <input
                    type="reset"
                    value="Annuler"
                    className="admin__button admin__button--reset"
                  />
                </li>
                <li className="admin__buttons-item admin__button-item--submit" > 
                  <input
                    type="submit"
                    value="Se connecter"
                    className="admin__button admin__button--submit"
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

export default Admin;
