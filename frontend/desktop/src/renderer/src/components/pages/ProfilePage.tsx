import { Button } from "@/components/ui/Button";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext, useNavigate, useSnackbar } from "@/core/hooks";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { BackButton } from "../common/BackButton";
import { logout } from "@/core/services/api/user/logout";
import { changeUserAvatar } from "@/core/services/api/user/changeAvatar";

export const ProfilePage: React.FC = observer(() => {
  const ctx = useAppContext();
  const user = ctx.user;
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarKey, setAvatarKey] = React.useState(Date.now());

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await changeUserAvatar(ctx, file);
      if (result.ok) {
        setAvatarKey(Date.now());
      } else {
        snackbar.show(
          "Не удалось изменить аватар. Попробуйте еще раз.",
          "error"
        );
        console.error(result.error);
      }
    }
  };

  const handleLogout = React.useCallback(async () => {
    await logout(ctx);
    navigate(RoutePath.home);
  }, [ctx, navigate]);

  if (!user.profile) {
    return <></>;
  }

  const avatarURL = user.profile.avatarURL
    ? `${ctx.config.backendURL}/${user.profile.avatarURL}?v=${avatarKey}`
    : undefined;

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container sx={{ mx: 1, borderRadius: 4, p: 3 }} maxWidth="sm">
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <IconButton
                sx={{ p: 0, "&:hover": { opacity: 0.8 } }}
                onClick={handleChangeAvatar}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Avatar
                      sx={{
                        width: 26,
                        height: 26,
                        bgcolor: "primary.main",
                      }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  }
                >
                  <Avatar src={avatarURL} sx={{ width: 80, height: 80 }}>
                    {user.profile.name[0].toUpperCase()}
                  </Avatar>
                </Badge>
              </IconButton>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
                Основная информация
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ pb: 2 }}>
                  <TextField
                    sx={{ width: "100%" }}
                    variant="outlined"
                    label="Имя"
                    defaultValue={user.profile.name}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    sx={{
                      fontWeight: 500,
                      fontSize: "1rem",
                      py: 2,
                    }}
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                  >
                    Выйти из аккаунта
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
});
