import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useUsersStore } from "./stores/useStore.js";
import {
  Home,
  Login,
  Register,
  Page404,
  Profil,
  Ranking,
  MyInstruments,
  TimelineComposer,
  SettingsGame,
  LoginAdmin,
  HubAdmin,
  EditInstrument,
  EditUser,
  AdminManageInstrument,
  AdminManageUser,
} from "./pages";

import ProtectedRoute from "./component/ProtectedRoute.jsx";

const App = observer(() => {

  const usersStore = useUsersStore();

  return  (
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
