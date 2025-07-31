import { Request, Response } from 'express';
import { logoCarouselService } from '../services/LogoCarouselService';


export const getAllLogoCarousel = async (req: Request, res: Response) => {
  try {
    const forums = await logoCarouselService.getAllLogoCarousel();
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Carousel' });
  }
};

export const addLogoCarousel = async (req: Request, res: Response) => {
  try {
    const forum = await logoCarouselService.addLogoCarousel(req.body);
    res.status(201).json(forum);
  } catch (error) {
    console.error('Add Error:', error); // הוספת הדפסה לשגיאה האמיתית
    res.status(500).json({ error: 'Failed to add to Carousel ' });
  }
};

export const deleteLogoCarousel= async (req: Request, res: Response) => {
  try {
    await logoCarouselService.deleteLogoCarousel(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete from Carousel' });
  }
};


export const getLogoCarouselById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const forum = await logoCarouselService.getLogoCarouselById(id);
    if (!forum) {
      return res.status(404).json({ error: 'logo not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Carousel by id' });
  }
};

export const getLogoCarouselByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const forum = await logoCarouselService.getLogoCarouselByName(name);
    if (!forum) {
      return res.status(404).json({ error: 'project not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Carousel by name' });
  }
  
};

export const updateLogoCarousel= async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body; // מצפה לקבל את כל השדות לעדכון

  try {
    const updatedLogo = await logoCarouselService.updateLogoCarousel(id, updates);
    res.json(updatedLogo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Carousel' });
  }
};


