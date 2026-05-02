import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { AppNotification } from '../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface NotificationCardProps {
  notification: AppNotification;
  isRead: boolean;
  onClick: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, isRead, onClick }) => {
  const getColorForType = (type: string) => {
    switch (type) {
      case 'Placement': return 'success';
      case 'Result': return 'info';
      case 'Event': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Card 
      onClick={() => onClick(notification.ID)}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        bgcolor: isRead ? 'background.paper' : 'action.hover',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 3
        },
        borderLeft: isRead ? '4px solid transparent' : '4px solid #1976d2'
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            label={notification.Type} 
            color={getColorForType(notification.Type)} 
            size="small" 
          />
          <Typography variant="caption" color="text.secondary">
            {dayjs(notification.Timestamp).fromNow()}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          fontWeight={isRead ? 'normal' : 'bold'}
        >
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};
