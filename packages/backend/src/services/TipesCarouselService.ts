import {TipesCarouselModel } from '../models/TipesCarouselModel';
import { supabase } from '../config/supabaseConfig';
import { log } from 'console';

export class TipesCarouselServiceClass {
  private readonly tableName = 'TipesCarousel';

async getAllTipesCarouselSortedByActivity(): Promise<TipesCarouselModel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
    if (error) throw error;
    return data || [];

  }

  async addTipesCarousel(TipesCarouselModel: Omit<TipesCarouselModel, 'id'>): Promise<TipesCarouselModel> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([TipesCarouselModel])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteTipesCarousel(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }


  async getTipesCarouselByExactTitle(title: string): Promise<TipesCarouselModel | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('title', title)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }


  async updateTipesCarousel(id: string, updates: Partial<TipesCarouselModel>): Promise<TipesCarouselModel> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

}

export const TipesCarouselService = new TipesCarouselServiceClass();
