import { createRoot } from "react-dom/client";
import App, { preloadRoute } from "./App.tsx";
import "./index.css";

// Load the current route's code first so the prerendered HTML is replaced seamlessly.
preloadRoute(window.location.pathname).then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
