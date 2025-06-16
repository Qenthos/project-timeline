import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { observer } from "mobx-react-lite";
import { useInstrumentsStore } from "../stores/useStore";
import ListInstruments from "../component/instrument/ListInstruments";
import LoadingScreen from "../component/LoadingScreen";
import "./AdminManageInstrument.scss";

const AdminManageInstrument = observer(() => {
  let navigate = useNavigate();

  const { instrumentsCount, instruments, isLoaded } = useInstrumentsStore();

  const isEditing = location.pathname.includes("/edit/");

  return !isLoaded ? (
    <LoadingScreen message="Chargement des instruments en cours" />
  ) : (
    <main className="instrument-manage">
      <section
        className={`instrument-manage__section ${
          isEditing ? "instrument-manage__section--editing" : ""
        }`}
      >
        <h1 className="instrument-manage__title">
          Gestion {instrumentsCount > 1 ? "des " : "de "}
          {instrumentsCount}
          {instrumentsCount > 1 ? " instruments" : " instrument"}
        </h1>
        {instruments.length === 0 ? (
          <p>Aucun instrument trouvé.</p>
        ) : (
          <ListInstruments
            instruments={instruments}
            editable
            onEdit={(id) => navigate(`edit/${id}`)}
          />
        )}
      </section>
      <aside
        className={`instrument-manage__aside ${
          isEditing
            ? "instrument-manage__aside--visible"
            : "instrument-manage__aside--hidden"
        }`}
        aria-label="Édition d'un joueur"
      >
        <Outlet />
      </aside>
    </main>
  );
});

export default AdminManageInstrument;
