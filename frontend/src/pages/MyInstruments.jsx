import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";
import ListInstruments from "./../component/instrument/ListInstruments";
import { useInstrumentsStore } from "./../stores/useStore";
import { observer } from "mobx-react-lite";
import "./MyInstruments.scss"

const MyInstruments = observer(() => {
  const { instruments, isLoaded } = useInstrumentsStore();

  return !isLoaded ? (
    <LoadingScreen message="Chargement des instruments en cours..." />
  ) : (
    <>
      <Header />
      <main className="list-instruments">
        <section className="list-instruments__section">
          <h1 className="list-instruments__title">Instruments</h1>
          <ListInstruments instruments={instruments} />
        </section>
      </main>
    </>
  );
});

export default MyInstruments;
