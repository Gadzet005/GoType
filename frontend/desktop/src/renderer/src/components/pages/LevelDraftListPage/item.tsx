import {
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "@/core/hooks";
import { RoutePath } from "@/core/config/routes/path";
import React from "react";
import { DraftData } from "@common/draft";
import { truncateString } from "@/core/utils/string";

interface DraftListItemProps {
  draft: DraftData;
  deleleSelf: () => void;
}

export const DraftListItem: React.FC<DraftListItemProps> = ({
  draft,
  deleleSelf,
}) => {
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(draft.updateTime);

  const handleEdit = () => {
    navigate(RoutePath.levelEditor, { draftId: draft.id });
  };

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
      onClick={handleEdit}
      secondaryAction={
        <Box sx={{ px: 2 }}>
          <Tooltip title="Редактировать" placement="top" arrow>
            <IconButton
              edge="end"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit();
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
        primary={
          <Typography variant="h4">{truncateString(draft.name, 20)}</Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        }
      />
    </ListItem>
  );
};
