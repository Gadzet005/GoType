import { NamedSentenceStyleClass } from "@desktop-common/draft/style";
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

interface StyleClassItemProps {
  styleClass: NamedSentenceStyleClass;
  deleleSelf: () => void;
  editSelf: () => void;
}

export const StyleClassItem: React.FC<StyleClassItemProps> = ({
  styleClass,
  deleleSelf,
  editSelf,
}) => {
  return (
    <ListItem
      className="pointer"
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        "&:hover": {
          bgcolor: "action.hover",
        },
        px: 3,
      }}
      onClick={editSelf}
      secondaryAction={
        <Box sx={{ px: 2 }}>
          <IconButton
            edge="end"
            aria-label="редактировать"
            onClick={(event) => {
              event.stopPropagation();
              editSelf();
            }}
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="large" />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="удалить"
            onClick={(event) => {
              event.stopPropagation();
              deleleSelf();
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Box>
      }
    >
      <ListItemText
        primary={<Typography variant="h4">{styleClass.name}</Typography>}
      />
    </ListItem>
  );
};
