import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import React from "react";
// import { StyleForm } from "./StyleForm";

export const StyleEditor = () => {
  // const [styleFormOpen, setStyleFormOpen] = React.useState(false);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4">Стиль текста</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          // onClick={() => setStyleFormOpen(true)}
        >
          Добавить стиль
        </Button>
      </Box>
      {/* <StyleForm open={styleFormOpen} onClose={() => setStyleFormOpen(false)} /> */}
    </Box>
  );
};
