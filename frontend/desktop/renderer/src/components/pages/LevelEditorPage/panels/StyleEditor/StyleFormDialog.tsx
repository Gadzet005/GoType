import { StyleClass } from "@desktop-common/draft/style";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";

interface StyleFormProps {
  open: boolean;
  onClose?: () => void;
  onSave?: (styleClass: StyleClass) => void;
  initial?: StyleClass;
}

export const StyleFormDialog: React.FC<StyleFormProps> = ({
  open,
  onClose = () => {},
  onSave = () => {},
  initial,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактор стиля</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField label="Название" value={initial?.name} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Закрыть
        </Button>
        <Button color="primary" variant="contained">
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
