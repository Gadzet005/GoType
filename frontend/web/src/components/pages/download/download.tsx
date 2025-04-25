import { Typography, Grid, Container, Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import WindowsIcon from './imgs/windows.svg';
import MacIcon from './imgs/mac.svg';
import LinuxIcon from './imgs/linux.svg';

const DownloadIcon = styled('img')(({ theme }) => ({
  width: 200,
  height: 200,
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 150,
    height: 150,
  },
}));

export const Download = () => {
  // Замените ссылки на актуальные URL для скачивания
  const downloadLinks = {
    windows: 'https://github.com/Gadzet005/GoType/releases/download/gotype-1.1/GoType-win-x64.exe',
    mac: 'https://github.com/Gadzet005/GoType/releases/download/gotype-1.1/GoType-mac.dmg',
    linux: 'https://github.com/Gadzet005/GoType/releases/download/gotype-1.1/GoType-linux.AppImage',
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" py={8}>
        <Typography variant="h3" gutterBottom>
          Скачайте нашу игру
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" mb={6}>
          Доступно для всех популярных платформ
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Link onClick={() => handleDownload(downloadLinks.windows)}>
              <DownloadIcon
                src={WindowsIcon}
                alt="Download for Windows"
              />
            </Link>
            <Typography variant="h6" mt={2}>
              Windows
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Link onClick={() => handleDownload(downloadLinks.mac)}>
              <DownloadIcon
                src={MacIcon}
                alt="Download for macOS"
              />
            </Link>
            <Typography variant="h6" mt={2}>
              macOS
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Link onClick={() => handleDownload(downloadLinks.linux)}>
              <DownloadIcon
                src={LinuxIcon}
                alt="Download for Linux"
              />
            </Link>
            <Typography variant="h6" mt={2}>
              Linux
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body1" mt={6} color="textSecondary">
          * Поддерживаемые версии: Windows 10+, macOS 10.15+, Linux Ubuntu 20.04+
        </Typography>
      </Box>
    </Container>
  );
};