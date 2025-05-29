import Header from "../component/Header";
import { useNavigate } from "react-router"; 
import "./LoginAdmin.scss";

const Admin = () => {
  let navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="admin">
        <section className="admin__section">
          <h1 className="admin__title">Connexion : espace administrateur</h1>
          <form
            className="admin__form"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/hub-admin");
            }}
          >
            <fieldset className="admin__fieldset">
              <legend className="admin__legend">Formulaire</legend>
              <ul className="admin__list">
                <li className="admin__item">
                  <label htmlFor="mail" className="admin__label">
                    Adresse mail
                  </label>
                  <input
                    type="text"
                    id="mail"
                    name="mail"
                    required
                    className="admin__input"
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
                  />
                </li>
              </ul>
              <ul className="admin__buttons">
                <li>
                  <input
                    type="reset"
                    value="Annuler"
                    className="admin__button admin__button--reset"
                  />
                </li>
                <li>
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
        {/* <Outlet /> */}
      </main>
    </>
  );
};

export default Admin;
