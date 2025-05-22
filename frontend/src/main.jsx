import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TimelineProvider } from "./stores/TimelineProvider.jsx";
import App from "./App.jsx";
import "./styles/main.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TimelineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TimelineProvider>
  </StrictMode>
);
