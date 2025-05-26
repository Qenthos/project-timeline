import { observer } from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from "react-router";
import { useInstrumentsStore } from "./stores/useStore.js";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ranking from "./pages/Ranking";
import MyInstruments from "./pages/MyInstruments";
import TimelineComposer from "./pages/timelineComposer";
import SettingsGame from "./pages/SettingsGame.jsx";

const App = observer(() => {
  const { isLoaded } = useInstrumentsStore();

  return !isLoaded ? (
    <p>Chargement...</p>
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
        <Route path="*" element={<Page404 />}></Route>
      </Routes>
    </BrowserRouter>
  );
});

export default App;
