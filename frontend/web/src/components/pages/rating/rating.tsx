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
  Alert
} from '@mui/material';
import { UserStats } from '@/types';
import { StatsService } from '@/services/stats';

const RatingTable = ({ data }: { data: UserStats[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="rating table">
        <TableHead>
          <TableRow>
            <TableCell>Место</TableCell>
            <TableCell>Пользователь</TableCell>
            <TableCell align="right">Процент побед</TableCell>
            <TableCell align="right">Всего игр</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={user.user_id}>
              <TableCell component="th" scope="row">
                #{index + 1}
              </TableCell>
              <TableCell>{user.user_name}</TableCell>
              <TableCell align="right">
                {user.win_percentage.toFixed(1)}%
              </TableCell>
              <TableCell align="right">
                {user.num_games_mult}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const Rating = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<UserStats[]>([]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await StatsService.getUsersTop({
          category_params: {
            category: 0,
            pattern: ''
          },
          page_info: {
            offset: 0,
            page_size: 10
          },
          points: 'desc'
        });
        
        setUsers(response.users);
      } catch (err) {
        setError('Не удалось загрузить рейтинг');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h3" gutterBottom>
        Рейтинг игроков
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <RatingTable data={users} />
      )}
    </div>
  );
};