import { useNavigate, useLocation } from "react-router";
import { Outlet } from "react-router";
import { observer } from "mobx-react-lite";
import { useUsersStore } from "../stores/useStore";
import ListUsers from "../component/user/ListUsers";
import "./AdminManageUser.scss";
import LoadingScreen from "../component/LoadingScreen";

const AdminManageUser = observer(() => {
  const navigate = useNavigate();
  let location = useLocation();

  const { usersCount, users, isLoaded } = useUsersStore();

  const isEditing = location.pathname.includes("/edit/");

  return !isLoaded ? (
    <LoadingScreen message="Chargement des utilisateurs en cours" />
  ) : (
    <main className="user-manage">
      <section
        className={`user-manage__section ${
          isEditing ? "user-manage__section--editing" : ""
        }`}
      >
        <h1 className="user-manage__title">
          Gestion
          {usersCount > 1 ? " des " : " de "}
          {usersCount}
          {usersCount > 1 ? " joueurs" : " joueur"}
        </h1>
        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé.</p>
        ) : (
          <ListUsers
            users={users}
            editable={true}
            onEdit={(id) => navigate(`edit/${id}`)}
          />
        )}
      </section>
      <aside
        className={`user-manage__aside ${
          isEditing
            ? "user-manage__aside--visible"
            : "user-manage__aside--hidden"
        }`}
        aria-label="Édition d'un joueur"
      >
        <Outlet />
      </aside>
    </main>
  );
});

export default AdminManageUser;
