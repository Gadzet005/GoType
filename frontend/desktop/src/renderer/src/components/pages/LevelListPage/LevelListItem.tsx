import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@/components/ui/Button";
import React from "react";
import { RoutePath } from "@/core/config/routes/path";
import { Level } from "@/core/store/game/level";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface LevelListItemProps {
  level: Level;
  onDelete?: () => void;
}

export const LevelListItem: React.FC<LevelListItemProps> = ({
  level,
  onDelete = () => {},
}) => {
  const durationInMinutes = (level.duration / 60000).toFixed(1);
  return (
    <Card
      sx={{
        width: "500px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        "&:hover": {
          transform: "translateY(-4px)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      <CardMedia
        component="img"
        height="300px"
        image={level.preview.url}
        alt={level.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {level.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "4.5em",
          }}
        >
          {level.description}
        </Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {level.author.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {durationInMinutes} мин.
            </Typography>
          </Box>
          <Button
            size="large"
            color="error"
            variant="contained"
            fullWidth
            onClick={onDelete}
            startIcon={<DeleteOutlineIcon />}
          >
            Удалить
          </Button>
          <Button
            href={RoutePath.game}
            params={{ level }}
            size="large"
            variant="contained"
            fullWidth
            startIcon={<PlayArrowIcon />}
          >
            Играть
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
