import { Forum, ForumPermissions, ForumView } from '../models/ForumModel';
import { supabase } from '../config/supabaseConfig';
import { log } from 'console';

export class ForumService {
  private readonly tableName = 'forum';

  // Get all forums sorted by activity (last message and update time)
  async getAllForumsSortedByActivity(
    limit: number,
    offset: number,
    userId: string,
    userRole: string,
    userAcademicCycleId?: string
  ): Promise<{ data: Forum[]; total: number }> {

    if (userRole === "manager") {
      const { data, count, error } = await supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .order("last_message_time", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("שגיאה בטעינת פורומים (manager):", error.message, error.details);
        throw error;
      }

      return {
        data: data || [],
        total: count ?? 0,
      };
    }

    const orConditions: string[] = [];

    orConditions.push(`Forum_Permissions->>isPublic.eq."true"`);

    if (userId) {
      const userIdJsonArray = JSON.stringify([userId]);
      orConditions.push(`Forum_Permissions->allowedUserIds.cs.${userIdJsonArray}`);
    }

    if (userAcademicCycleId) {
      orConditions.push(`Forum_Permissions->>academicCycleId.eq.${userAcademicCycleId}`);
    }

    const orFilter = orConditions.join(",");

    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .order("last_message_time", { ascending: false })
      .range(offset, offset + limit - 1)
      .or(orFilter);

    if (error) {
      console.error("שגיאה בטעינת פורומים (user):", error.message, error.details);
      throw error;
    }

    return {
      data: data || [],
      total: count ?? 0,
    };
  }

  // Add a new forum to the database
  async addForum(forum: Omit<Forum, 'id' | 'created_at' | 'updated_at' | 'last_message_time'>): Promise<Forum> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([forum])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteForum(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .match({ id });

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
  }

  // Get a single forum that exactly matches the given title
  async getForumByExactTitle(title: string): Promise<Forum | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('title', title)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  // Update forum fields (like permissions) by forum ID
  async updateForumPermissions(id: string, updates: Partial<Forum>): Promise<Forum> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    console.log(data, error);
    if (error) throw error;
    return data;
  }

  // Mark a forum as viewed by a user (upsert into forumView table)
  async markForumAsViewed(forum_id: string, user_id: string,
    viewed_at: string, was_opened: boolean) {
    const { error } = await supabase
      .from("forumView")
      .upsert([{ forum_id, user_id, viewed_at, was_opened }], {
        onConflict: "forum_id,user_id",
      });
    if (error) throw error;
  }

  // Get a list of forum IDs that the user has viewed
  async getViewedForumsByUser(user_id: string) {
    const { data, error } = await supabase
      .from("forumView")
      .select("forum_id")
      .eq("user_id", user_id);

    if (error) throw error;
    return data?.map(view => view.forum_id) || [];
  }
  
  // Get full forumView objects that the user has viewed
  async getViewedForumObjectsByUser(user_id: string) {
    const { data, error } = await supabase
      .from("forumView")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;
    return data || [];
  }
}

export const forumService = new ForumService();
