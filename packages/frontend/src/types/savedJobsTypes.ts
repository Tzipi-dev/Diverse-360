// import { Job } from './jobsTypes';

// export interface SavedJob {
//   id: string;
//   jobId: string;
//   userId: string;
//   saved_At: Date;
//   job: Job; 
// }

// export interface SavedJobsContextType {
//   savedJobs: SavedJob[];
//   saveJob: (job: Job) => void;
//   unsaveJob: (jobId: string) => void;
//   isJobSaved: (jobId: string) => boolean;
//   loading: boolean;
// }

import { Job } from './jobsTypes'; // וודאי שהנתיב נכון

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