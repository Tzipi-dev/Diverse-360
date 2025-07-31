export interface ForumMessage {
  id: string;
  forum_id: string;
  sender_id: string;
  content: string;
  sent_at: string;
  updated_at: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type:string | null;
  ammuntOffThteadMessegase: number;
   is_deleted?: boolean;
   is_Edited?: boolean;
}

