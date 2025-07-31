export interface AuthEvent {
  user_id: string;
  event_type: 'login' | 'logout';
  created_at?: string; // Optional, Supabase sets it automatically
}
