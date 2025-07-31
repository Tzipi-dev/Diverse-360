import {InformationCarouselModel } from '../models/InformationCarouselModel';
import { supabase } from '../config/supabaseConfig';
import { log } from 'console';

export class InformationCarouselService {
  private readonly tableName = 'InformationCarousel';

  async getAllInformationCarouselSortedByActivity(): Promise<InformationCarouselModel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
    if (error) throw error;
    return data || [];

  }

  async addInformationCarousel(InformationCarouselModel: Omit<InformationCarouselModel, 'id'>): Promise<InformationCarouselModel> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([InformationCarouselModel])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteInformationCarousel(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }


  async getInformationCarouselByExactTitle(title: string): Promise<InformationCarouselModel | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('title', title)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }


  async updateInformationCarousel(id: string, updates: Partial<InformationCarouselModel>): Promise<InformationCarouselModel> {
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

export const informationCarouselService = new InformationCarouselService();
