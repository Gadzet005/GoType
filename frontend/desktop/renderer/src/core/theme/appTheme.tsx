import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
      light: "#CBB2FC",
      dark: "#9965F4",
    },
    secondary: {
      main: "#03DAC6",
      light: "#33E1D1",
      dark: "#02988A",
    },
    error: {
      main: "#CF6679",
      light: "#D88C9A",
      dark: "#A54F5E",
      contrastText: "black",
    },
    warning: {
      main: "#FFB74D",
      light: "#FFC677",
      dark: "#CC9340",
    },
    info: {
      main: "#64B5F6",
      light: "#89C7F8",
      dark: "#4F90C4",
    },
    success: {
      main: "#81C784",
      light: "#9DD39F",
      dark: "#679E6A",
    },
    background: {
      default: "#1A1A1A",
      paper: "#2A2C33",
    },
    text: {
      primary: "#E1E1E1",
      secondary: "#A0A0A0",
      disabled: "#666666",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    action: {
      active: "#FFFFFF",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: "Onest, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const result = { borderRadius: 8 };
          if (
            ownerState.color !== undefined &&
            ownerState.color !== "inherit"
          ) {
            return {
              ...result,
              "&:hover": {
                backgroundColor: appTheme.palette[ownerState.color].dark,
                transition: "0.2s",
              },
            };
          }
          return result;
        },
      },
      defaultProps: {
        draggable: false,
      },
    },
    MuiLink: {
      defaultProps: {
        draggable: false,
      },
    },
  },
});
