import { Request, Response } from 'express';
import { informationCarouselService } from '../services/InformationCarouselService';


export const getAllInformationCarouselSortedByActivity = async (req: Request, res: Response) => {
  try {
    const forums = await informationCarouselService.getAllInformationCarouselSortedByActivity();
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Carousel' });
  }
};

export const addInformationCarousel = async (req: Request, res: Response) => {
  try {
    const forum = await informationCarouselService.addInformationCarousel(req.body);
    res.status(201).json(forum);
  } catch (error) {
    console.error('Add Error:', error); // הוספת הדפסה לשגיאה האמיתית
    res.status(500).json({ error: 'Failed to add to Carousel ' });
  }
};

export const deleteInformationCarousel = async (req: Request, res: Response) => {
  try {
    await informationCarouselService.deleteInformationCarousel(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete from Carousel' });
  }
};


export const getInformationCarouselServiceByExactTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const forum = await informationCarouselService.getInformationCarouselByExactTitle(title);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Carousel by title' });
  }
};


export const updateInformationCarousel= async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body; // מצפה לקבל את כל השדות לעדכון

  try {
    const updatedForum = await informationCarouselService.updateInformationCarousel(id, updates);
    res.json(updatedForum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Carousel' });
  }

};
