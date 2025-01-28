import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "@/public/theme/appTheme";
import { UserProvider } from "./public/user/UserProvider";
import { AppNavigation } from "./public/navigation/AppNavigation";

export const App = () => {
  return (
    <UserProvider>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Box sx={{ height: "100%" }}>
          <AppNavigation />
        </Box>
      </ThemeProvider>
    </UserProvider>
  );
};
