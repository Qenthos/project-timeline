import { useNavigate, Outlet } from "react-router";
import { observer } from "mobx-react-lite";
import "./HubAdmin.scss";
import Header from "../component/Header";
import { useUsersStore } from "../stores/useStore";

const HubAdmin = observer(() => {
  let navigate = useNavigate();

  const { users } = useUsersStore();

  return (
    <>
      <Header />
      <main className="hub">
        <section className="hub__section">
          <h1 className="hub__title">Hub administrateur</h1>
          <h2 className="hub__subtitle">
            Bienvenue {users ? users.username : "invité"}
          </h2>
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
    </>
  );
});

export default HubAdmin;
