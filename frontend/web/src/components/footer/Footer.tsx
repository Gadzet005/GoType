import { Box, Typography, Link, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RoutePath } from '@/config/routes/path';

export const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box
        maxWidth="lg"
        sx={{
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © GoType {new Date().getFullYear()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: { xs: 1, sm: 0 } }}>

        <Link
            component={RouterLink}
            to={RoutePath.complaint}
            color="text.secondary"
            variant="body2"
            underline="none"
            sx={{
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            Оставить жалобу
          </Link>

        <Typography 
            component="span" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            |
          </Typography>
          
          <Link
            component={RouterLink}
            to={RoutePath.faq}
            color="text.secondary"
            variant="body2"
            underline="none"
            sx={{
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            Справочная информация
          </Link>
          
          <Typography 
            component="span" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            |
          </Typography>

          <Link
            component={RouterLink}
            to={RoutePath.agreement}
            color="text.secondary"
            variant="body2"
            underline="none"
            sx={{
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            Пользовательское соглашение
          </Link>

          <Typography 
            component="span" 
            color="text.secondary"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            |
          </Typography>

          <Link
            component={RouterLink}
            to={RoutePath.rules}
            color="text.secondary"
            variant="body2"
            underline="none"
            sx={{
              '&:hover': { color: theme.palette.text.primary }
            }}
          >
            Правила сообщества
          </Link>
        </Box>
      </Box>
    </Box>
  );
};