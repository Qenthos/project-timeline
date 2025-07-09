import { useNavigate, useLocation } from "react-router";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useLeaderboardStore } from "../../stores/useStore";
import ListUsers from "../../component/user/ListUsers";
import "./AdminManageUser.scss";
import LoadingScreen from "../../component/loading-screen/LoadingScreen";

const AdminManageUser = observer(() => {
  const navigate = useNavigate();
  let location = useLocation();

  const leaderboardStore = useLeaderboardStore();

  const isEditing = location.pathname.includes("/edit/");

  useEffect(() => {
    leaderboardStore.loadUsers();
  }, []);

  return !leaderboardStore.isLoaded ? (
    <LoadingScreen message="Chargement des utilisateurs en cours" />
  ) : (
    <main className="user-manage">
      <section
        className={`user-manage__section ${
          leaderboardStore.isEditing ? "user-manage__section--editing" : ""
        }`}
      >
        <h1 className="user-manage__title">
          Gestion de {leaderboardStore.usersCount} joueur
          {leaderboardStore.usersCount > 1 ? "s" : ""}
        </h1>
        {leaderboardStore.usersCount === 0 ? (
          <p>Aucun utilisateur trouvé.</p>
        ) : (
          <ListUsers
            users={leaderboardStore.users}
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
