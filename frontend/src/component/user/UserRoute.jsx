import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../stores/useStore";
import { observer } from "mobx-react-lite";

const UserRoute = observer(() => {
  const { currentUser } = useAuthStore();
  const isConnected = !!currentUser;

  return isConnected ? <Outlet /> : <Navigate to="/login" replace />;
});

export default UserRoute;
