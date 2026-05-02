import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Box, CircularProgress, MenuItem, Select, FormControl, InputLabel, Grid } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { notificationService } from '../services/api';
import type { AppNotification } from '../services/api';
import { NotificationCard } from '../components/NotificationCard';
import { useReadNotifications } from '../hooks/useReadNotifications';
import dayjs from 'dayjs';

const TYPE_WEIGHT: Record<string, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

export const PriorityInbox: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<number>(10);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  
  const { isRead, markAsRead } = useReadNotifications();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // Fetch more to ensure we get enough to sort, or just pass the limit to the API.
        // If we pass the limit to the API, it might just return the most recent.
        // We will pass the limit and typeFilter to API as requested by the assignment.
        const data = await notificationService.getNotifications(limit, 1, typeFilter !== 'All' ? typeFilter : undefined);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch priority notifications', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [limit, typeFilter]);

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setTypeFilter(event.target.value);
  };

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const weightA = TYPE_WEIGHT[a.Type] || 0;
      const weightB = TYPE_WEIGHT[b.Type] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      
      // If same type, sort by recency (timestamp desc)
      return dayjs(b.Timestamp).valueOf() - dayjs(a.Timestamp).valueOf();
    });
  }, [notifications]);

  return (
    <Box>
      <Typography variant="h4" mb={3}>Priority Inbox</Typography>
      
      <Box mb={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="limit-label">Top 'n' Limit</InputLabel>
              <Select
                labelId="limit-label"
                value={limit}
                label="Top 'n' Limit"
                onChange={handleLimitChange}
              >
                <MenuItem value={5}>Top 5</MenuItem>
                <MenuItem value={10}>Top 10</MenuItem>
                <MenuItem value={15}>Top 15</MenuItem>
                <MenuItem value={20}>Top 20</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Notification Type</InputLabel>
              <Select
                labelId="type-label"
                value={typeFilter}
                label="Notification Type"
                onChange={handleTypeChange}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {sortedNotifications.map((notif) => (
            <NotificationCard 
              key={notif.ID} 
              notification={notif} 
              isRead={isRead(notif.ID)} 
              onClick={markAsRead} 
            />
          ))}
          {sortedNotifications.length === 0 && (
            <Typography variant="body1" color="text.secondary">
              No notifications found matching the criteria.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};
