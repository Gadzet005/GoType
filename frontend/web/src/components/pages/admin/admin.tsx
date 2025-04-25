import { useState, useEffect } from "react";
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
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { AdminApi } from "@/api/adminApi";
import { LevelApi } from "@/api/levelApi";
import { UserApi } from "@/api/userApi";
import {
  LevelComplaint,
  UserComplaint,
  UserSimpleInfo,
  PlayerStats,
  LevelInfo,
} from "@/api/models";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<UserSimpleInfo[]>([]);
  const [nextUsers, setNextUsers] = useState<UserSimpleInfo[]>([]);
  const [levelComplaints, setLevelComplaints] = useState<LevelComplaint[]>([]);
  const [userComplaints, setUserComplaints] = useState<UserComplaint[]>([]);
  const [searchParams, setSearchParams] = useState({
    name: "",
    isBanned: false,
    offset: 1,
    pageSize: 10,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSimpleInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [banForm, setBanForm] = useState({
    ban_time: "24h",
    ban_reason: "Нарушение правил сообщества",
  });
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<
    LevelComplaint | UserComplaint | null
  >(null);
  const [complaintInfo, setComplaintInfo] = useState<
    PlayerStats | LevelInfo | null
  >(null);
  const [processingAction, setProcessingAction] = useState<
    "process" | "ban" | "delete" | null
  >(null);
  const [complaintType, setComplaintType] = useState<"level" | "user">("level");

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "90vh",
    overflowY: "auto",
  } as const;

  const loadData = async (loadNextPage: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case "users":
          const usersData = await AdminApi.getUsers({
            ...searchParams,
            offset: searchParams.offset,
            pageSize: searchParams.pageSize,
          });

          const nextUsersData = await AdminApi.getUsers({
            ...searchParams,
            offset: searchParams.offset + searchParams.pageSize,
            pageSize: searchParams.pageSize,
          });

          if (loadNextPage) {
            setUsers(nextUsersData || []);
            const newNextUsers = await AdminApi.getUsers({
              ...searchParams,
              offset: searchParams.offset + searchParams.pageSize * 2,
              pageSize: searchParams.pageSize,
            });
            setNextUsers(newNextUsers);
          } else {
            setUsers(usersData || []);
            setNextUsers(nextUsersData || []);
          }
          break;
        case "level-complaints":
          const levelComplaintsData = await AdminApi.getLevelComplaints();
          setLevelComplaints(levelComplaintsData);
          break;
        case "user-complaints":
          const userComplaintsData = await AdminApi.getUserComplaints();
          setUserComplaints(userComplaintsData);
          break;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, searchParams]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchParams((prev) => ({
      ...prev,
      offset: (newPage - 1) * prev.pageSize + 1,
    }));
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      if (selectedUser.ban_reason !== "no ban") {
        await AdminApi.unbanUser({ id: selectedUser.id });
      } else {
        await AdminApi.banUser({
          id: selectedUser.id,
          ...banForm,
        });
      }
      setBanModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка выполнения операции");
    }
  };

  const handleChangeAccess = async (
    user: UserSimpleInfo,
    newAccess: number
  ) => {
    try {
      await AdminApi.changeUserAccess({ id: user.id, new_access: newAccess });
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка изменения прав доступа");
    }
  };

  const handleProcessClick = async (
    complaint: LevelComplaint | UserComplaint,
    type: "level" | "user"
  ) => {
    setSelectedComplaint(complaint);
    setComplaintType(type);
    setProcessModalOpen(true);
    setLoading(true);

    try {
      if (type === "user") {
        const userComplaint = complaint as UserComplaint;
        const stats = await UserApi.getUserStats(userComplaint.user_id);
        setComplaintInfo(stats);
      } else {
        const levelComplaint = complaint as LevelComplaint;
        const levelInfo = await LevelApi.getLevelInfo(levelComplaint.level_id);
        setComplaintInfo(levelInfo);
      }
    } catch (err) {
      setError("Ошибка загрузки дополнительной информации");
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async () => {
    if (!selectedComplaint || !processingAction) {
      setError('Не выбрана жалоба для обработки');
      return;
    }
    console.log(selectedComplaint);
    try {
      let response;
      switch (processingAction) {
        case 'process':
          if (complaintType === 'level') {

            response = await AdminApi.processLevelComplaint(
              selectedComplaint.id  // Явно передаем объект ComplaintID
            );
          } else {
            response = await AdminApi.processUserComplaint(
              selectedComplaint.id // Явно передаем объект ComplaintID
            );
          }
          break;
  
        case 'ban':
          await AdminApi.banUser({
            id: (selectedComplaint as UserComplaint).user_id,
            ban_reason: "Жалоба пользователя",
            ban_time: "24h"
          });
          break;
  
        case 'delete':
          await AdminApi.banLevel(
            { id: (selectedComplaint as LevelComplaint).level_id } // Явно передаем LevelBan
          );
          break;
      }
  
      console.log('Action completed:', response?.data);
      setProcessModalOpen(false);
      await loadData();
      
    } catch (err: any) {
      console.error('Action failed:', err);
      setError(err.response?.data?.message || 'Ошибка выполнения действия');
      setProcessingAction(null);
    }
  };

  const LevelComplaintInfo = ({
    info,
    complaint,
  }: {
    info: LevelInfo;
    complaint: LevelComplaint;
  }) => (
    <div>
      <Typography variant="subtitle1">Информация об уровне:</Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="Название" secondary={info.levelInfo.name} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Автор"
            secondary={info.levelInfo.author_name}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Сложность"
            secondary={info.levelInfo.difficulty}
          />
        </ListItem>
      </List>
      <Typography variant="subtitle1">Жалоба:</Typography>
      <Typography>
        {complaint.reason}: {complaint.message}
      </Typography>
    </div>
  );

  const UserComplaintInfo = ({
    stats,
    complaint,
  }: {
    stats: PlayerStats;
    complaint: UserComplaint;
  }) => (
    <div>
      <Typography variant="subtitle1">Информация о пользователе:</Typography>
      <List dense>
        <ListItem>
          <ListItemText primary="Имя" secondary={stats.user_name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Очков" secondary={stats.sum_points} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Точность"
            secondary={`${(stats.average_accuracy_classic * 100).toFixed(1)}%`}
          />
        </ListItem>
      </List>
      <Typography variant="subtitle1">Жалоба:</Typography>
      <Typography>
        {complaint.reason}: {complaint.message}
      </Typography>
    </div>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Панель администратора
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Пользователи" value="users" />
          <Tab label="Жалобы на уровни" value="level-complaints" />
          <Tab label="Жалобы на пользователей" value="user-complaints" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index="users">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <TextField
            placeholder="Поиск по имени"
            variant="outlined"
            size="small"
            value={searchParams.name}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, name: e.target.value }))
            }
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
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    isBanned: e.target.checked,
                  }))
                }
              />
            }
            label="Показать забаненных"
          />
          <IconButton onClick={() => loadData()} disabled={loading}>
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
                  <TableCell>
                    {user.ban_reason !== "no ban" ? "Забанен" : "Активен"}
                  </TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color={user.ban_reason !== "no ban" ? "success" : "error"}
                      size="small"
                      onClick={() => {
                        setSelectedUser(user);
                        setBanModalOpen(true);
                      }}
                    >
                      {user.ban_reason !== "no ban" ? "Разбанить" : "Забанить"}
                    </Button>
                    <Select
                      value={user.access}
                      size="small"
                      onChange={(e) =>
                        handleChangeAccess(user, Number(e.target.value))
                      }
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
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
          >
            <Button
              variant="contained"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
            >
              Предыдущая страница
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePageChange(page + 1)}
              disabled={nextUsers.length === 0 || loading}
            >
              Следующая страница
            </Button>
          </Box>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index="level-complaints">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID автора</TableCell>
                <TableCell>ID уровня</TableCell>
                <TableCell>Причина</TableCell>
                <TableCell>Сообщение</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {levelComplaints.map((complaint) => (
                <TableRow key={`level-${complaint.id}`}>
                  <TableCell>{complaint.author_id}</TableCell>
                  <TableCell>{complaint.level_id}</TableCell>
                  <TableCell>{complaint.reason}</TableCell>
                  <TableCell>{complaint.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleProcessClick(complaint, "level")}
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
                <TableCell>ID автора</TableCell>
                <TableCell>ID пользователя</TableCell>
                <TableCell>Причина</TableCell>
                <TableCell>Сообщение</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userComplaints.map((complaint) => (
                <TableRow key={`user-${complaint.id}`}>
                  <TableCell>{complaint.author_id}</TableCell>
                  <TableCell>{complaint.user_id}</TableCell>
                  <TableCell>{complaint.reason}</TableCell>
                  <TableCell>{complaint.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleProcessClick(complaint, "user")}
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
        open={processModalOpen}
        onClose={() => setProcessModalOpen(false)}
        aria-labelledby="process-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Обработка жалобы на{" "}
            {complaintType === "level" ? "уровень" : "пользователя"}
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {complaintType === "level" && complaintInfo && (
                <LevelComplaintInfo
                  info={complaintInfo as LevelInfo}
                  complaint={selectedComplaint as LevelComplaint}
                />
              )}

              {complaintType === "user" && complaintInfo && (
                <UserComplaintInfo
                  stats={complaintInfo as PlayerStats}
                  complaint={selectedComplaint as UserComplaint}
                />
              )}

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                {complaintType === "user" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setProcessingAction("ban")}
                  >
                    Забанить пользователя
                  </Button>
                )}

                {complaintType === "level" && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setProcessingAction("delete")}
                  >
                    Удалить уровень
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => setProcessingAction("process")}
                >
                  Подтвердить обработку
                </Button>
              </Box>

              {processingAction && (
                <Box sx={{ mt: 2, borderTop: 1, pt: 2 }}>
                  <Typography>
                    Вы уверены, что хотите выполнить это действие?
                  </Typography>
                  <Button onClick={confirmAction} color="primary">
                    Да
                  </Button>
                  <Button onClick={() => setProcessingAction(null)}>
                    Отмена
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Modal>

      <Modal
        open={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        aria-labelledby="ban-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {selectedUser?.ban_reason !== "no ban"
              ? "Разбанить пользователя"
              : "Забанить пользователя"}
          </Typography>

          {selectedUser?.ban_reason === "no ban" && (
            <>
              <Select
                fullWidth
                value={banForm.ban_time}
                onChange={(e) =>
                  setBanForm({ ...banForm, ban_time: e.target.value })
                }
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
                onChange={(e) =>
                  setBanForm({ ...banForm, ban_reason: e.target.value })
                }
              />
            </>
          )}

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={() => setBanModalOpen(false)}>Отмена</Button>
            <Button
              variant="contained"
              onClick={handleBanUser}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Подтвердить"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};
