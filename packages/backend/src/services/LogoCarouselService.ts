import {LogoCarouselModel } from '../models/LogoCarouselModel';
import { supabase } from '../config/supabaseConfig';
import { log } from 'console';

export class LogoCarouselService {
  private readonly tableName = 'logoCarousel';

  async getAllLogoCarousel(): Promise<LogoCarouselService[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
    if (error) throw error;
    return data || [];

  }

  async addLogoCarousel(LogoCarouselModel: Omit<LogoCarouselModel, 'id'>): Promise<LogoCarouselModel> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([LogoCarouselModel])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteLogoCarousel(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }


  async getLogoCarouselById(id: string): Promise<LogoCarouselModel | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

    async getLogoCarouselByName(name: string): Promise<LogoCarouselModel | null> {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('name', name)
        .single();
  
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }

    async updateLogoCarousel(id: string, updates: Partial<LogoCarouselModel>): Promise<LogoCarouselModel> {
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

export const logoCarouselService = new LogoCarouselService();
