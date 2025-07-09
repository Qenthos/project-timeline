import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../stores/useStore";
import { observer } from "mobx-react-lite";

const AdminRoute = observer(() => {
  const { currentUser } = useAuthStore();
  const user = currentUser;

  return user && user.admin ? <Outlet /> : <Navigate to="/" replace />;
});

export default AdminRoute;
