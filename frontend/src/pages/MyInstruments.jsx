import Header from "../component/Header";
import ListInstruments from "./../component/instrument/ListInstruments";
import { useInstrumentsStore } from "./../stores/useStore";

const MyInstruments = () => {
  
  const instrumentsStore = useInstrumentsStore();

  return (
    <>
      <Header />
      <main>
        <section>
          <ListInstruments
            instruments={instrumentsStore.instruments}
          ></ListInstruments>
        </section>
      </main>
    </>
  );
};

export default MyInstruments;
