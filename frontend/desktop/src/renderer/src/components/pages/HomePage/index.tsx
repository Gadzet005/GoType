import { useUser } from "@/core/hooks";
import { Box, Container, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { Menu } from "./Menu";
import { menuList } from "./menuList";

export const HomePage: React.FC = observer(() => {
  const user = useUser();

  return (
    <Container sx={{ p: 3 }} maxWidth="md">
      <Stack sx={{ alignItems: "center" }} spacing={5}>
        <Typography
          sx={{ fontWeight: "bold", fontSize: "9rem" }}
          color="primary"
          variant="h1"
        >
          GoType!
        </Typography>

        <Box sx={{ width: "75%" }}>
          <Menu list={menuList} userAuthed={user.isAuth} />
        </Box>
      </Stack>
    </Container>
  );
});
