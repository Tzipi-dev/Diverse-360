import { supabase } from '../config/supabaseConfig';

export const insertScreenAnalytics = async (
  user_id: string,
  path: string,
  duration: number
) => {
  return await supabase.from('screen_time_analytics').insert([
    { user_id, path, duration }
  ]);
};

export const getScreenDurationsGroupedByPath = async () => {
  return await supabase.from('screen_time_analytics').select('path, duration');
};