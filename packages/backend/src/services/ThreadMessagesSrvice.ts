import { supabase } from "../config/supabaseConfig";
import { ThreadMessages } from "../models/ThreadMessages";
export class ThreadMessagesService {
  private readonly tableName = "ThreadMessages";
  // הוספת הודעה חדשה
  async addThreadMessage(
    message: Omit<ThreadMessages, "id" | "updated_at">
  ): Promise<ThreadMessages> {
    console.log(":arrow_right: addThreadMessage input:", message);
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([message])
        .select()
        .single();
      if (error) {
        console.error(":x: Supabase insert error:", error);
        throw error;
      }
      if (!data) throw new Error("No data returned from insert");
      return data;
    } catch (err) {
      console.error(":x: addThreadMessage failed:", err);
      throw err;
    }
  }
  // מחיקת הודעה לפי מזהה
  async deleteThreadMessage(id: string): Promise<void> {
    console.log(":wastebasket: deleteThreadMessage id:", id);
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("id", id);
      if (error) {
        console.error(":x: deleteThreadMessage error:", error);
        throw error;
      }
    } catch (err) {
      console.error(":x: deleteThreadMessage failed:", err);
      throw err;
    }
  }
  // שליפת כל ההודעות לפי מזהה הודעת פורום
  async getAllThreadMessagesByForumMessageId(
    forumMessageId: string
  ): Promise<ThreadMessages[] | null> {
    console.log(":mag: getAllThreadMessagesByForumMessageId:", forumMessageId);
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("forumMessage_id", forumMessageId)
        .order("send_at", { ascending: true });
      if (error) {
        console.error(":x: getAllThreadMessages error:", error);
        throw error;
      }
      return data || null;
    } catch (err) {
      console.error(":x: getAllThreadMessagesByForumMessageId failed:", err);
      throw err;
    }
  }
  // שליפת הודעה לפי מזהה
  async getThreadMessageById(id: string): Promise<ThreadMessages | null> {
    console.log(":mag_right: getThreadMessageById:", id);
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(":x: getThreadMessageById error:", error);
        throw error;
      }
      return data || null;
    } catch (err) {
      console.error(":x: getThreadMessageById failed:", err);
      throw err;
    }
  }
  // עדכון הודעה לפי מזהה
  async updateThreadMessage(
    id: string,
    updates: Partial<ThreadMessages>
  ): Promise<ThreadMessages> {
    console.log(":memo: updateThreadMessage id:", id, "updates:", updates);
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error(":x: updateThreadMessage error:", error);
        throw error;
      }
      if (!data) throw new Error("No data returned from update");
      return data;
    } catch (err) {
      console.error(":x: updateThreadMessage failed:", err);
      throw err;
    }
  }
}
export const threadMessagesService = new ThreadMessagesService();






