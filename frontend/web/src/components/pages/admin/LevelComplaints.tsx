// components/admin/LevelComplaints.tsx
import React, { useEffect, useState } from 'react';
import { AdminService } from '@/api/admin.service';
import { LevelComplaint } from '@/api/types';

export const LevelComplaints = () => {
  const [complaints, setComplaints] = useState<LevelComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await AdminService.getLevelComplaints();
        setComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {complaints.map(complaint => (
        <div key={complaint.level_id}>
          <h3>{complaint.reason}</h3>
          <p>{complaint.message}</p>
        </div>
      ))}
    </div>
  );
};