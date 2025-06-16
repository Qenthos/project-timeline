import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";
import ListInstruments from "./../component/instrument/ListInstruments";
import { useInstrumentsStore } from "./../stores/useStore";
import { observer } from "mobx-react-lite";

const MyInstruments = observer(() => {
  const { instruments, isLoaded } = useInstrumentsStore();

  return !isLoaded ? (
    <LoadingScreen message="Chargement des instruments en cours..." />
  ) : (
    <>
      <Header />
      <main>
        <section>
          <ListInstruments instruments={instruments} />
        </section>
      </main>
    </>
  );
});

export default MyInstruments;
