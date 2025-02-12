import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import Play from "@mui/icons-material/PlayArrow";
import LogOut from "@mui/icons-material/Logout";
import RotateCcw from "@mui/icons-material/RotateLeft";

interface PauseMenuProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onExit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({
  open,
  onClose,
  onContinue,
  onRestart,
  onExit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: "black",
          },
        },
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography
            color="primary"
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 4,
            }}
          >
            Игра остановлена
          </Typography>

          <Stack spacing={2} sx={{ width: "100%" }}>
            <Button
              color="success"
              variant="contained"
              startIcon={<Play />}
              onClick={onContinue}
              sx={{
                "&:hover": { bgcolor: "success.dark" },
                fontSize: "1.25rem",
                fontWeight: "bold",
                py: 1.5,
              }}
            >
              Продолжить
            </Button>

            <Button
              color="info"
              variant="contained"
              startIcon={<RotateCcw />}
              onClick={onRestart}
              sx={{
                "&:hover": { bgcolor: "info.dark" },
                fontSize: "1.25rem",
                fontWeight: "bold",
                py: 1.5,
              }}
            >
              Перезапустить
            </Button>

            <Button
              color="error"
              variant="contained"
              startIcon={<LogOut />}
              onClick={onExit}
              sx={{
                "&:hover": { bgcolor: "error.dark" },
                fontSize: "1.25rem",
                fontWeight: "bold",
                py: 1.5,
              }}
            >
              Выйти
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PauseMenu;
