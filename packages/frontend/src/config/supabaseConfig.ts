// // import dotenv from 'dotenv';
// // dotenv.config();

// // const supabaseUrl = process.env.SUPABASE_URL!;
// // const supabaseKey = process.env.SUPABASE_KEY!;
// // export const supabase = createClient(supabaseUrl, supabaseKey);
// // import { createClient } from '@supabase/supabase-js';

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';//לטפל בזה

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;


if (!supabaseUrl) {
  throw new Error('Missing REACT_APP_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing REACT_APP_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);