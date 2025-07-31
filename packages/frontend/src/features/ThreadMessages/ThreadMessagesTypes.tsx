export interface ThreadMessagesTypes {
  id: string;
  forumMessage_id: string;
  sender_id: string;
  content: string;
  send_at: string;
  updated_at: string | null;
  file_url: string | null;
  file_name: string | null;
}