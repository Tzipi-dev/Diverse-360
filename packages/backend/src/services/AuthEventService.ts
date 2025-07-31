import { supabase } from '../config/supabaseConfig';
import { AuthEvent } from '../models/AuthEventModel';

export const logAuthEvent = async (event: AuthEvent): Promise<void> => {

  const { error } = await supabase.from('auth_events').insert([event]);
  if (error) {
   
    throw new Error(`Error logging auth event: ${error.message}`);
  }
};

