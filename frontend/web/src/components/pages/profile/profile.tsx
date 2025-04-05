import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Avatar, 
  Stack, 
  Chip, 
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import { UserApi } from '@/api/userApi';
import { RoutePath } from '@/config/routes/path';

interface UserProfile {
  id: number;
  username: string;
  access: number;
  ban_reason?: string;
  ban_time?: string;
  created_at: string;
  last_login?: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserApi.getUserInfo();
        setProfile(data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Ошибка загрузки профиля');
        navigate(RoutePath.login);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      navigate(RoutePath.login);
      return;
    }

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profile) {
    return (
      <Typography variant="h5" textAlign="center" mt={4}>
        Профиль не найден
      </Typography>
    );
  }

  const { username, access, ban_reason, ban_time, id, created_at, last_login } = profile;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={3}>
            
          <Typography variant="h4" component="h1" gutterBottom>
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Профиль пользователя
          </Typography>


          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 100, height: 100 }}>
              {username?.[0]?.toUpperCase()}
            </Avatar>
            
            <Stack spacing={1}>
              <Typography variant="h5">{username}</Typography>
              <Chip
                label={`ID: ${id}`}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>
          </Box>


          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Уровень доступа:
            </Typography>
            <Chip
              label={getAccessLevelLabel(access)}
              color={access >= 2 ? 'secondary' : 'default'}
              sx={{ mt: 1 }}
            />
          </Box>


          
          {ban_reason != "no ban" && (
            <Box sx={{ backgroundColor: '#ffeeee', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" color="error">
                <BlockIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Пользователь заблокирован
              </Typography>
              <Typography>Причина: {ban_reason}</Typography>
              {ban_time && (
                <Typography>
                  Время блокировки: {new Date(ban_time).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}
          


          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Активность:
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
              <Chip label={`Регистрация: ${new Date(created_at).toLocaleDateString()}`} />
              {last_login && (
                <Chip label={`Последний вход: ${new Date(last_login).toLocaleDateString()}`} />
              )}
            </Stack>
          </Box>

          
        </Stack>
      </Paper>
    </Box>
  );
};

const getAccessLevelLabel = (access: number) => {
  switch (access) {
    case 0: return 'Забанен';
    case 1: return 'Пользователь';
    case 2: return 'Модератор';
    case 3: return 'Администратор';
    case 4: return 'Главный администратор';
    default: return 'Гость';
  }
};