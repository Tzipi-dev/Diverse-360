import { Job } from './JobModel'; // וודאי שהנתיב נכון

export interface SavedJob {
    id: string;         // UUID מה-DB (gen_random_uuid)
    user_id: string;    // UUID של המשתמש ששמר את המשרה
    job_id: string;     // ID של המשרה שנשמרה
    saved_at: string;   // תאריך וזמן השמירה (timestamptz) - כ-string כי מגיע מה-DB
    job_data: Job;      // כל אובייקט המשרה, כפי ששמרנו אותו ב-jsonb
}

// זהו ה-Context Type שצד הלקוח שלך מצפה לו
export interface SavedJobsContextType {
    savedJobs: SavedJob[];
    saveJob: (job: Job) => Promise<void>;
    unsaveJob: (jobId: string) => Promise<void>;
    isJobSaved: (jobId: string) => boolean;
    loading: boolean;
}