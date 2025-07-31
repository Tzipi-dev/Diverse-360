
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import { Job } from '../../../../types/jobsTypes';
import { SavedJob, SavedJobsContextType } from '../../../../types/savedJobsTypes';

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined);

interface SavedJobsProviderProps {
  children: ReactNode;
  userId: string | null;
}

export const SavedJobsProvider: React.FC<SavedJobsProviderProps> = ({ children, userId }) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("SavedJobsContext.tsx - Received userId (at provider start):", userId);

  const loadSavedJobs = useCallback(async () => {
    if (!userId) {
      console.log("loadSavedJobs: No userId, skipping fetch.");
      setSavedJobs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs/${userId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        if (response.status === 500 && errorData.message && errorData.message.includes('invalid input syntax for type uuid')) {
          console.error(`Invalid UUID provided for userId: ${userId}. This user might not have a valid ID.`);
          setSavedJobs([]);
          alert('שגיאה: זיהוי משתמש לא תקין. ייתכן שאין לך מזהה משתמש חוקי. אנא נסה להתחבר מחדש.');
        } else {
          throw new Error(`שגיאת HTTP בטעינת משרות שמורות: ${response.status} - ${errorData.message || 'שגיאה לא ידועה'}`);
        }
      } else {
        const data: SavedJob[] = await response.json();
        setSavedJobs(data);
      }
    } catch (error) {
      console.error('שגיאה בטעינת משרות שמורות:', error);
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]); // תלויות של loadSavedJobs

  // <--- הוסף את ה-useEffect הזה! ---
  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]); // הפעל מחדש כאשר loadSavedJobs משתנה (כלומר, כאשר userId משתנה)
  // -----------------------------

  const saveJob = useCallback(async (job: Job) => {
    if (!userId) {
      console.warn('Cannot save job: No user ID provided. Please log in.');
      alert('כדי לשמור משרות, עליך להתחבר או להירשם עם מזהה משתמש חוקי.');
      return;
    }

    const existingSavedJob = savedJobs.find(saved => saved.job_id === job.id && saved.user_id === userId);
    if (existingSavedJob) {
      console.warn('Job already saved for this user:', job.id);
      return;
    }

    try {
      const payload = {
        userId: userId,
        jobData: job
      };

      const response = await fetch('http://localhost:3001/api/saved-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        if (response.status === 500 && errorData.message && errorData.message.includes('invalid input syntax for type uuid')) {
          throw new Error(`Invalid UUID provided for userId: ${userId}. Please ensure user ID is a valid UUID.`);
        } else if (response.status === 409) {
          throw new Error('המשרה כבר שמורה עבור משתמש זה.');
        }
        throw new Error(`שגיאת HTTP בשמירת משרה: ${response.status} - ${errorData.message || 'שגיאה לא ידועה'}`);
      }

      const newSavedJob: SavedJob = await response.json();
      setSavedJobs(prev => [...prev, newSavedJob]);
      console.log('Job saved successfully:', newSavedJob);

    } catch (error) {
      console.error('שגיאה בשמירת משרה:', error);
      alert(`שגיאה בשמירת המשרה: ${(error as Error).message}`);
    }
  }, [userId, savedJobs]);

  const unsaveJob = useCallback(async (jobId: string) => {
    if (!userId) {
      console.warn('Cannot unsave job: No user ID provided.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs/${userId}/${jobId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        if (response.status === 500 && errorData.message && errorData.message.includes('invalid input syntax for type uuid')) {
          throw new Error(`Invalid UUID provided for userId: ${userId}. Please ensure user ID is a valid UUID.`);
        }
        throw new Error(`שגיאת HTTP במחיקת משרה: ${response.status} - ${errorData.message || 'שגיאה לא ידועה'}`);
      }

      setSavedJobs(prev => prev.filter(savedJob => savedJob.job_id !== jobId));
      console.log('Job unsaved successfully:', jobId);

    } catch (error) {
      console.error('שגיאה במחיקת משרה:', error);
      alert(`שגיאה במחיקת המשרה: ${(error as Error).message}`);
    }
  }, [userId]);

  const isJobSaved = useCallback((jobId: string): boolean => {
    // וודא ש-userId קיים לפני השוואה
    if (!userId) return false;
    return savedJobs.some(savedJob => savedJob.job_id === jobId && savedJob.user_id === userId);
  }, [savedJobs, userId]);

  const contextValue = React.useMemo(() => ({
    savedJobs,
    saveJob,
    unsaveJob,
    isJobSaved,
    loading
  }), [savedJobs, saveJob, unsaveJob, isJobSaved, loading]);


  return (
    <SavedJobsContext.Provider value={contextValue}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within SavedJobsProvider');
  }
  return context;
};
