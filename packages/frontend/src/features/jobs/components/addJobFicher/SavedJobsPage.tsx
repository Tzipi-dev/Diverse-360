import React from 'react';
import { useSavedJobs } from './SavedJobsContext';
import JobCard from '../JobCards/JobCard';
import { Bookmark, Trash2 } from 'lucide-react';
import { SavedJob } from '../../../../types/savedJobsTypes'; // וודא שהנתיב נכון לייבוא SavedJob
import { useNavigate } from 'react-router-dom'; // <--- הוסף ייבוא זה

const SavedJobsPage: React.FC = () => {
  const { savedJobs, loading, unsaveJob } = useSavedJobs();
  const navigate = useNavigate(); // <--- הוסף שימוש ב-useNavigate

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <div>טוען משרות שמורות...</div>
      </div>
    );
  }

  // פונקציה לטיפול בלחיצה על "פרטים נוספים"
  const handleDetailsClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`); // <--- נווט לדף פרטי המשרה באמצעות ה-jobId
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <Bookmark width={24} height={24} color="#2563eb" />
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          משרות שמורות ({savedJobs.length})
        </h1>
      </div>

      {savedJobs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <Bookmark width={48} height={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#4b5563', marginBottom: '8px' }}>אין משרות שמורות</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            התחילי לשמור משרות מעניינות כדי לחזור אליהן מאוחר יותר
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '20px'
        }}>
          {savedJobs.map((savedJob: SavedJob) => (
            savedJob.job_data ? (
              <div key={savedJob.id} style={{ position: 'relative' }}>
                <JobCard
                  job={savedJob.job_data}
                  // <--- זה התיקון! העבר את הפונקציה handleDetailsClick
                  onDetailsClick={() => handleDetailsClick(savedJob.job_data.id)}
                  onUploadCV={() => { /* לוגיקה לטיפול בהעלאת קורות חיים */ }}
                />
                <button
                  onClick={() => unsaveJob(savedJob.job_id)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                  title="הסר מרשימת השמורים"
                >
                  <Trash2 width={14} height={14} color="#ef4444" />
                </button>
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  נשמר ב-{new Date(savedJob.saved_at).toLocaleDateString('he-IL')}
                </div>
              </div>
            ) : (
              <div key={savedJob.id} style={{ padding: '10px', border: '1px dashed red', color: 'red' }}>
                שגיאה: פרטי משרה חסרים עבור משרה שמורה זו.
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;