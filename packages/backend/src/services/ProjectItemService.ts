import { supabase } from '../config/supabaseConfig';
import { Project } from '../models/ProjectItemModel';
import { datetimeRegex, z } from 'zod';
import { v4 as uuid } from 'uuid';

const tableName = 'projectitems';

const ProjectSchema = z.object({
  title: z.string().min(1, "כותרת נדרשת"),
  description: z.string().optional(),
  linkUrl: z.string().url("כתובת לא חוקית").optional().nullable(),
  isActive: z.boolean(),
});

const ProjectUpdateSchema = ProjectSchema.partial();

export const ProjectService = {
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('❌ שגיאה בשליפה:', error);
      throw new Error('שגיאה בשליפת פרויקטים');
    }

    return data || [];
  },

  async deleteProjectById(id: string): Promise<void> {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ שגיאה במחיקה:', error);
      throw new Error('שגיאה במחיקת פרויקט');
    }
  },

  async updateProject(id: string, updatedData: any, file?: Express.Multer.File): Promise<Project[]> {
    const validation = ProjectUpdateSchema.safeParse(updatedData);
    if (!validation.success) {
      console.error("❌ שגיאת ולידציה בעדכון:", validation.error.flatten().fieldErrors);
      throw new Error("נתונים לעדכון לא תקינים");
    }

    let imageUrl = updatedData.imageUrl;

    if (file) {
      const filePath = `images/${Date.now()}_${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });
      console.log(`📤 מעלה קובץ (עדכון): ${filePath}`);
      if (uploadError) {
        console.error('❌ שגיאה בהעלאת קובץ:', uploadError);
        throw new Error('שגיאה בהעלאת תמונה');
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from(tableName)
      .update({ ...validation.data, imageUrl })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ שגיאה בעדכון פרויקט:', error);
      throw new Error(error.message);
    }

    return data as Project[];
  },

  async createProject(body: any, file?: Express.Multer.File): Promise<Project> {
    const validation = ProjectSchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ שגיאת ולידציה:', validation.error.flatten().fieldErrors);
      throw new Error('נתונים לא תקינים');
    }

    const { title, description, linkUrl, isActive } = validation.data;

    let imageUrl = '';
    if (file) {
      const filePath = `images/${Date.now()}_${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      console.log(`📤 מעלה קובץ: ${filePath}`);
      if (uploadError) {
        console.error('❌ שגיאה בהעלאת קובץ:', uploadError);
        throw new Error('שגיאה בהעלאת תמונה');
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([{ id: uuid(), title, description, linkUrl,createdAt: new Date(), isActive, imageUrl }])
      .select();

    if (error) {
      console.error('❌ שגיאה בהכנסת פרויקט:', error);
      throw new Error('שגיאה בהכנסת פרויקט');
    }

    return data?.[0];
  }

}
