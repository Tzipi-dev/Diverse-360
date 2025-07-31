import React, { useState, useRef, useEffect } from 'react';
import {
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
  ResumeAnalysisResult,
} from '../resumeApi';
import { Job } from '../../../types/jobsTypes';
import { UploadCloud, Sparkles, X } from 'lucide-react'; // ייבוא אייקונים חדשים

interface ResumeMatchModalProps {
  onClose: () => void;
  onJobsSuggested: (jobs: Job[]) => void;
}

const ResumeMatchModal: React.FC<ResumeMatchModalProps> = ({ onClose, onJobsSuggested }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null); 
  const resultRef = useRef<HTMLDivElement>(null);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]); 

  const [uploadResume] = useUploadResumeMutation();
  const [analyzeResume] = useAnalyzeResumeMutation();

  const fileInputRef = useRef<HTMLInputElement>(null); // רפרנס ל-input file

  useEffect(() => {
    if (analyzeSuccess && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analyzeSuccess]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setAnalyzeSuccess(false);
      setError(null);
      setAnalysisResult(null); 
      setMatchedJobs([]); 
    }
  };

  const handleAnalyzeAndMatch = async () => {
    if (!selectedFile) {
      setError('נא לבחור קובץ');
      return;
    }

    setUploading(true); 
    setAnalyzing(true); 
    setError(null);
    setUploadSuccess(false);
    setAnalyzeSuccess(false);
    setMatchedJobs([]); 
    setAnalysisResult(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      const genericJobId = "00000000-0000-0000-0000-000000000000"; 
      uploadFormData.append('job_id', genericJobId); 

      const uploadRes = await uploadResume(uploadFormData).unwrap();
      setUploadSuccess(true);
      console.log('File uploaded successfully:', uploadRes.file_path);

      // ** תיקון כאן: בדיקה אם file_path קיים לפני פיצול **
      if (!uploadRes.file_path) {
        throw new Error("נתיב הקובץ שהועלה אינו זמין.");
      }
      const pathParts = uploadRes.file_path.split('/');
      const fileNameWithExtension = pathParts[pathParts.length - 1];
      const resumeId = fileNameWithExtension.split('.')[0];
      
      if (!resumeId) {
          throw new Error("לא ניתן לחלץ מזהה קורות חיים מהנתיב.");
      }
      console.log('Extracted Resume ID:', resumeId);

      const analyzeFormData = new FormData();
      analyzeFormData.append('file', selectedFile);
      analyzeFormData.append('resumeId', resumeId); 

      const analysisRes = await analyzeResume(analyzeFormData).unwrap();
      setAnalysisResult(analysisRes.analysis); 
      setMatchedJobs(analysisRes.matchedJobs); 
      setAnalyzeSuccess(true);

      onJobsSuggested(analysisRes.matchedJobs); // העברת המשרות המותאמות לרכיב האב

    } catch (err) {
      console.error(err);
      setError('שגיאה בתהליך הניתוח וההתאמה. אנא וודא שהקובץ תקין.');
      if ((err as any).originalStatus) {
          setError(`שגיאה: ${(err as any).originalStatus} - ${(err as any).data?.message || JSON.stringify((err as any).data)}`);
      }
    }

    setUploading(false);
    setAnalyzing(false);
  };

  // פונקציה להעלאה בלבד (לא בשימוש ישיר בכפתור כרגע, אבל נשארת ליתר ביטחון)
  const handleUploadOnly = async () => { 
    if (!selectedFile) {
      setError('יש לבחור קובץ');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const genericJobId = "00000000-0000-0000-0000-000000000000"; 
      formData.append('job_id', genericJobId); 

      await uploadResume(formData).unwrap();
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      setError('שגיאה בהעלאת הקובץ');
    }

    setUploading(false);
  };

  return (
    <div style={{ 
      padding: '2rem', // הגדלנו פדינג
      maxWidth: '700px', 
      margin: '0 auto', 
      textAlign: 'center', 
      direction: 'rtl',
      background: 'linear-gradient(145deg, #ffffff, #f0f0f0)', // גרדיאנט רקע
      borderRadius: '20px', // פינות יותר מעוגלות
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)', // צל כבד יותר
      position: 'relative',
      border: '1px solid #e0e0e0' // מסגרת עדינה
    }}>
      <button 
        onClick={onClose} 
        style={{ 
          position: 'absolute', 
          top: '20px', // מיקום מותאם
          right: '20px', // מיקום מותאם
          background: 'rgba(100, 60, 150, 0.1)', // רקע סגול בהיר
          border: 'none', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          fontSize: '1.5rem', 
          cursor: 'pointer',
          color: '#442063', // צבע סגול כהה
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <X size={20} /> {/* אייקון X */}
      </button>
      <h2 style={{ 
        color: '#442063', // סגול כהה
        marginBottom: '2rem', // הגדלנו מרווח
        fontSize: '2rem', // גודל כותרת גדול יותר
        fontWeight: '700', // מודגש יותר
        textShadow: '1px 1px 2px rgba(0,0,0,0.05)' // צל קל לכותרת
      }}>
        התאמת משרות לפי קורות חיים
      </h2>

      <div style={{ 
        marginBottom: '2rem', // מרווח גדול יותר
        border: '2px dashed #b19cd9', // מסגרת מקווקוות סגולה
        padding: '1.5rem', // פדינג גדול יותר
        borderRadius: '15px', // פינות מעוגלות יותר
        background: '#f9f5ff', // רקע סגול בהיר מאוד
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)' // צל פנימי עדין
      }}>
        <h4 style={{ 
          color: '#5b2d7a', // סגול ביניים
          marginBottom: '1.5rem', // מרווח גדול יותר
          fontSize: '1.25rem', // גודל כותרת משנה
          fontWeight: '600'
        }}>
          העלה את קורות החיים שלך (PDF/DOCX)
        </h4>
        
        <input 
          type="file" 
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          ref={fileInputRef} // חיבור לרפרנס
          style={{ display: 'none' }} // הסתרת האינפוט המקורי
        />
        <button
          onClick={() => fileInputRef.current?.click()} // כפתור מותאם אישית לפתיחת בורר קבצים
          style={{
            backgroundColor: '#6a0dad', // סגול כהה יותר
            color: 'white',
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
            boxShadow: '0 4px 15px rgba(106,13,173,0.3)', // צל לכפתור
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: selectedFile ? '1rem' : '0' // מרווח אם נבחר קובץ
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#5b009e'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(106,13,173,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#6a0dad'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(106,13,173,0.3)'; }}
        >
          <UploadCloud size={20} />
          {selectedFile ? 'קובץ נבחר: ' + selectedFile.name : 'בחר קובץ קורות חיים'}
        </button>
        {selectedFile && !uploading && !analyzing && ( // הצג רק אם נבחר קובץ ואין תהליך
          <p style={{ color: '#5b2d7a', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {selectedFile.name}
          </p>
        )}

        <button
          onClick={handleAnalyzeAndMatch}
          disabled={analyzing || uploading || !selectedFile}
          style={{
            backgroundColor: '#d0006f', // ורוד-סגול
            color: 'white',
            padding: '1rem 2rem', // פדינג גדול יותר
            border: 'none',
            borderRadius: '10px', // פינות מעוגלות יותר
            cursor: 'pointer',
            fontSize: '1.1rem', // גודל טקסט גדול יותר
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
            boxShadow: '0 5px 20px rgba(208,0,111,0.3)', // צל לכפתור
            marginTop: '1.5rem', // מרווח עליון
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = '#b3005f'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 7px 25px rgba(208,0,111,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = '#d0006f'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(208,0,111,0.3)'; }}
        >
          <Sparkles size={20} />
          {(analyzing || uploading) ? 'מנתח ומחפש...' : 'נתח והתאם משרות'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ef4444', marginTop: '1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

      {(analyzing || uploading) && (
        <p style={{ color: '#5b2d7a', marginTop: '1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
          אנא המתן, המערכת מנתחת את קורות החיים שלך ומחפשת משרות מתאימות...
        </p>
      )}

      {analyzeSuccess && (
        <p style={{ color: '#442063', marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
          הניתוח וההתאמה הסתיימו בהצלחה!
        </p>
      )}

      {analysisResult && (
        <div
          ref={resultRef}
          style={{
            marginTop: '2rem',
            textAlign: 'right',
            background: '#fcfcfc',
            padding: '1.5rem', // פדינג גדול יותר
            borderRadius: '15px', // פינות מעוגלות
            direction: 'rtl',
            fontFamily: 'Arial, sans-serif',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            border: '1px solid #e0e0e0',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
          }}
        >
          <h4 style={{ marginBottom: '1rem', color: '#442063', fontSize: '1.3rem', fontWeight: 'bold' }}>תוצאה מפורטת מה-AI:</h4>
          <pre style={{ textAlign: 'left', direction: 'ltr', overflowX: 'auto', fontSize: '0.9rem', color: '#333', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
          
          <h5 style={{ marginTop: '1.5rem', color: '#5b2d7a', fontSize: '1.1rem', fontWeight: 'bold' }}>כישורים טכניים שזוהו:</h5>
          {/* <p style={{ fontSize: '1rem', color: '#666' }}>{analysisResult.skills?.technical?.join(', ') || 'לא זוהו'}</p>
          
          <h5 style={{ marginTop: '1rem', color: '#5b2d7a', fontSize: '1.1rem', fontWeight: 'bold' }}>פידבק כללי:</h5>
          <p style={{ fontSize: '1rem', color: '#666' }}>{analysisResult.overall_feedback?.structure_clarity || 'אין פידבק מבנה'}</p>
          <p style={{ fontSize: '1rem', color: '#666' }}><strong>התאמה לפיתוח תוכנה:</strong> {analysisResult.overall_feedback?.suitability_for_software_dev || 'לא צוין'}</p> */}
        </div>
      )}

      {analyzeSuccess && matchedJobs.length > 0 && (
        <p style={{ color: '#442063', marginTop: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          נמצאו {matchedJobs.length} משרות מתאימות! הן מוצגות כעת בלוח המשרות.
        </p>
      )}

      {analyzeSuccess && matchedJobs.length === 0 && (
        <p style={{ color: '#555', marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
          לא נמצאו משרות מתאימות על בסיס הניתוח. נסי לשנות את קורות החיים או לבדוק משרות אחרות.
        </p>
      )}
    </div>
  );
};

export default ResumeMatchModal;