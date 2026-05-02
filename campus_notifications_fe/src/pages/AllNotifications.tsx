import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Pagination } from '@mui/material';
import { notificationService } from '../services/api';
import type { AppNotification } from '../services/api';
import { NotificationCard } from '../components/NotificationCard';
import { useReadNotifications } from '../hooks/useReadNotifications';

export const AllNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { isRead, markAsRead } = useReadNotifications();
  const limit = 10;

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await notificationService.getNotifications(limit, page);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>All Notifications</Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {notifications.map((notif) => (
            <NotificationCard 
              key={notif.ID} 
              notification={notif} 
              isRead={isRead(notif.ID)} 
              onClick={markAsRead} 
            />
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={10} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </>
      )}
    </Box>
  );
};
