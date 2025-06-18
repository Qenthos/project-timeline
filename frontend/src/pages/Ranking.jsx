import { useUsersStore } from "../stores/useStore";
import { observer } from "mobx-react-lite";
import "./Ranking.scss";
import RankingListUsers from "../component/user/RankingListUsers";
import Header from "../component/Header";
import LoadingScreen from "../component/LoadingScreen";

const Ranking = observer(() => {
  const { users, isLoaded } = useUsersStore();

  return !isLoaded ? (
    <LoadingScreen message="Chargement des utilisateurs en cours..." />
  ) : (
    <>
      <Header />
      <main className="ranking">
        <section className="ranking__section">
          <h1 className="ranking__title">Classement</h1>
          <RankingListUsers users={users} />
        </section>
      </main>
    </>
  );
});

export default Ranking;
