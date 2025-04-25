import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  CircularProgress,
  Alert,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Avatar
} from '@mui/material';
import { UserApi } from '@/api/userApi';
import { PlayerStats } from '@/api/models';
import PersonIcon from '@mui/icons-material/Person';

export const Rating = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<PlayerStats[]>([]);
  const [next_users, setNextUsers] = useState<PlayerStats[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',       
    pattern: 'desc',   
    points: 'desc',    
    pageSize: 10
  });

  const PAGE_SIZE = filters.pageSize;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await UserApi.getUsersTop({
          category_params: {
            category: filters.category,//filters.category, 
            pattern: filters.pattern
          },
          page_info: {
            offset: 1 + (page - 1),
            page_size: PAGE_SIZE
          },
          points: filters.points
        });
        ///console.log(data);
        const next_data = await UserApi.getUsersTop({
            category_params: {
              category: filters.category, 
              pattern: filters.pattern
            },
            page_info: {
              offset: 1 + page,
              page_size: PAGE_SIZE
            },
            points: filters.points
          });
        setNextUsers(next_data || []);
        setUsers(data || []);
      } catch (err) {
        setError('Ошибка загрузки рейтинга');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
  }, [page, filters]);

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({
      ...prev,        
      category: value,
      pattern: 'desc' 
    }));
  };

  const backend_url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Рейтинг игроков
      </Typography>

      {/* Фильтры */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Категория</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value as string)}
            label="Категория"
          >
            <MenuItem value=''> Не выбирать категорию</MenuItem>
            <MenuItem value='S'>S</MenuItem>
            <MenuItem value='A'>A</MenuItem>
            <MenuItem value='B'>B</MenuItem>
            <MenuItem value='C'>C</MenuItem>
            <MenuItem value='D'>D</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка категории</InputLabel>
          <Select
            value={filters.pattern}
            onChange={(e) => setFilters(prev => ({...prev, pattern: e.target.value}))}
            label="Паттерн категории"
            disabled={!filters.category} // Отключаем если категория не выбрана
          >
            <MenuItem value="desc">По убыванию</MenuItem>
            <MenuItem value="asc">По возрастанию</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Сортировка по</InputLabel>
          <Select
            value={filters.points}
            onChange={(e) => setFilters(prev => ({...prev, points: e.target.value}))}
            label="Сортировать по"
          >
            
            <MenuItem value=""> Не сортировать</MenuItem>
            <MenuItem value="desc">Убыванию очков</MenuItem>
            <MenuItem value="asc">Возрастанию очков</MenuItem>
            
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ранг</TableCell>
                  <TableCell>Аватар</TableCell>
                  <TableCell>Пользователь</TableCell>
                  <TableCell align="right">Всего очков</TableCell>
                  <TableCell align="right">S</TableCell>
                  <TableCell align="right">A</TableCell>
                  <TableCell align="right">B</TableCell>
                  <TableCell align="right">C</TableCell>
                  <TableCell align="right">D</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell>#{index + (page - 1) * PAGE_SIZE + 1}</TableCell>
                    <TableCell>
                  <Avatar
                    src={
                      user.avatar_path.Valid 
                        ? `${backend_url}/${user.avatar_path.String}`
                        : undefined
                    }
                    sx={{ width: 40, height: 40 }}
                  >
                    {!user.avatar_path.Valid && (
                      <PersonIcon sx={{ fontSize: 24 }} />
                    )}
                  </Avatar>
                </TableCell>
                    <TableCell>{user.user_name}</TableCell>
                    <TableCell align="right">{user.sum_points}</TableCell>
                    <TableCell align="right">{user.num_classes_classic[0]}</TableCell>
                    <TableCell align="right">{user.num_classes_classic[1]}</TableCell>
                    <TableCell align="right">{user.num_classes_classic[2]}</TableCell>
                    <TableCell align="right">{user.num_classes_classic[3]}</TableCell>
                    <TableCell align="right">{user.num_classes_classic[4]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button 
              variant="contained"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              Предыдущая страница
            </Button>
            <Button 
              variant="contained"
              onClick={() => setPage(p => p + 1)}
              disabled={next_users.length === 0}
            >
              Следующая страница
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};