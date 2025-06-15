import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TimelineProvider } from "./stores/TimelineProvider.jsx";
// import reportWebVitals from './reportWebVitals';
import App from "./App.jsx";
import "./styles/main.scss";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TimelineProvider>
        <App />
    </TimelineProvider>
  </StrictMode>
);

// reportWebVitals(console.log);
