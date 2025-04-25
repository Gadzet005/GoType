import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import { LevelApi } from '@/api/levelApi';
import { LevelInfo, ErrorResponse } from '@/api/models';

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
        setError((err as ErrorResponse).message || 'Failed to load level info');
      } finally {
        setLoading(false);
      }
    };

    fetchLevel();
  }, [levelId]);

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
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
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
            image={`${import.meta.env.VITE_API_URL}/${levelInfo.levelInfo.preview_path}`}
            alt={levelInfo.levelInfo.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {levelInfo.levelInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {levelInfo.levelInfo.author_name}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          <Typography variant="h4">Level Details</Typography>
          <Divider />
          
          <Stack direction="row" spacing={1}>
            <Chip 
              label={`Difficulty: ${levelInfo.levelInfo.difficulty}`} 
              color="primary" 
              variant="outlined"
            />
            <Chip
              label={`Language: ${levelInfo.levelInfo.language}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`Type: ${levelInfo.levelInfo.type}`}
              color="info"
              variant="outlined"
            />
          </Stack>

          <Typography variant="h6">Description</Typography>
          <Typography paragraph>
            {levelInfo.levelInfo.description || 'No description provided'}
          </Typography>

          <Typography variant="h6">Tags</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {levelInfo.levelInfo.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
            {!levelInfo.levelInfo.tags?.length && (
              <Typography variant="body2" color="text.secondary">
                No tags
              </Typography>
            )}
          </Stack>

          <Typography variant="h6">Statistics</Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="body2">
              Duration: {Math.floor(levelInfo.levelInfo.duration / 60)}m {levelInfo.levelInfo.duration % 60}s
            </Typography>
            <Typography variant="body2">
              Created by: {levelInfo.levelInfo.author_name}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};