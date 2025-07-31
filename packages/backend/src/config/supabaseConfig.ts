import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // עדיף להשתמש במפתח Service Role בשרת

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable.');
}

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);