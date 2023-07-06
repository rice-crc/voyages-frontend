import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import store from "./redux/store";
import "@fortawesome/fontawesome-free/css/all.css";
import "./style/index.css";
import { Provider } from "react-redux";
ReactDOM.createRoot(
  document.getElementById("root") as HTMLAnchorElement
).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
