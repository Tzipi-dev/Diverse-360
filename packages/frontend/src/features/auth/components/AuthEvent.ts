import axios from 'axios';

export const logAuthEvent = async (userId: string, eventType: 'login' | 'logout') => {
  try {
    await axios.post('/api/auth-events', {
      user_id: userId,
      event_type: eventType,
    });
 
  } catch (error) {
    console.error('Failed to log auth event:', error);
  }
  console.log("✅ logAuthEvent finished");

};
