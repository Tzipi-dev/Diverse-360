import {ProjectCarouselModel } from '../models/ProjectCarouselModel';
import { supabase } from '../config/supabaseConfig';
import { log } from 'console';

export class ProjectCarouselService {
  private readonly tableName = 'projectCarousel';

  async getAllProjectCarousel(): Promise<ProjectCarouselModel[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
    if (error) throw error;
    return data || [];

  }

  async addProjectCarousel(ProjectCarouselModel: Omit<ProjectCarouselModel, 'id'>): Promise<ProjectCarouselModel> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([ProjectCarouselModel])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteProjectCarousel(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }


  async getProjectCarouselByProjectName(title: string): Promise<ProjectCarouselModel | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('title', title)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }


  async updateProjectCarouselPermissions(id: string, updates: Partial<ProjectCarouselModel>): Promise<ProjectCarouselModel> {
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

export const projectCarouselService = new ProjectCarouselService();
