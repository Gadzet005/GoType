import "./css/App.css";
import { Box } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { AppNavigation } from "./navigation/AppNavigation";
import { routes } from "@/config/routes";
import { useMemo, useState } from 'react';

export const App = () => {
  const [cacheBuster] = useState(Date.now());

  const backgroundStyles = useMemo(
    () => ({
      backgroundImage: `url(/pattern.svg?cb=${cacheBuster})`,
      backgroundRepeat: "repeat",
    }),
    [cacheBuster]
  );
  return (
    <BrowserRouter>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          ...backgroundStyles,
          backgroundRepeat: "repeat",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <div className="out container">
          <Box
            className="inn container"
            component="main"
            sx={{
              flex: 1,
              py: 4,
              px: 2,
            }}
          >
            <AppNavigation routes={routes} />
          </Box>
        </div>

        <Footer />
      </Box>
    </BrowserRouter>
  );
};
