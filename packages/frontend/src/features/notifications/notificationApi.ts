import { CreateNotificationPayload } from './NotificationMessage';

export async function createNotification(notification: CreateNotificationPayload) {
  const res = await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });

  if (!res.ok) {
    throw new Error('Failed to create notification');
  }

  return res.json();
}
