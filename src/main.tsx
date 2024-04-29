import "reflect-metadata";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StyledEngineProvider } from "@mui/material";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(
  rootElement ? rootElement : document.createElement("div")
);
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);
