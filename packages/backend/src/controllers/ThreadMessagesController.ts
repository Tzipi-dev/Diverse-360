import { Request, Response } from 'express';

import { io } from '../index';
import { uploadFile } from '../services/supabaseUploadIntoStorageService';
import iconv from 'iconv-lite';
import { threadMessagesService } from '../services/ThreadMessagesSrvice';

// ניקוי שם קובץ ל־URL
function sanitizeFileNameForPath(filename: string): string {
  return filename.normalize("NFKD").replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

/**
 * מוסיף הודעה בת'רד
 */
export const addThreadMessage = async (req: Request, res: Response) => {
  try {
    const { forumMessage_id, sender_id, content } = req.body;

    let file_url: string | null = null;
    let file_name: string | null = null;
console.log("📥 הוספת הודעה לת׳רד:", { forumMessage_id, sender_id, content });
    if (req.file) {
      const file = req.file;

      const decodedName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8');
      console.log("📁 שם מתוקן:", decodedName);

      file_name = decodedName;

      const cleanName = sanitizeFileNameForPath(decodedName);
      const filePath = `thread-files/${Date.now()}-${cleanName}`;
      const uploadResult = await uploadFile('forum-uploads', filePath, file.buffer, file.mimetype);

      file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/forum-uploads/${uploadResult.path}`;
    }

    const newMessage = await threadMessagesService.addThreadMessage({
      forumMessage_id,
      sender_id,
      content,
      file_url: file_url || null,
      file_name: file_name || null,
      send_at: new Date().toISOString(),
      
    });

    io.to(forumMessage_id).emit("threadMessageAdded", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
 console.error("❌ שגיאה בהוספת הודעה לת׳רד:", JSON.stringify(error, null, 2));
  res.status(500).json({ error: error}); // ← חשוב!
}
};

/**
 * מחיקת הודעה בת'רד לפי מזהה
 */
export const deleteThreadMessage = async (req: Request, res: Response) => {
  try {
    const deleted = await threadMessagesService.getThreadMessageById(req.params.id);
    await threadMessagesService.deleteThreadMessage(req.params.id);

    if (deleted) {
      io.to(deleted.forumMessage_id).emit("threadMessageDeleted", { id: deleted.id });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete thread message' });
  }
};

/**
 * שליפת הודעות ת'רד לפי מזהה הודעת פורום
 */
export const getAllThreadMessagesByForumMessageId = async (req: Request, res: Response) => {
  const { forumMessageId } = req.params;
  try {
    const messages = await threadMessagesService.getAllThreadMessagesByForumMessageId(forumMessageId);
    if (!messages) {
      return res.status(404).json({ error: 'No thread messages found' });
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get thread messages' });
  }
};

/**
 * שליפת הודעת ת'רד לפי ID
 */
export const getThreadMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const message = await threadMessagesService.getThreadMessageById(id);
    if (!message) {
      return res.status(404).json({ error: 'Thread message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get thread message' });
  }
};

/**
 * עדכון הודעת ת'רד
 */
export const updateThreadMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await threadMessagesService.updateThreadMessage(id, updates);
    res.json(updated);

    if (updated?.forumMessage_id) {
      io.to(updated.forumMessage_id).emit("threadMessageUpdated", updated);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update thread message' });
  }
};
