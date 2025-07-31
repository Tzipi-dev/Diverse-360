import { Request, Response } from 'express';
import { forumService } from '../services/ForumService';
import { io } from "../index"

export const getAllForumsSortedByActivity = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const userId = req.query.user_id as string;
    const userRole = req.query.userRole as string;

    const result = await forumService.getAllForumsSortedByActivity(limit, offset, userId,userRole);
    res.json(result);
  } catch (error) {
    console.error("שגיאה בקבלת פורומים:", error);
    res.status(500).json({ message: "שגיאה בשרת", error });
  }
}

export const addForum = async (req: Request, res: Response) => {
  try {
    const forum = await forumService.addForum(req.body);
    res.status(201).json(forum);
    io.emit("forumCreated", forum);

  } catch (error) {
    res.status(500).json({ error: 'Failed to add forum' });
  }
};

export const deleteForum = async (req: Request, res: Response) => {
  try {
    await forumService.deleteForum(req.params.id,req.params.userId);
    io.emit("forumDeleted",{id:req.params.id});
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete forum' });
  }
};

export const getForumByExactTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const forum = await forumService.getForumByExactTitle(title);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get forum by title' });
  }
};

export const updateForumPermissions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedForum = await forumService.updateForumPermissions(id, updates);
    io.emit("forumUpdated", updatedForum);
    res.json(updatedForum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update forum' });
  }
};

export const markViewed = async (req: Request, res: Response) => {
  const { forum_id, user_id, viewed_at, was_opened } = req.body;
  try {
    await forumService.markForumAsViewed
      (forum_id, user_id, viewed_at, was_opened);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getViewedForumsByUser = async (req: Request, res: Response) => {
  const user_id = req.query.user_id as string;
  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }
  try {
    console.log("User ID received for viewed forums:", user_id);
    const viewedForums = await forumService.getViewedForumObjectsByUser(user_id);
    console.log("Viewed forums fetched:", viewedForums);
    res.json(viewedForums);
  } catch (error) {
    res.status(500).json({ error: "Failed to get viewed forums" });
  }
}

