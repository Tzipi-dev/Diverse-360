import { Request, Response } from 'express';
import { TipesCarouselService } from '../services/TipesCarouselService';

export const getAllTipesCarouselSortedByActivity = async (req: Request, res: Response) => {
  try {
    console.log('GET /api/TipesCarousel hit');
    const forums = await TipesCarouselService.getAllTipesCarouselSortedByActivity();
    res.json(forums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Carousel' });
  }
};

export const addTipesCarousel = async (req: Request, res: Response) => {
  try {
    const forum = await TipesCarouselService.addTipesCarousel(req.body);
    res.status(201).json(forum);
  } catch (error) {
    console.error('Add Error:', error);
    res.status(500).json({ error: 'Failed to add to Carousel' });
  }
};

export const deleteTipesCarousel = async (req: Request, res: Response) => {
  try {
    await TipesCarouselService.deleteTipesCarousel(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete from Carousel' });
  }
};

export const getTipesCarouselServiceByExactTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const forum = await TipesCarouselService.getTipesCarouselByExactTitle(title);
    if (!forum) {
      return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Carousel by title' });
  }
};

export const updateTipesCarousel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedForum = await TipesCarouselService.updateTipesCarousel(id, updates);
    res.json(updatedForum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Carousel' });
  }
};
