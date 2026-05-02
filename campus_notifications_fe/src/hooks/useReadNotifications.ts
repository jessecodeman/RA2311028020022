import { useState, useEffect } from 'react';

export const useReadNotifications = () => {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('readNotifications');
    if (stored) {
      setReadIds(new Set(JSON.parse(stored)));
    }
  }, []);

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem('readNotifications', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const isRead = (id: string) => readIds.has(id);

  return { readIds, markAsRead, isRead };
};
