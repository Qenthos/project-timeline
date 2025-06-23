import { useNavigate, Outlet } from "react-router";
import { observer } from "mobx-react-lite";
import { useUserStore } from "../../stores/useStore";
import Header from "../../component/header/Header";
import "./HubAdmin.scss";

const HubAdmin = observer(() => {
  let navigate = useNavigate();

  const { users } = useUserStore();
  const username = users?.username;

  return (
    <>
      <Header />
      <main className="hub">
        <section className="hub__section">
          <h1 className="hub__title">Hub administrateur</h1>
          <h2 className="hub__subtitle">
            Bienvenue {username ?? ""}
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
