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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box
} from '@mui/material';
import { UserApi } from '@/api/userApi';
import { PlayerStats } from '@/models';

export const Rating = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<PlayerStats[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 0,       // Индекс категории из AvailableClasses
    pattern: 'desc',   // asc/desc
    points: 'desc',    // Сортировка по очкам
    pageSize: 10
  });

  const PAGE_SIZE = filters.pageSize;

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await UserApi.getUsersTop({
          category_params: {
            category: filters.category,
            pattern: filters.pattern
          },
          page_info: {
            offset: (page - 1) * PAGE_SIZE,
            page_size: PAGE_SIZE
          },
          points: filters.points
        });
        
        setUsers(data);
      } catch (err) {
        setError('Failed to load rating');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [page, filters]);

  const handleCategoryChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      category: value,
      pattern: 'desc' // Сброс паттерна при смене категории
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Players Rating
      </Typography>

      {/* Фильтры */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleCategoryChange(Number(e.target.value))}
            label="Category"
          >
            <MenuItem value={0}>All Players</MenuItem>
            <MenuItem value={1}>Beginner</MenuItem>
            <MenuItem value={2}>Intermediate</MenuItem>
            <MenuItem value={3}>Advanced</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.points}
            onChange={(e) => setFilters(prev => ({...prev, points: e.target.value}))}
            label="Sort By"
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
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
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell align="right">Total Points</TableCell>
                  <TableCell align="right">Accuracy</TableCell>
                  <TableCell align="right">Wins</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell>#{index + 1}</TableCell>
                    <TableCell>{user.user_name}</TableCell>
                    <TableCell align="right">{user.sum_points}</TableCell>
                    <TableCell align="right">
                      {user.average_accuracy_classic?.toFixed(1)}%
                    </TableCell>
                    <TableCell align="right">
                      {user.win_percentage?.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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