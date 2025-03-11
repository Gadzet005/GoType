import './css/App.css';
import { Box } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './store/user/UserProvider';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { AppNavigation } from './navigation/AppNavigation';
import {routes} from '@/config/routes';
export const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Header />
          <div className="out container">
            <Box className="inn container" component="main" sx={{
                flex: 1,
                py: 4,
                px: 2
            }}>
                <AppNavigation routes={routes} />
            </Box>
          </div>

          <Footer />
        </Box>
      </UserProvider>
    </BrowserRouter>
  );
}