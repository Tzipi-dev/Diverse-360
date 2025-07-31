export type ForumPermissions = {
  isPublic: boolean;
  allowedUserIds: string[];
  academicCycleId: string;
};

export interface Forum {
  id: string;
  title: string;
  icon: string;
  description: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
  Forum_Permissions: ForumPermissions;
  last_message_time?: string;
  last_message_sender_id?: string;
};
export interface ForumView {
  id: string;
  forum_id: string;
  user_id: string;
  viewed_at: string;
  was_opened?: boolean;
}
