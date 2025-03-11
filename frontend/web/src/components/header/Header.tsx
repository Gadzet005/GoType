import { AppBar, Toolbar, Button, Link, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useUser } from "@/hooks";
import { Logo } from "../logo";
import { RoutePath } from "@/config/routes/path";
import { observer } from "mobx-react-lite";

export const Header = observer(() => {
  const user = useUser();

  const handleLogout = async () => {
    try {
      await user.logout();
      localStorage.removeItem('authTokens');
    } catch (error) {
      console.error('Logout error:', error);
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
          {user.isAuthenticated ? (
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
});