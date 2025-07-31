import { Request, Response } from 'express';
import { forumMessageService } from '../services/ForumMessageService';
import { io } from '../index'; import { uploadFile } from '../services/supabaseUploadIntoStorageService';
import iconv from 'iconv-lite';
import { uploadFileToBucket } from '../services/uploadService';


function sanitizeFileNameForPath(filename: string): string {
  return filename.normalize("NFKD").replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

/**
 * Controller for handling forum message operations.
 * This controller provides endpoints to add, delete, update, and retrieve forum messages.
*/

export const addForumMessage = async (req: Request, res: Response) => {
  try {
    const { forum_id, sender_id, content } = req.body;

    let file_url: string | null = null;
    let file_name: string | null = null;
    let file_type: string | null = null;

    if (req.file) {
      const file = req.file;

      const decodedName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8');
      console.log("📁 שם מתוקן:", decodedName);

      file_name = decodedName;
      file_type = file.mimetype;

      const cleanName = sanitizeFileNameForPath(decodedName);
      const filePath = `forum-files/${Date.now()}-${cleanName}`;
      const uploadResult = await uploadFile('forum-uploads', filePath, file.buffer, file.mimetype);
      console.log(uploadResult) 
      file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/forum-uploads/${filePath}`;

    }

    const newMessage = await forumMessageService.addForumMessage({
      forum_id,
      sender_id,
      content,
      file_url,
      file_name,
      file_type,
      sent_at: new Date().toISOString(),
      ammuntOffThteadMessegase: 0, // Assuming this is initialized to 0
    });
    io.emit("newMessage", newMessage);

    res.status(201).json(newMessage);

  } catch (error) {
    console.error("❌ שגיאה בהעלאת הודעה:", error);
    res.status(500).json({ error: 'Failed to add forum message' });
  }
};
/**
 * Controller for handling forum message deletion.
 */
export const deleteForumMessage = async (req: Request, res: Response) => {
  try {
    const deletedMessage = await forumMessageService.getForumMessagesById(req.params.id); // קח את ההודעה לפני המחיקה
    await forumMessageService.deleteForumMessage(req.params.id);

    if (deletedMessage) {
      io.emit("messageDeleted", { id: deletedMessage.id, forum_id: deletedMessage.forum_id });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete forum message' });
  }
};

/**
 * Controller for retrieving all forum messages by forum ID.
 */
export const getAllForumMessagesByForumId = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const messages = await forumMessageService.getAllForumMessagesByForumId(id);
    if (!messages) {
      return res.status(404).json({ error: 'No messages found for this forum' });
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages by forum ID' });
  }
};

/**
 * Controller for retrieving a forum message by ID.
 */
export const getForumMessagesById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const forum = await forumMessageService.getForumMessagesById(id);
    if (!forum) {
      return res.status(404).json({ error: 'Forum message not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get forum message by ID' });
  }
};

/**
 * Controller for updating a forum message by ID.
 */
export const updateForumMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedForum = await forumMessageService.updateForumMessage(id, updates);
    res.json(updatedForum);

    if (updatedForum?.forum_id) {
      io.emit("messageUpdated", updatedForum);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update forum message' });
  }
}

/**
 * העלאת אודיו בלבד → לפיצ'ר של הקלטת הודעה
 */
export const uploadAudio = async (req: Request, res: Response) => {
  try {
    const { forum_id, sender_id } = req.body;
    const file = req.file!;
    const decodedName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8');
    const cleanName = sanitizeFileNameForPath(decodedName);
    const filePath = `forum-audio/${Date.now()}-${cleanName}`;
    const savedPath = await uploadFileToBucket('forum-message-audio', file.buffer, filePath);
    const file_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/forum-message-audio/${savedPath}`;
    const file_name = decodedName;
    const file_type = file.mimetype;
    const newMessage = await forumMessageService.addForumMessage({
      forum_id,
      sender_id,
      content: "",
      file_url,
      file_name,
      file_type,
      sent_at: new Date().toISOString(),
      ammuntOffThteadMessegase: 0, // Assuming this is initialized to 0
    });
    io.emit("newMessage", newMessage)
    res.status(201).json(newMessage);
    console.log("🎤 קובץ:", req.file);
    console.log("📨 נתוני גוף הבקשה:", req.body);
  } catch (err) {
    console.error("❌ שגיאה בהעלאת אודיו:", err);
    res.status(500).json({ error: 'העלאת הקובץ נכשלה', details: err });
  }
};


