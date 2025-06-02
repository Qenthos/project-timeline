import RankingListUsers from "../component/user/RankingListUsers";
import Header from "../component/Header";
import { useUsersStore } from "../stores/useStore";
import "./Ranking.scss";

const Ranking = () => {
  const userStore = useUsersStore();

  

  return (
    <>
      <Header />
      <main className="ranking">
        <section className="ranking__section">
          <h1 className="ranking__title">Classement des utilisateurs</h1>
          <RankingListUsers users={userStore.users} />
        </section>
      </main>
    </>
  );
};

export default Ranking;
