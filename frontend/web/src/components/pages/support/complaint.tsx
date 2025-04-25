import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { UserApi } from '@/api/userApi';
import { UserInfo } from '@/api/models'
import { RoutePath } from '@/config/routes/path';

type ComplaintType = 'user' | 'level';

const reasonsMap = {
  user: ['Cheating', 'Offencive nickname', 'Unsportsmanlike conduct'],
  level: ['Offencive name', 'Offencive video', 'Offencive audio', 'Offencive text']
};

const reasonsMapTranslate: Record<string, string> = {
    'Cheating': 'Читерство',
    'Offencive nickname': 'Оскорбительное имя пользователя',
    'Unsportsmanlike conduct': 'Неспортивное поведение',
    'Offencive name': 'Оскорбительное название уровня',
    'Offencive video': 'Оскорбительная картинка уровня',
    'Offencive audio': 'Оскорбительная музыка',
    'Offencive text': 'Оскорбительный текст уровня'
};

export const Complaint = () => {
  const navigate = useNavigate();
  const [complaintType, setComplaintType] = useState<ComplaintType>('user');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<UserInfo>();

  useEffect(() => {
    const fetchProfile = async() => {
        try {
            const userData = await UserApi.getUserInfo();
            
            setProfile(userData);
            
          } catch (userError) {
            console.error('Profile fetch error:', userError);
            setError('Ошибка загрузки профиля');
            navigate(RoutePath.login);
          } finally {
            setLoading(false);
          }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate(RoutePath.login);
    }        
    
    fetchProfile();
  }, [navigate]);
  if(!profile){
    return (
        <Typography variant="h5" textAlign="center" mt={4}>
          Профиль пользователя не найден
        </Typography>
      );
  }
  const {id} = profile;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!targetId || !reason || !message) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    const idNumber = parseInt(targetId);
    if (isNaN(idNumber)) {
      setError('ID должен быть числом');
      return;
    }

    setLoading(true);
    
    try {
      if (complaintType === 'user') {
        await UserApi.writeUserComplaint({ 
            author_id:id,
            user_id: idNumber, 
            reason, 
            message 
        });
      } else {
        await UserApi.writeLevelComplaint({ 
          author_id:id,
          level_id: idNumber, 
          reason, 
          message 
        });
      }
      
      setSuccess('Жалоба успешно отправлена');
      setTargetId('');
      setReason('');
      setMessage('');
    } catch (err) {
      setError('Ошибка при отправке жалобы. Проверьте введенные данные');
      console.error('Complaint error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Отправить жалобу
        </Typography>

        <Tabs 
          value={complaintType} 
          onChange={(_, newValue) => {
            setComplaintType(newValue);
            setTargetId('');
            setReason('');
            setMessage('');
          }}
          sx={{ mb: 3 }}
        >
          <Tab label="На пользователя" value="user" />
          <Tab label="На уровень" value="level" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={`ID ${complaintType === 'user' ? 'пользователя' : 'уровня'}`}
            variant="outlined"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Причина жалобы</InputLabel>
            <Select
              value={reason}
              label="Причина жалобы"
              onChange={(e) => setReason(e.target.value)}
            >
              {reasonsMap[complaintType].map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reasonsMapTranslate[reason]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Сообщение"
            variant="outlined"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2 }}
          />

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : 'Отправить жалобу'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};