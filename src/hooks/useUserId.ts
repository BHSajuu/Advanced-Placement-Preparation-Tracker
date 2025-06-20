import { useState, useEffect } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get or create a unique user ID
    let storedUserId = localStorage.getItem('prep-user-id');
    
    if (!storedUserId) {
      // Generate a unique user ID
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('prep-user-id', storedUserId);
    }
    
    setUserId(storedUserId);
  }, []);

  return userId;
}