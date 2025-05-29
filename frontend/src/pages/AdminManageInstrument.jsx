import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useInstrumentsStore } from "../stores/useStore";
import ListInstruments from "../component/instrument/ListInstruments";
import "./AdminManageInstrument.scss";

const AdminManageInstrument = () => {
  let navigate = useNavigate();

  const instruStore = useInstrumentsStore();
  const instrumentsCount = instruStore.instrumentsCount;

  const isEditing = location.pathname.includes("/edit/");

  return (
    <main className="instrument-manage">
      <section
        className={`instrument-manage__section ${
          isEditing ? "instrument-manage__section--editing" : ""
        }`}
      >
        <h1 className="instrument-manage__title">
          Gestion
          {instrumentsCount > 1 ? " des " : " de "}
          {instrumentsCount}
          {instrumentsCount > 1 ? " instruments" : " instrument"}
        </h1>
        {instruStore.instruments.length === 0 ? (
          <p>Aucun instrument trouvé.</p>
        ) : (
          <ListInstruments
            instruments={instruStore.instruments}
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
};

export default AdminManageInstrument;
