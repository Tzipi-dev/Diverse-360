export interface ThreadMessages {
  id?: string; // UUID, לא חובה לשלוח כי Supabase מייצר
  sender_id: string; // UUID
  content?: string; // TEXT
  file_url?: string | null; // TEXT
  file_name?: string |null; // TEXT
  send_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
  forumMessage_id: string; // UUID
}
