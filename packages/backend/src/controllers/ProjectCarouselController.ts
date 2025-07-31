import { Request, Response } from 'express';
import { projectCarouselService } from '../services/ProjectCarouselService';


export const getAllProjectCarousel = async (req: Request, res: Response) => {
  try {
    console.log('GET /api/ProjectCarousel hit');
    const forums = await projectCarouselService.getAllProjectCarousel();
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Carousel' });
  }
};

export const addProjectCarousel = async (req: Request, res: Response) => {
  try {
    const forum = await projectCarouselService.addProjectCarousel(req.body);
    res.status(201).json(forum);
  } catch (error) {
    console.error('Add Error:', error); // הוספת הדפסה לשגיאה האמיתית
    res.status(500).json({ error: 'Failed to add to Carousel ' });
  }
};

export const deleteProjectCarousel= async (req: Request, res: Response) => {
  try {
    await projectCarouselService.deleteProjectCarousel(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete from Carousel' });
  }
};


export const getProjectCarouselByProjectName = async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const forum = await projectCarouselService.getProjectCarouselByProjectName(title);
    if (!forum) {
      return res.status(404).json({ error: 'project not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Carousel by title' });
  }
};


export const updateProjectCarouselPermissions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body; // מצפה לקבל את כל השדות לעדכון

  try {
    const updatedProject = await projectCarouselService.updateProjectCarouselPermissions(id, updates);
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Carousel' });
  }

};
