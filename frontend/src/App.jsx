import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
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

import UserRoute from "./component/user/UserRoute";
import AdminRoute from "./component/admin/AdminRoute";

const App = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<LoginAdmin />} />

        {/* User logged */}
        <Route element={<UserRoute />}>
          <Route path="/profil" element={<Profil />} />
          <Route path="/settings-game" element={<SettingsGame />} />
          <Route path="/my-instruments" element={<MyInstruments />} />
          <Route path="/timeline-composer" element={<TimelineComposer />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
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
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
});

export default App;
