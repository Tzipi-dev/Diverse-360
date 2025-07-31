import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
  useGenerateCoverLetterMutation,
  ResumeAnalysisResult, // ייבוא ה-interface המפורט
} from '../resumeApi';
import {User}from '../../users/usersTypes';
import { useGetJobByIdQuery } from '../jobsApi';
import CoverLetterModal from './CoverLetterModal';

import { supabase } from '../../../config/supabaseConfig';




import { Job } from '../../../types/jobsTypes'; // ייבוא Job interface
import Card from '../../../globalComponents/ui/Card'; // ייבוא רכיב Card
import OutlinedPurpleButton from '../../../globalComponents/ui/OutlinedPurpleButton'; // ייבוא כפתור מעוצב
import JobDetails from './JobCards/JobDetails'; // ייבוא רכיב JobDetails
import { UploadCloud } from 'lucide-react'; // אייקון העלאה
import AnalysisModal from './AnalysisModal'; // ייבוא מודאל הניתוח

type JobWebsiteProps = {
  id: string; // id מגיע כ-prop, או מ-useParams אם זהו דף נפרד
};

const JobWebsite = ({ id }: JobWebsiteProps) => { // id מגיע כ-prop מ-JobActions
  // אם JobWebsite הוא דף נפרד (לא מודאל), נשתמש ב-useParams
  const { id: paramId } = useParams<{ id: string }>();
  const currentJobId = id || paramId; // השתמש ב-prop אם קיים, אחרת ב-param

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // analysisResult יהיה מטיפוס ResumeAnalysisResult המפורט
  const [analysisResult, setAnalysisResult] = useState<string | null>(null); 
  const resultRef = useRef<HTMLDivElement>(null); // לגלגול אוטומטי
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string|null>(null);

  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false); // שינוי שם למניעת בלבול
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]); 



  const [uploadResume] = useUploadResumeMutation();
  const [analyzeResume] = useAnalyzeResumeMutation();
  const [generateCoverLetter] = useGenerateCoverLetterMutation();

  const fileInputRef = useRef<HTMLInputElement>(null); // רפרנס ל-input file
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false); // מצב למודאל הניתוח

  const {
    data: job,
    isLoading,
    isError,
  } = useGetJobByIdQuery(currentJobId!, { skip: !currentJobId });

  useEffect(() => {
    // גלול לתוצאות הניתוח רק אם המודאל פתוח וניתוח הצליח
    if (analyzeSuccess && resultRef.current && isAnalysisModalOpen) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analyzeSuccess, isAnalysisModalOpen]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setAnalyzeSuccess(false);
      setError(null);
      setAnalysisResult(null); 
      setCoverLetter(null);
      setMatchedJobs([]); 
    }
  };

  // פונקציה המשלבת העלאה, ניתוח והתאמה
  const handleAnalyzeAndMatch = async () => {
    if (!selectedFile) {
      setError('נא לבחור קובץ');
      return;
    }

    setUploading(true); // מציג שההעלאה מתחילה
    setAnalyzing(true); // מציג שהניתוח מתחיל
    setError(null);
    setUploadSuccess(false);
    setAnalyzeSuccess(false);
    setMatchedJobs([]); 
    setAnalysisResult(null);

    try {
      // שלב 1: העלאת הקובץ ל-Supabase וקבלת ה-resumeId
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      // חשוב: job_id נדרש בבקאנד, גם אם זה ID גנרי
      const jobIdForUpload = currentJobId || "00000000-0000-0000-0000-000000000000"; 
      uploadFormData.append('job_id', jobIdForUpload); 

      const uploadRes = await uploadResume(uploadFormData).unwrap();
      setUploadSuccess(true);
      console.log('File uploaded successfully:', uploadRes.file_path);

      // חילוץ ה-resumeId מתוך ה-file_path
      const pathParts = uploadRes.file_path.split('/');
      const fileNameWithExtension = pathParts[pathParts.length - 1];
      const resumeId = fileNameWithExtension.split('.')[0];
      
      if (!resumeId) {
          throw new Error("לא ניתן לחלץ מזהה קורות חיים מהנתיב.");
      }
      console.log('Extracted Resume ID:', resumeId);

      // שלב 2: שליחת הקובץ לניתוח יחד עם ה-resumeId
      const analyzeFormData = new FormData();
      analyzeFormData.append('file', selectedFile);
      analyzeFormData.append('resumeId', resumeId); 
      // analyzeFormData.append('userId', currentUser.id); // דוגמה: אם יש לך משתמש מחובר

      const analysisRes = await analyzeResume(analyzeFormData).unwrap();
      setAnalysisResult(analysisRes.analysis); 
      setMatchedJobs(analysisRes.matchedJobs); // קבלת המשרות המותאמות מהבקאנד
      setAnalyzeSuccess(true);
      setIsAnalysisModalOpen(true); // פותחים את המודל של הניתוח

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

  // פונקציה להעלאה בלבד (אם עדיין נחוץ ככפתור נפרד)
  const handleUploadOnly = async () => { 
    if (!selectedFile || !currentJobId) {
      setError('יש לבחור קובץ וקיים מזהה משרה');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('job_id', currentJobId); // העלאה למשרה ספציפית

      await uploadResume(formData).unwrap();
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      setError('שגיאה בהעלאת הקובץ');
    }

    setUploading(false);
  };

  // פונקציה ליצירת מכתב מקדים
  const handleGenerateCoverLetter = async () => {
    if (!selectedFile || !currentJobId) {
      setError('נא לבחור קובץ ומשרה.');
      return;
    }
    setGeneratingCoverLetter(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      formData.append('job_id', id);
      



      const res = await generateCoverLetter(formData).unwrap();
      setCoverLetter(res.content);
      setIsCoverLetterModalOpen(true); // פותחים את מודאל המכתב המקדים
    } catch (err) {
      console.error(err);
      setError('שגיאה ביצירת מכתב מקדים');
    }

    setGeneratingCoverLetter(false);
  };
console.log({ isModalOpen, coverLetter });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '1rem',
        backgroundColor: '#f8f8f8',
      }}
    >
      {/* כרטיס פרטי משרה */}
      <Card
        title="פרטי משרה"
        description={job ? `${job.title} | ${job.location}` : 'טוען פרטי משרה...'}
        style={{
          width: '1200px',
          marginBottom: '24px',
          marginTop: '24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {job && <JobDetails job={job} />}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <OutlinedPurpleButton onClick={handleUploadClick} style={{ marginRight: '30px' }}>
              העלאת קורות חיים
              <UploadCloud size={25} className="text-[#442063] mb-4" />
            </OutlinedPurpleButton>
            {selectedFile && (
              <p style={{ marginTop: '0.5rem', color: '#333' }}>
                קובץ שנבחר: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* כרטיס בינה מלאכותית */}
      <Card
        title="בינה מלאכותית לעזרתך"
        description="כלי AI חכמים שיעזרו לכם לבדוק, לשפר ולהתכונן לתפקיד הבא שלכם."
        style={{
          width: '1200px',
          minHeight: '150px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '24px',
          }}
        >
          <OutlinedPurpleButton 
            onClick={handleAnalyzeAndMatch} // כפתור זה יבצע את כל התהליך
            disabled={analyzing || uploading || !selectedFile}
          >
            {(analyzing || uploading) ? 'מנתח ומחפש...' : 'נתח קובץ והתאם משרות'}✨
          </OutlinedPurpleButton>

          <OutlinedPurpleButton 
            onClick={handleGenerateCoverLetter}
            disabled={generatingCoverLetter || !selectedFile || !currentJobId}
          >
            {generatingCoverLetter ? 'כותב מכתב עבורך...' : 'כתוב לי מכתב מקדים'}✨
          </OutlinedPurpleButton>

          {/* כפתורים נוספים אם נחוצים, כרגע הם יקראו לאותה פונקציה או יוסרו */}
          <OutlinedPurpleButton onClick={handleAnalyzeAndMatch} disabled={analyzing || uploading || !selectedFile}>
            בדיקת התאמה לתפקיד ✨
          </OutlinedPurpleButton>
          <OutlinedPurpleButton onClick={handleAnalyzeAndMatch} disabled={analyzing || uploading || !selectedFile}>
            הכנה לראיון עבודה ✨
          </OutlinedPurpleButton>
          <OutlinedPurpleButton onClick={() => handleUploadOnly()} disabled={uploading || !selectedFile}>
            העלאת קורות חיים✨
          </OutlinedPurpleButton>
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
        )}
      </Card>

      {/* הצגת משרות מותאמות */}
      {matchedJobs.length > 0 && (
        <Card
          title="משרות מומלצות עבורך"
          description={`נמצאו ${matchedJobs.length} משרות מתאימות על בסיס הניתוח.`}
          style={{
            width: '1200px',
            marginBottom: '24px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'right' }}>
            {matchedJobs.map(job => (
              <li key={job.id} style={{ 
                background: '#fff', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                marginBottom: '1rem', 
                padding: '1rem', 
                textAlign: 'right' 
              }}>
                <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{job.title}</h4>
                {job.company && <p><strong>חברה:</strong> {job.company}</p>} {/* הצג חברה רק אם קיימת */}
                <p><strong>מיקום:</strong> {job.location}</p>
                <p><strong>תיאור:</strong> {job.description}</p>
                {/* כישורים נדרשים ורמת ניסיון יוצגו רק אם קיימים במשרה */}
                {job.skills_required && job.skills_required.length > 0 && (
                  <p><strong>כישורים נדרשים:</strong> {job.skills_required.join(', ')}</p>
                )}
                {job.experience_level && (
                  <p><strong>רמת ניסיון:</strong> {job.experience_level}</p>
                )}
                {job.link && (
                  <a 
                    href={job.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-block', 
                      marginTop: '1rem', 
                      backgroundColor: '#d0006f', 
                      color: 'white', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px', 
                      textDecoration: 'none' 
                    }}
                  >
                    הגש מועמדות
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {matchedJobs.length === 0 && analysisResult && analyzeSuccess && (
        <Card
          title="לא נמצאו משרות מותאמות"
          description="על בסיס הניתוח, לא נמצאו משרות מתאימות כרגע."
          style={{
            width: '1200px',
            marginBottom: '24px',
          }}
        >
          <p style={{ textAlign: 'center', color: '#555' }}>נסי לשנות את קורות החיים או לבדוק משרות אחרות.</p>
        </Card>
      )}

      {/* מודאל לתוצאות ניתוח ה-AI */}
      {isAnalysisModalOpen && analysisResult && (
        <AnalysisModal
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          content={JSON.stringify(analysisResult, null, 2)} // העבר את ה-JSON כמחרוזת
        />
      )}

      {/* מודאל למכתב מקדים */}
      {isCoverLetterModalOpen && coverLetter && (
        <CoverLetterModal
          
          content={coverLetter}
          onClose={() => setIsCoverLetterModalOpen(false)}
          onChange={(newContent) => setCoverLetter(newContent)}
          jobTitle={job?.title || 'מכתב מקדים'}
          jobId={id}
          userId={userId || ''}
   
        />
      )}
    </div>
  );
};

export default JobWebsite;
