import { useUser } from '@/store/user/UserContext';
import { Typography, Box, Paper, Avatar, Stack, Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';

export const Profile = () => {
  const user = useUser()
  const { username, access, ban_reason, ban_time, id } = user;

  if (!user.isAuthorized) {
    return (
      <Typography variant="h5" textAlign="center" mt={4}>
        Пожалуйста, войдите чтобы просмотреть профиль
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* Заголовок профиля */}
          <Typography variant="h4" component="h1" gutterBottom>
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Профиль пользователя
          </Typography>

          {/* Основная информация */}
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

          {/* Уровень доступа */}
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

          {/* Информация о бане */}
          {ban_reason && (
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

          {/* Статистика активности */}
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              <AccessTimeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Активность:
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
              <Chip label="Регистрация: 2023-01-15" />
              <Chip label="Последний вход: 2023-03-20" />
            </Stack>
          </Box>

          {/* Ссылки действий */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Link component={RouterLink} to="/profile/edit" color="primary">
              Редактировать профиль
            </Link>
            <Link component={RouterLink} to="/change-password" color="primary">
              Сменить пароль
            </Link>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

// Вспомогательная функция для отображения уровня доступа
const getAccessLevelLabel = (access: number) => {
  switch (access) {
    case 0: return 'Пользователь';
    case 1: return 'Модератор';
    case 2: return 'Администратор';
    default: return 'Гость';
  }
};