import { useUser } from "@/core/hooks";
import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { Menu } from "./Menu";
import { menuList } from "./menuList";

export const HomePage: React.FC = observer(() => {
  const user = useUser();

  return (
    <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xl: "30%", md: "50%", sm: "70%" },
        }}
      >
        <Typography
          sx={{ py: 5, fontWeight: "bold", fontSize: "9rem" }}
          color="primary"
          variant="h1"
        >
          GoType!
        </Typography>

        <Menu list={menuList} userAuthed={user.isAuth} />
      </Box>
    </Box>
  );
});
