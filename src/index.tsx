import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./app/MaterialTheme";
import { BrowserRouter as Router } from "react-router-dom";
import ContextProvider from "./app/context/ContextProvider";
import { SocketProvider } from "./app/context/SocketContext";
import "./css/index.css";

// GLOBAL INTEGRATION > MUI , REDUX, ROUTER, Socket.io, Context WebSocket ReactiveVariable Apollo ReactQuery ...
const container = document.getElementById("root")!;
const root = createRoot(container);
// REAL DOM >
// Virtual dom keyin Real dom quriladi

root.render(
  // VIRTUAL DOM
  <React.StrictMode>
    {/* PARENT: REDUX -malumot saqlaydigon Bunker */}
    <Provider store={store}>
      <ContextProvider>
        <SocketProvider>
          {/* PARENT: MUI */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* PARENT:  ROUTER */}
            <Router>
              <App />
            </Router>
          </ThemeProvider>
        </SocketProvider>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
