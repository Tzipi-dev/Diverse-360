import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectItemService';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProjectService.deleteProjectById(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = {
      ...req.body,
      isActive: req.body.isActive === 'true',
    };

    const file = req.file;
    const created = await ProjectService.createProject(projectData, file);
    res.status(201).json(created);
  } catch (error) {
    console.error('שגיאה ביצירת פרויקט:', error);
    res.status(500).json({ error: 'שגיאה ביצירת פרויקט', details: error instanceof Error ? error.message : error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const projectData = {
      ...req.body,
      isActive: req.body.isActive === 'true',
    };

    const file = req.file;
    const updated = await ProjectService.updateProject(id, projectData, file);
    res.status(200).json(updated);
  } catch (error) {
    console.error('❌ שגיאה בעדכון פרויקט:', error);
    res.status(500).json({ error: 'שגיאה בעדכון פרויקט', details: error instanceof Error ? error.message : error });
  }
};
