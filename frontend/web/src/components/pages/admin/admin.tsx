import { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Modal,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { AdminApi } from '@/api/adminApi';
import {
  LevelBan,
  UserBan,
  ChangeUserAccess,
  ComplaintID,
  LevelComplaint,
  UserComplaint,
  UserSimpleInfo
} from '@/api/models';

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<UserSimpleInfo[]>([]);
  const [levelComplaints, setLevelComplaints] = useState<LevelComplaint[]>([]);
  const [userComplaints, setUserComplaints] = useState<UserComplaint[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: '1',
    isBanned: false,
    offset: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [banForm, setBanForm] = useState({
    ban_time: '24h',
    ban_reason: 'Нарушение правил сообщества',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await AdminApi.getUsers(searchParams);
          console.log(usersData);
          
          const processedUsers = usersData.map((user, index) => ({
            ...user,
            id: index,
          }));
          setUsers(processedUsers);
          console.log(users);
          break;
        case 'level-complaints':
          const levelComplaintsData = await AdminApi.getLevelComplaints() ;
          console.log(levelComplaintsData);
          setLevelComplaints(levelComplaintsData);
          break;
        case 'user-complaints':
          const userComplaintsData = await AdminApi.getUserComplaints();
          console.log(userComplaintsData);
          setUserComplaints(userComplaintsData || []);
          break;
      }
    } catch (err: any) {
      console.error('Admin data load error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, searchParams]);

  const handleBanUser = async () => {
    try {
      if (selectedUser.isBanned) {
        await AdminApi.unbanUser({ id: selectedUser.id });
      } else {
        await AdminApi.banUser({
          id: selectedUser.id,
          ...banForm
        });
      }
      setBanModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Ban error:', err);
      setError(err.response?.data?.message || 'Ошибка выполнения операции');
    }
  };

  const handleChangeAccess = async (user: any, newAccess: number) => {
    try {
      await AdminApi.changeUserAccess({ id: user.id, new_access: newAccess });
      loadData();
    } catch (err: any) {
      console.error('Access change error:', err);
      setError(err.response?.data?.message || 'Ошибка изменения прав доступа');
    }
  };

  const handleProcessComplaint = async (id: number, type: 'level' | 'user') => {
    try {
      if (type === 'level') {
        await AdminApi.processLevelComplaint({ id });
      } else {
        await AdminApi.processUserComplaint({ id });
      }
      loadData();
    } catch (err: any) {
      console.error('Complaint process error:', err);
      setError(err.response?.data?.message || 'Ошибка обработки жалобы');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Пользователи" value="users" />
          <Tab label="Жалобы на уровни" value="level-complaints" />
          <Tab label="Жалобы на пользователей" value="user-complaints" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index="users">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <TextField
            placeholder="Поиск по имени"
            variant="outlined"
            size="small"
            value={searchParams.name}
            onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={searchParams.isBanned}
                onChange={(e) => setSearchParams(prev => ({ ...prev, isBanned: e.target.checked }))}
              />
            }
            label="Показать забаненных"
          />
          <IconButton onClick={loadData} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.ban_reason ? 'Забанен' : 'Активен'}</TableCell>
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color={user.ban_reason ? 'success' : 'error'}
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setBanModalOpen(true);
                      }}
                    >
                      {user.ban_reason ? 'Разбанить' : 'Забанить'}
                    </Button>
                    <Select
                      value={user.access}
                      size="small"
                      onChange={(e) => handleChangeAccess(user, e.target.value as number)}
                    >
                      <MenuItem value={1}>Пользователь</MenuItem>
                      <MenuItem value={2}>Модератор</MenuItem>
                      <MenuItem value={3}>Администратор</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={searchParams.pageSize}
            page={Math.floor(searchParams.offset / searchParams.pageSize)}
            onPageChange={(_, newPage) => setSearchParams(prev => ({
              ...prev,
              offset: newPage * prev.pageSize
            }))}
            onRowsPerPageChange={(e) => setSearchParams(prev => ({
              ...prev,
              pageSize: parseInt(e.target.value, 10),
              offset: 1
            }))}
          />
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index="level-complaints">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID уровня</TableCell>
                <TableCell>Причина</TableCell>
                <TableCell>Сообщение</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levelComplaints.map((complaint) => (
                <TableRow key={`level-${complaint.id}`}>
                  <TableCell>{complaint.level_id}</TableCell>
                  <TableCell>{complaint.reason}</TableCell>
                  <TableCell>{complaint.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleProcessComplaint(complaint.id, 'level')}
                    >
                      Обработать
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index="user-complaints">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID пользователя</TableCell>
                <TableCell>Причина</TableCell>
                <TableCell>Сообщение</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userComplaints.map((complaint) => (
                <TableRow key={`user-${complaint.id}`}>
                  <TableCell>{complaint.user_id}</TableCell>
                  <TableCell>{complaint.reason}</TableCell>
                  <TableCell>{complaint.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleProcessComplaint(complaint.id, 'user')}
                    >
                      Обработать
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Modal
        open={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        aria-labelledby="ban-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1
        }}>
          <Typography id="ban-modal-title" variant="h6" component="h2" gutterBottom>
            {selectedUser?.isBanned ? 'Разбанить пользователя' : 'Забанить пользователя'}
          </Typography>
          
          {!selectedUser?.isBanned && (
            <>
              <Select
                fullWidth
                value={banForm.ban_time}
                onChange={(e) => setBanForm({ ...banForm, ban_time: e.target.value })}
                sx={{ mb: 2 }}
              >
                <MenuItem value="1h">1 час</MenuItem>
                <MenuItem value="24h">24 часа</MenuItem>
                <MenuItem value="7d">7 дней</MenuItem>
                <MenuItem value="30d">30 дней</MenuItem>
              </Select>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Причина бана"
                value={banForm.ban_reason}
                onChange={(e) => setBanForm({ ...banForm, ban_reason: e.target.value })}
                sx={{ mb: 2 }}
              />
            </>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setBanModalOpen(false)}>Отмена</Button>
            <Button 
              variant="contained" 
              onClick={handleBanUser}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Подтвердить'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};