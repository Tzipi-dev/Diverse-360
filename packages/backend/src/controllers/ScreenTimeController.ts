import { Request, Response } from 'express';
import { supabase } from '../config/supabaseConfig';

// יצירה
export const createScreenAnalytics = async (req: Request, res: Response) => {
  const { user_id, path, duration } = req.body;
  // בדיקה האם אחד הערכים חסר
  if (!user_id  || !path || !duration) {
    console.error('❌ ערכים חסרים בבקשה');
    return res.status(400).json({ error: 'Missing fields in request body' });
  }

  try {
    const { error } = await supabase.from('screen_time_analytics').insert([
      {
        user_id,
        path,
        duration,
      },
    ]);

    if (error) {
      console.error('❌ שגיאה מה־Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ נתוני אנליטיקה נשמרו בהצלחה!');
    res.status(201).json({ message: 'Analytics saved' });

  } catch (err) {
    console.error('❗ שגיאה כללית בשרת:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// בקובץ: controllers/ScreenTimeController.ts

export const getAnalyticsByUser = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('screen_time_analytics')
      .select('user_id, duration');

    if (error) {
      console.error('❌ שגיאה מה־Supabase:', error);
      return res.status(500).json({ error: error.message });
    }

    const grouped = (data || []).reduce(
      (acc: Record<string, number>, curr) => {
        if (!curr.user_id || typeof curr.duration !== 'number') return acc;
        acc[curr.user_id] = (acc[curr.user_id] || 0) + curr.duration;
        return acc;
      },
      {}
    );

    res.json(grouped);
  } catch (err) {
    console.error('❗ שגיאה כללית בשרת:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export const getAnalyticsByScreen = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('screen_time_analytics')
    .select('path, duration');

  if (error) {
    console.error('Supabase Error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  const grouped = (data || []).reduce((acc: Record<string, number>, curr) => {
    if (!curr.path || typeof curr.duration !== 'number') return acc;
    acc[curr.path] = (acc[curr.path] || 0) + curr.duration;
    return acc;
  }, {});

  res.json(grouped);
};