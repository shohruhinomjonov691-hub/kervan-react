// src/app/MaterialTheme/index.ts
import { createTheme } from "@mui/material/styles";
import shadows from "./shadow";
import typography from "./typography";

const theme = createTheme({
  typography,
  shadows: shadows as any,
  palette: {
    primary: {
      main: "#8d4b00", // Saffron Orange (design dan)
      light: "#b15f00",
      dark: "#6e3900",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#895033", // Roasted Coffee
      light: "#feb28f",
      dark: "#6d391e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fcf9f8", // Clotted Cream
      paper: "#ffffff",
    },
    text: {
      primary: "#1c1b1b", // Charcoal
      secondary: "#554336", // Warm brown
    },
    error: {
      main: "#ba1a1a",
    },
  },
  shape: {
    borderRadius: 8, // 0.5rem default
  },
});

export default theme;
