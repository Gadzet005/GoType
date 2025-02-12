import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "@/core/theme/appTheme";
import { AppContextProvider } from "./components/providers/app/AppContextProvider";
import { AppNavigation } from "./components/navigation/AppNavigation";
import { routes } from "./core/config/routes";

export const App = () => {
  return (
    <AppContextProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Box sx={{ height: "100%" }}>
          <AppNavigation routes={routes} />
        </Box>
      </ThemeProvider>
    </AppContextProvider>
  );
};
