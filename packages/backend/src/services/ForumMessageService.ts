
import { supabase } from '../config/supabaseConfig';
import { ForumMessage } from '../models/ForumMessage';
import { uploadFileToBucket } from './uploadService';
import { deleteFileFromBucket } from './uploadService';

export class ForumMessageService {

  private readonly tableName = 'forumMessages';

  //Adds a new forum message.
  async addForumMessage(
    message: Omit<ForumMessage, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ForumMessage> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([message])
      .select()
      .single();

    console.log("insert message result", { data, error });

    if (error) throw error;

    const { error: forumError } = await supabase
      .from("forum")
      .update({
        updated_at: new Date().toISOString(),
        last_message_time: new Date().toISOString(),
        last_message_sender_id: message.sender_id,
      })
      .eq("id", message.forum_id);
    if (forumError) throw forumError;

    // Reset was_opened for all who viewed
    const { error: viewUpdateError } = await supabase
      .from("forumView")
      .update({ was_opened: false })
      .eq("forum_id", message.forum_id)
      .neq("user_id", message.sender_id);

    if (viewUpdateError) throw viewUpdateError;

    return data;
  }

  //Deletes a forum message by its ID.
async deleteForumMessage(id: string): Promise<void> {
const message = await this.getForumMessagesById(id);
const fullUrl = message?.file_url;
if (fullUrl?.includes("forum-message-audio")) {
  const filePath = fullUrl?.split('/forum-message-audio/')[1]; 
if (filePath) {
  await deleteFileFromBucket('forum-message-audio', filePath);
}
}
else{
const filePath = fullUrl?.split('/forum-uploads/')[1]; 
if (filePath) {
  await deleteFileFromBucket('forum-uploads', filePath);
}
}
  const { error } = await supabase
    .from(this.tableName)
    .update({ is_deleted: true })
    .eq("id", id);
  if (error) throw error;
}

  // Retrieves all forum messages by forum ID.
  async getAllForumMessagesByForumId(forumId: string): Promise<ForumMessage[] | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("forum_id", forumId);
    if (error) throw error;
    return data || null;
  }

  // Retrieves a forum message by its ID.
  async getForumMessagesById(id: string): Promise<ForumMessage | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data || null;
  }

  // Updates a forum message by its ID.
async updateForumMessage(id: string, updates: Partial<ForumMessage>): Promise<ForumMessage> {
  // הוסף את השדה is_edited עם הערך true
  const updatedData = { ...updates, is_Edited: true };

  const { data, error } = await supabase
    .from(this.tableName)
    .update(updatedData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
}

export const forumMessageService = new ForumMessageService();

