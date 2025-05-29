import { useNavigate, Outlet } from "react-router";
import "./HubAdmin.scss";

const HubAdmin = () => {
  let navigate = useNavigate();

  return (
    <main className="hub">
      <section className="hub__section">
        <h1 className="hub__title">Hub administrateur</h1>
        <h2 className="hub__subtitle">Bienvenue [username]</h2>
        <ul className="hub__list">
          <li className="hub__item">
            <button
              className="hub__button"
              onClick={() => navigate("admin-manage-instrument")}
            >
              Gérer les instruments
            </button>
          </li>
          <li className="hub__item">
          <button
              className="hub__button"
              onClick={() => navigate("admin-manage-user")}
            >
              Gérer les joueurs
            </button>
          </li>
        </ul>
      </section>
      <Outlet />
    </main>
  );
};

export default HubAdmin;
