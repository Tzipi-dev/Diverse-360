export interface Notification {
  id: string;
  title: string;
  content: string;
  audience_type: 'כל משתמשי המערכת' | 'משתמש ספציפי' | 'cycle' | 'class';
  audience_value?: string | null;
  channels: string[];
  channel_values?: Record<string, string>;
  dynamic_variables?: string[];
  send_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationFormData {
  title: string;
  content: string;
  audience_type?: 'כל משתמשי המערכת' | 'משתמש ספציפי' | 'cycle' | 'class';
  audience_value: string | null;
  channels: string[];
  send_at?: string | null;
}


export type CreateNotificationPayload = Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'channel_values' | 'dynamic_variables'>;

export const targetAudienceTypes = ['כל משתמשי המערכת', 'משתמש ספציפי', 'cycle', 'class'] as const;
export const notificationChannels = ['email', 'outlook', 'sms', 'whatsapp', 'telegram', 'slack', 'push', 'forum'] as const;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}
