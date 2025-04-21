import { Typography, Button, Stack, Grid, Box, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RoutePath } from '@/config/routes/path';

export const Main = () => {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 8 }}>
      
      <Stack alignItems="center" spacing={4} mb={10}>
        <Typography variant="h1" textAlign="center" sx={{ 
          fontWeight: 900,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          GoType - Танцуй под стук клавиатуры!
        </Typography>
        
        <Typography variant="h5" textAlign="center" color="text.secondary">
          Совершенствуй навыки печати под захватывающие музыкальные ритмы
        </Typography>

        <Stack direction="row" spacing={3}>
          <Button 
            component={RouterLink} 
            to={RoutePath.register}
            variant="contained" 
            size="large"
          >
            Начать игру
          </Button>
          <Button 
            component={RouterLink} 
            to={RoutePath.download}
            variant="outlined" 
            size="large"
          >
            Скачать
          </Button>
        </Stack>
      </Stack>


      <Box mt={10} textAlign="center">
        <Typography variant="h2" gutterBottom>Как играть?</Typography>
        <Grid container spacing={4}>
          <Grid item md={3}>
            <Typography variant="h3">1</Typography>
            <Typography variant="h6">Выбери уровень</Typography>
            <Typography>Из коллекции различных языков</Typography>
          </Grid>
          <Grid item md={3}>
            <Typography variant="h3">2</Typography>
            <Typography variant="h6">Выбери свою сложность</Typography>
            <Typography>От новичка до эксперта</Typography>
          </Grid>
          <Grid item md={3}>
            <Typography variant="h3">3</Typography>
            <Typography variant="h6">Печатай под ритм</Typography>
            <Typography>Лови волну комбо</Typography>
          </Grid>
          <Grid item md={3}>
            <Typography variant="h3">4</Typography>
            <Typography variant="h6">Стань лучшим</Typography>
            <Typography>Возглавь таблицу лидеров</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};