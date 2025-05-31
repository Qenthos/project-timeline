import ListUsers from "../component/user/ListUsers";
import Header from "../component/Header";
import { useUsersStore } from "../stores/useStore";

const Ranking = () => {
  const userStore = useUsersStore();

  return (
    <>
      <Header />
      <h1>Classement des utilisateurs</h1>
      <ListUsers users={userStore.users} />
    </>
  );
};

export default Ranking;
