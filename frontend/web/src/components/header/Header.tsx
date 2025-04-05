import { AppBar, Toolbar, Button, Link, Box } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "../logo";
import { RoutePath } from "@/config/routes/path";
import { UserApi } from "@/api/userApi";
import { AxiosError } from 'axios';
import axios from 'axios';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth(); 
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      // 1. Сохраняем токен перед удалением
      const token = localStorage.getItem('token');
      
      // 2. Удаляем токен сразу
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      
      // 3. Отправляем запрос на сервер с явным указанием токена
      if (token) {
        await UserApi.logout(token); // Передаем токен явно
      }
      
      // 4. Перенаправляем пользователя
      navigate(RoutePath.login, { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // 5. Гарантированное перенаправление даже при ошибке
      navigate(RoutePath.login);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          component={RouterLink}
          to={RoutePath.default}
          color="inherit"
          sx={{ flexGrow: 1, mr: 2 }}
        >
          <Logo />
        </Link>
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          <Button component={RouterLink} to={RoutePath.download} color="inherit">
            Download
          </Button>
          <Button component={RouterLink} to={RoutePath.rating} color="inherit">
            Rating
          </Button>
          <Button component={RouterLink} to={RoutePath.levelList} color="inherit">
            Levels
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button 
                component={RouterLink} 
                to={RoutePath.profile} 
                color="inherit"
              >
                Profile
              </Button>
              <Button 
                onClick={handleLogout} 
                color="inherit"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              component={RouterLink} 
              to={RoutePath.login} 
              color="inherit"
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};