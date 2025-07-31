import { Request, Response } from 'express';
import { logAuthEvent } from '../services/AuthEventService';

export const handleAuthEvent = async (req: Request, res: Response) => {
  console.log("📥 Received auth event request controller 1:", req.body)  ;
  const { user_id, event_type } = req.body;

  if (!user_id || !['login', 'logout'].includes(event_type)) {
    return res.status(400).json({ error: 'Invalid user_id or event_type' });
  }

  try {
    await logAuthEvent({ user_id, event_type });
    res.status(201).json({ message: 'Auth event logged' });
  } catch (err: any) {
     console.error("❌ Error logging auth event:", err);
    res.status(500).json({ error: err.message });
  }
 
};
