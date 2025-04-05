// components/admin/LevelComplaints.tsx
import { useEffect, useState } from 'react';
import { 
  CircularProgress, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  Typography 
} from '@mui/material';
import { AdminApi } from '@/api/adminApi';
import { LevelComplaint } from '@/api/models';

export const LevelComplaints = () => {
  const [complaints, setComplaints] = useState<LevelComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await AdminApi.getLevelComplaints();
        setComplaints(data.level_complaints || []);
      } catch (err) {
        setError('Не удалось загрузить жалобы');
        console.error('Ошибка загрузки жалоб:', err);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mt: 4, mx: 'auto' }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Жалобы на уровни
      </Typography>
      
      <List>
        {complaints.map((complaint) => (
          <ListItem key={complaint.level_id} divider>
            <ListItemText
              primary={`Причина: ${complaint.reason}`}
              secondary={
                <>
                  <Typography component="span" display="block">
                    Уровень ID: {complaint.level_id}
                  </Typography>
                  <Typography component="span" display="block">
                    Сообщение: {complaint.message}
                  </Typography>
                  <Typography component="span" display="block" color="text.secondary">
                    Автор жалобы ID: {complaint.author_id}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};