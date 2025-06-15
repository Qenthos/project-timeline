import RankingListUsers from "../component/user/RankingListUsers";
import Header from "../component/Header";
import { useUsersStore } from "../stores/useStore";
import "./Ranking.scss";
import LoadingScreen from "../component/LoadingScreen";

const Ranking = () => {
  const { users, isLoaded } = useUsersStore();

  return !isLoaded ? (
    <LoadingScreen message="Chargement des utilisateurs en cours..." />
  ) : (
    <>
      <Header />
      <main className="ranking">
        <section className="ranking__section">
          <h1 className="ranking__title">Classement des utilisateurs</h1>
          <RankingListUsers users={users} />
        </section>
      </main>
    </>
  );
};

export default Ranking;
