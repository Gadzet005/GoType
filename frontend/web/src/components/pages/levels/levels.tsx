import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Button
} from '@mui/material';
import { LevelApi } from '@/api/levelApi';
import { RoutePath } from '@/config/routes/path';
import { Link as RouterLink } from 'react-router-dom';
import { Level, LevelFilterParams, LevelSortParams, PageInfo } from '@/api/models';

export const Levels = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: 0,
    language: '',
    tags: [] as string[],
    search: '',
    sort: 'popularity'
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        const data = await LevelApi.getLevelList({
          filter_params: {
            difficulty: appliedFilters.difficulty,
            language: appliedFilters.language,
            level_name: appliedFilters.search
          },
          sort_params: {
            popularity: appliedFilters.sort === 'popularity' ? 'desc' : '',
            date: appliedFilters.sort === 'date' ? 'desc' : ''
          },
          page_info: {
            offset: 1 + (page - 1) * PAGE_SIZE,
            page_size: PAGE_SIZE
          },
          tags: appliedFilters.tags
        });
        setLevels(data.levels || []);
      } catch (err: any) {
        if (err.response?.status === 500 && err.response?.data?.message === 'ERR_INTERNAL') {
            // setError('Нет такого уровня');
            setLevels([]); // Очищаем список уровней
          }
          else{
        setError('Ошибка загрузки уровней');
          }
    } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, [page, appliedFilters]); 

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom>
        Все уровни
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            label="Сортировка"
          >
            <MenuItem value="popularity">По популярности</MenuItem>
            <MenuItem value="date">По дате</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Сложность</InputLabel>
          <Select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            label="Сложность"
          >
            <MenuItem value={0}>Все</MenuItem>
            <MenuItem value={1}>Легкий</MenuItem>
            <MenuItem value={2}>Средний</MenuItem>
            <MenuItem value={3}>Сложный</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Язык</InputLabel>
          <Select
            value={filters.language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            label="Язык"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="eng">Английский</MenuItem>
            <MenuItem value="rus">Русский</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Поиск по названию"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button 
          variant="contained" 
          onClick={handleApplyFilters}
          sx={{ height: 56 }}
        >
          Применить
        </Button>
      </Box>

      {levels.length === 0 ? (
        <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
          Уровней нет
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {levels.map((level) => (
              <Grid item key={level.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={level.preview_path || '/placeholder-level.jpg'}
                    alt={level.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      <RouterLink to={`${RoutePath.level}/${level.id}`}>
                        {level.name}
                      </RouterLink>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Автор: {level.author_name}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip 
                        label={`Сложность: ${level.difficulty}`} 
                        color="primary" 
                        size="small" 
                      />
                      <Chip 
                        label={level.language.toUpperCase()} 
                        variant="outlined" 
                        size="small" 
                      />
                      {level.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          variant="outlined" 
                          size="small" 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={10}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};