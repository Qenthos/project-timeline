import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useInstrumentsStore, useUsersStore } from "./stores/useStore.js";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ranking from "./pages/Ranking";
import MyInstruments from "./pages/MyInstruments";
import TimelineComposer from "./pages/timelineComposer.jsx";
import SettingsGame from "./pages/SettingsGame.jsx";
import LoadingScreen from "./component/LoadingScreen.jsx";
import Profil from "./pages/Profil.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import HubAdmin from "./pages/HubAdmin.jsx";
import EditInstrument from "./pages/EditInstruments.jsx";
import EditUser from "./pages/EditUser.jsx";
import AdminManageInstrument from "./pages/AdminManageInstrument.jsx";
import AdminManageUser from "./pages/AdminManageUser.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";

const App = observer(() => {
  const { isLoaded } = useInstrumentsStore();
  const usersStore = useUsersStore();

  return !isLoaded ? (
    <LoadingScreen />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/ranking" element={<Ranking />}></Route>
        <Route path="/settings-game" element={<SettingsGame />}></Route>
        <Route path="/my-instruments" element={<MyInstruments />}></Route>
        <Route path="/timeline-composer" element={<TimelineComposer />}></Route>
        <Route path="/profil" element={<Profil />}></Route>
        <Route path="/admin" element={<LoginAdmin />}></Route>
        {/* <Route
          path="/hub-admin"
          element={
            <ProtectedRoute user={usersStore.currentUser}>
              <HubAdmin />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="admin-manage-instrument" replace />}
          />
          <Route
            path="admin-manage-instrument"
            element={<AdminManageInstrument />}
          >
            <Route path="edit/:instruId" element={<EditInstrument />} />
          </Route>
          <Route path="admin-manage-user" element={<AdminManageUser />}>
            <Route path="edit/:userId" element={<EditUser />} />
          </Route>
        </Route> */}
        <Route path="/hub-admin" element={<HubAdmin />}>
          <Route
            index
            element={<Navigate to="admin-manage-instrument" replace />}
          />
          <Route
            path="admin-manage-instrument"
            element={<AdminManageInstrument />}
          >
            <Route path="edit/:instruId" element={<EditInstrument />} />
          </Route>
          <Route path="admin-manage-user" element={<AdminManageUser />}>
            <Route path="edit/:userId" element={<EditUser />} />
          </Route>
        </Route>
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
