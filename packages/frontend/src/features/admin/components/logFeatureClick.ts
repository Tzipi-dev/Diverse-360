import { supabase } from '../../../config/supabaseConfig';
export const logFeatureClick = async ({
  userId,
  featureName,
  screen,
}: {
  userId: string;
  featureName: string;
  screen: string;
}) => {
  // שליפת המשתמש לפי ID
  const { data: user, error: userError } = await supabase
    .from('users') // ודא שזה שם הטבלה שלך
    .select('role')
    .eq('id', userId)
    .single();
  if (userError) {
    console.error('שגיאה בשליפת המשתמש:', userError.message);
    return;
  }
  // אם המשתמש מנהל – לא לשמור
  if (user?.role === 'manager') {
    return;
  }
  // שמירה לטבלה
  const { error } = await supabase.from('feature_clicks').insert([
    {
      user_id: userId,
      feature_name: featureName,
      screen,
    },
  ]);
  if (error) {
    console.error('שגיאה בשליחת לחיצה:', error.message);
  }
};