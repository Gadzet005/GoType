import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "@/core/style/appTheme";
import { AppContextProvider } from "@/components/providers/app";
import { AppNavigation } from "@/components/navigation/AppNavigation";
import { routes } from "@/core/config/routes";
import { SnackbarProvider } from "@/components/providers/snackbar";

export const App = () => {
  return (
    <AppContextProvider>
      <ThemeProvider theme={appTheme}>
        <SnackbarProvider>
          <CssBaseline />
          <Box sx={{ height: "100%" }}>
            <AppNavigation routes={routes} />
          </Box>
        </SnackbarProvider>
      </ThemeProvider>
    </AppContextProvider>
  );
};
