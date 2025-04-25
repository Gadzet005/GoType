import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { LevelApi } from "@/api/levelApi";
import { LevelInfo, ErrorResponse } from "@/api/models";

export const Level: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchLevel = async () => {
      try {
        if (!levelId) return;

        const response = await LevelApi.getLevelInfo(Number(levelId));
        setLevelInfo(response);
        setError(null);
      } catch (err) {
        setError((err as ErrorResponse).message || "Failed to load level info");
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [levelId]);

  const handleDownload = async () => {
    if (!levelId) return;

    try {
      const response = await LevelApi.downloadLevel(Number(levelId));

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `level_${levelId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      setError((err as ErrorResponse).message || "Failed to download level");
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" mt={4}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ width: "100%", maxWidth: 600 }}>
          {error}
        </Alert>
      </Grid>
    );
  }

  if (!levelInfo) {
    return null;
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={`${import.meta.env.VITE_BACKEND_URL}/${
              levelInfo.levelInfo.preview_path
            }`}
            alt={levelInfo.levelInfo.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {levelInfo.levelInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              От: {levelInfo.levelInfo.author_name}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleDownload}
              fullWidth
            >
              Скачать уровень
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          <Typography variant="h4">Информация об уровне</Typography>
          <Divider />

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              label={`Сложность: ${levelInfo.levelInfo.difficulty}/10`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Язык: ${levelInfo.levelInfo.language.toUpperCase()}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`Id: ${levelInfo.levelInfo.id}`}
              color="info"
              variant="outlined"
            />
          </Stack>

          <Typography variant="h6">Описание</Typography>
          <Typography paragraph>
            {levelInfo.levelInfo.description || "Описание отсутствует"}
          </Typography>

          <Typography variant="h6">Теги:</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {levelInfo.levelInfo.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
            {!levelInfo.levelInfo.tags?.length && (
              <Typography variant="body2" color="text.secondary">
                Теги отсутствуют
              </Typography>
            )}
          </Stack>

          <Typography variant="h6">Статистика уровня</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Сыграно раз: {levelInfo.levelStats.num_played}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Средняя точность:{" "}
                {(levelInfo.levelStats.average_acc * 100).toFixed(1)}%
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Макс. комбо: {levelInfo.levelStats.max_combo}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Макс. очки: {levelInfo.levelStats.max_points}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Средние очки: {levelInfo.levelStats.average_points}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Средняя скорость:{" "}
                {levelInfo.levelStats.average_average_velocity} зн./мин
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Макс. скорость: {levelInfo.levelStats.max_average_velocity}{" "}
                зн./мин
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="body2">
                Продолжительность:{" "}
                {Math.floor(levelInfo.levelInfo.duration / 60)}m{" "}
                {levelInfo.levelInfo.duration % 60}s
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6">Лучшие прохождения уровня</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Игрок</TableCell>
                  <TableCell>Id игрока</TableCell>
                  <TableCell align="right">Очки</TableCell>

                  <TableCell align="right">Точность</TableCell>
                  <TableCell align="right">Скорость</TableCell>
                  <TableCell align="right">Комбо</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {levelInfo.levelUserTop.map((user, index) => (
                  <TableRow key={`${user.player_id}-${index}`}>
                    <TableCell>{user.player_name}</TableCell>
                    <TableCell align="right">{user.player_id}</TableCell>
                    <TableCell align="right">{user.points}</TableCell>

                    <TableCell align="right">
                      {(user.accuracy * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell align="right">
                      {user.average_velocity} зн./мин
                    </TableCell>
                    <TableCell align="right">{user.max_combo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Grid>
    </Grid>
  );
};
