// server/services/SavedJobService.ts
import { supabase } from '../config/supabaseConfig'; // ייבוא הקליינט של Supabase
// נתיבים אלה תלויים בפתרון ה-tsconfig.json שיישמת (עם @sharedTypes או נתיב יחסי)
import { SavedJob } from '../models/savedJobsModel'; // זהו ה-MODEL (Type) שלך
import { Job } from '../models/JobModel';        // זהו ה-MODEL (Type) שלך

export class SavedJobService {
    /**
     * מקבל את כל המשרות השמורות עבור משתמש ספציפי מה-DB.
     * @param userId ה-ID של המשתמש.
     * @returns מערך של SavedJob.
     */
    static async getSavedJobsByUserId(userId: string): Promise<SavedJob[]> {
        if (!userId) {
            throw new Error('User ID is required to fetch saved jobs.');
        }
        const { data, error } = await supabase
            .from('saved_jobs') // שם הטבלה שלך ב-Supabase
            .select('*') // בחר את כל העמודות
            .eq('user_id', userId); // סינון לפי user_id

        if (error) {
            console.error('Supabase error fetching saved jobs:', error);
            throw new Error(`Failed to fetch saved jobs: ${error.message}`);
        }
        return data as SavedJob[]; // Supabase מחזיר נתונים שתואמים ל-SavedJob
    }

    /**
     * שומר משרה עבור משתמש ב-DB.
     * @param userId ה-ID של המשתמש.
     * @param jobData כל נתוני המשרה שרוצים לשמור.
     * @returns המשרה השמורה החדשה (כולל ה-ID שנוצר ב-DB).
     */
    static async saveJob(userId: string, jobData: Job): Promise<SavedJob> {
        if (!userId || !jobData || !jobData.id) {
            throw new Error('User ID and valid Job data are required to save a job.');
        }

        // הנתונים שייכנסו לטבלת saved_jobs
        const savedJobEntry = {
            user_id: userId,
            job_id: jobData.id,
            saved_at: new Date().toISOString(), // תאריך שמירה נוכחי
            job_data: jobData, // כל אובייקט המשרה נשמר כ-JSONB
        };

        const { data, error } = await supabase
            .from('saved_jobs') // שם הטבלה שלך ב-Supabase
            .insert(savedJobEntry) // הכנס את הנתונים
            .select('*') // החזר את האובייקט שנוצר במלואו
            .single(); // צפה לאובייקט אחד

        if (error) {
            console.error('Supabase error saving job:', error);
            // טיפול בשגיאת Unique Constraint (אם המשרה כבר שמורה לאותו משתמש)
            if (error.code === '23505') { // קוד שגיאה ל-unique violation ב-PostgreSQL
                throw new Error('Job already saved for this user.');
            }
            throw new Error(`Failed to save job: ${error.message}`);
        }
        return data as SavedJob;
    }

    /**
     * מבטל שמירה של משרה עבור משתמש מה-DB.
     * @param userId ה-ID של המשתמש.
     * @param jobId ה-ID של המשרה לבטל את שמירתה.
     * @returns true אם המשרה נמחקה בהצלחה.
     */
    static async unsaveJob(userId: string, jobId: string): Promise<boolean> {
        if (!userId || !jobId) {
            throw new Error('User ID and Job ID are required to unsave a job.');
        }

        const { error, count } = await supabase
            .from('saved_jobs') // שם הטבלה שלך ב-Supabase
            .delete({ count: 'exact' }) // מבקשים ספירה מדויקת של שורות שנמחקו
            .eq('user_id', userId) // סינון לפי user_id
            .eq('job_id', jobId); // סינון לפי job_id

        if (error) {
            console.error('Supabase error deleting job:', error);
            throw new Error(`Failed to delete job: ${error.message}`);
        }
        return (count || 0) > 0; // אם count גדול מ-0, זה אומר שמשהו נמחק
    }
}