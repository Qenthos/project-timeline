import { useUserStore } from "../../stores/useStore";
import { observer } from "mobx-react-lite";
import "./Ranking.scss";
import RankingListUsers from "../../component/user/RankingListUsers";
import Header from "../../component/header/Header";
import LoadingScreen from "../../component/loading-screen/LoadingScreen";

const Ranking = observer(() => {
  const { users, isLoaded } = useUserStore();

  return !isLoaded ? (
    <LoadingScreen message="Chargement des utilisateurs en cours..." />
  ) : (
    <>
      <Header />
      <main className="ranking">
        <section className="ranking__section">
          <h1 className="ranking__title">Classement Elo</h1>
          <RankingListUsers users={users} />
        </section>
      </main>
    </>
  );
});

export default Ranking;
