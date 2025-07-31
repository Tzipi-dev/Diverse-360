import { Request, Response } from 'express';
import { commentService } from '../services/CommentsService';

export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const getCommentsByCourseId = async (req: Request, res: Response) => {
  const { course_id } = req.params;
  try {
    const comments = await commentService.getCommentsByCourseId(course_id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments for course' });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const comment = await commentService.getCommentById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedComment = await commentService.updateComment(id, updatedData);
    res.json(updatedComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update comment' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const newComment = await commentService.createComment(req.body);
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create comment' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await commentService.deleteComment(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete comment' });
  }
};