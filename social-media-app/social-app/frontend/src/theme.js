import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c6af7",
      light: "#a89af9",
      dark: "#5a4dd4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f06292",
      light: "#f48fb1",
      dark: "#c2185b",
    },
    background: {
      default: "#0d0d1a",
      paper: "#13131f",
    },
    surface: {
      main: "#1c1c2e",
    },
    text: {
      primary: "#e8e6f0",
      secondary: "#9e9bb8",
    },
    divider: "rgba(124,106,247,0.12)",
    error: { main: "#f06292" },
    success: { main: "#69f0ae" },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { fontSize: "0.97rem", lineHeight: 1.65 },
    body2: { fontSize: "0.875rem" },
    caption: { fontFamily: '"Space Mono", monospace', fontSize: "0.72rem" },
    button: { fontWeight: 600, letterSpacing: "0.03em" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
          transition: "all 0.2s ease",
        },
        contained: {
          boxShadow: "0 4px 24px rgba(124,106,247,0.3)",
          "&:hover": {
            boxShadow: "0 6px 32px rgba(124,106,247,0.5)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#13131f",
          borderRadius: 20,
          border: "1px solid rgba(124,106,247,0.1)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            borderColor: "rgba(124,106,247,0.25)",
            boxShadow: "0 8px 40px rgba(124,106,247,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(124,106,247,0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#7c6af7",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #7c6af7 0%, #f06292 100%)",
          fontFamily: '"Space Mono", monospace',
          fontWeight: 700,
          fontSize: "0.85rem",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(124,106,247,0.1)" },
      },
    },
  },
});

export default theme;
