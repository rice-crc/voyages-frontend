import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "./style/index.css";
ReactDOM.createRoot(
  document.getElementById("root") as HTMLAnchorElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
