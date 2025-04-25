import { StyleClassData } from "@common/draft/style";
import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";

interface StyleClassItemProps {
  styleClass: StyleClassData;
  deleleSelf: () => void;
  editSelf: () => void;
  copySelf: () => void;
  applySelf: () => void;
}

export const StyleClassItem: React.FC<StyleClassItemProps> = ({
  styleClass,
  deleleSelf,
  editSelf,
  copySelf,
  applySelf,
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
          <Tooltip
            title="Применить к предложениям без стиля"
            placement="top"
            arrow
          >
            <IconButton
              edge="end"
              onClick={(event) => {
                event.stopPropagation();
                applySelf();
              }}
              sx={{ mr: 1 }}
            >
              <DoneIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Копировать" placement="top" arrow>
            <IconButton
              edge="end"
              onClick={(event) => {
                event.stopPropagation();
                copySelf();
              }}
              sx={{ mr: 1 }}
            >
              <ContentCopyIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Редактировать" placement="top" arrow>
            <IconButton
              edge="end"
              onClick={(event) => {
                event.stopPropagation();
                editSelf();
              }}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Удалить" placement="top" arrow>
            <IconButton
              edge="end"
              onClick={(event) => {
                event.stopPropagation();
                deleleSelf();
              }}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={<Typography variant="h4">{styleClass.name}</Typography>}
      />
    </ListItem>
  );
};
