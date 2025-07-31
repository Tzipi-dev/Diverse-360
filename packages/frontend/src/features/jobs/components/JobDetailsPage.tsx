import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery } from '../jobsApi'; 
import { useSavedJobs } from '../components/addJobFicher/SavedJobsContext'; 
import { Heart, Sparkles, Send, ArrowLeft, UploadCloud } from 'lucide-react'; // ייבוא אייקונים נוספים
import { getTimeAgo } from '../../../utils/jobUtils'; 

// ייבואי AI ומודאלים
import {
  useUploadResumeMutation,
  useAnalyzeResumeMutation,
  useGenerateCoverLetterMutation,
  ResumeAnalysisResult,
} from '../resumeApi'; // ודא שהנתיב נכון ל-resumeApi
import ResumeMatchModal from './ResumeMatchModal'; // המודאל לניתוח והתאמת משרות
import CoverLetterModal from '../components/CoverLetterModal'; // המודאל למכתב מקדים
import AnalysisModal from '../components/AnalysisModal'; // המודאל לפידבק ה-AI המפורט
import OutlinedPurpleButton from 'globalComponents/ui/OutlinedPurpleButton';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading, isError } = useGetJobByIdQuery(jobId || '');
  const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  

  // ** מצבים חדשים עבור פונקציונליות AI **
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generateCoverLetterLoading, setGenerateCoverLetterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [coverLetterContent, setCoverLetterContent] = useState<string | null>(null);

  // מצבי פתיחת מודאלים
  const [isResumeMatchModalOpen, setIsResumeMatchModalOpen] = useState(false); // למודאל התאמת משרות
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false); // למודאל מכתב מקדים
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false); // למודאל פידבק ניתוח קורות חיים

  // רפרנס ל-input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks עבור פעולות API
  const [uploadResume] = useUploadResumeMutation();
  const [analyzeResume] = useAnalyzeResumeMutation();
  const [generateCoverLetter] = useGenerateCoverLetterMutation();

  const saved = job ? isJobSaved(job.id) : false;
  const projectPurple = '#442063';

  useEffect(() => {
    window.scrollTo(0, 0); // גלילה לראש הדף בטעינת הרכיב
  }, []);

  // פונקציה להעלאה בלבד (אם עדיין נחוץ ככפתור נפרד)
  const handleUploadOnly = async () => { 
    if (!selectedFile || !jobId) {
      setError('יש לבחור קובץ וקיים מזהה משרה');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('job_id', jobId); // העלאה למשרה ספציפית

      await uploadResume(formData).unwrap();
      setUploadSuccess(true);
      console.log('קובץ קורות חיים הועלה בהצלחה');      
    } catch (err) {
      console.error(err);
      setError('שגיאה בהעלאת הקובץ');
    }

    setUploading(false);
  };


  const handleClickSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job) return;
    if (saved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // ** לוגיקה לטיפול בבחירת קובץ והעלאה (משולב) **
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError(null); // איפוס שגיאות קודמות
    
    // ניתן להוסיף כאן לוגיקה של העלאה אוטומטית אם רוצים,
    // אך כרגע נשאיר את זה לכפתורים הנפרדים.
  };

  // ** פונקציה לניתוח קורות חיים ופתיחת מודאל הניתוח **
  const handleAnalyzeResumeForImprovement = async () => {
    if (!selectedFile) {
      setError('נא לבחור קובץ קורות חיים לניתוח.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const analyzeFormData = new FormData();
      analyzeFormData.append('file', selectedFile);
      // אם יש לך resumeId שהתקבל מהעלאה קודמת, שלחי אותו
      // analyzeFormData.append('resumeId', someResumeId); 
      // אחרת, תני לבקאנד ליצור אחד (כמו שעשינו ב-ResumeMatchModal)
      analyzeFormData.append('resumeId', "00000000-0000-0000-0000-000000000000"); // ID גנרי אם אין קשר למשרה

      const analysisRes = await analyzeResume(analyzeFormData).unwrap();
      setAnalysisResult(analysisRes.analysis);
      setIsAnalysisModalOpen(true); // פותח את מודאל הניתוח
    } catch (err: any) {
      console.error("שגיאה בניתוח קורות חיים:", err);
      setError(`שגיאה בניתוח קורות חיים: ${err.data?.message || err.message || 'נסה שוב.'}`);
    } finally {
      setAnalyzing(false);
    }
  };

  // ** פונקציה ליצירת מכתב מקדים **
  const handleGenerateCoverLetter = async () => {
    if (!selectedFile || !jobId) {
      setError('נא לבחור קובץ קורות חיים ומשרה.');
      return;
    }

    setGenerateCoverLetterLoading(true);
    setError(null);
    setCoverLetterContent(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('job_id', jobId); // שליחת ה-jobId למכתב מקדים

      const res = await generateCoverLetter(formData).unwrap();
      setCoverLetterContent(res.content);
      setIsCoverLetterModalOpen(true); // פותח את מודאל המכתב המקדים
    } catch (err: any) {
      console.error("שגיאה ביצירת מכתב מקדים:", err);
      setError(`שגיאה ביצירת מכתב מקדים: ${err.data?.message || err.message || 'נסה שוב.'}`);
    } finally {
      setGenerateCoverLetterLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        backgroundColor: '#f8fafc', color: '#442063', fontSize: '1.2rem'
      }}>
        טוען פרטי משרה...
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        backgroundColor: '#f8fafc', color: '#ef4444', fontSize: '1.2rem', padding: '20px', textAlign: 'center'
      }}>
        <p>אירעה שגיאה בטעינת פרטי המשרה או שהמשרה לא נמצאה.</p>
        <button
          onClick={handleGoBack}
          style={{
            marginTop: '20px', padding: '10px 20px', backgroundColor: projectPurple,
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ArrowLeft size={18} /> חזרה למשרות
        </button>
      </div>
    );
  }

  const renderRequirements = (requirementsString: string) => {
    if (!requirementsString) return null;
    const items = requirementsString.split(',').map(item => item.trim()).filter(item => item.length > 0);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start', color: '#4b5563', fontSize: '15px', lineHeight: '1.6' }}>
            <span style={{ color: projectPurple, marginRight: '10px', fontSize: '1.2em', lineHeight: '1' }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    
    <div
     style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      direction: 'rtl',
      padding: '20px 0',
    }}
    >

<div
        style={{
          backgroundImage: 'url("/images/home.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginTop: "-80px",
          height: "200px",
        }}
      >
  
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px' }}>
        {/* כפתור חזרה למשרות */}
        <button
          onClick={handleGoBack}
          style={{
            marginBottom: '20px', padding: '10px 20px', backgroundColor: 'transparent',
            color: projectPurple, border: `1px solid ${projectPurple}`, borderRadius: '8px',
            cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'background-color 0.2s, color 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = projectPurple; e.currentTarget.style.color = 'white'; }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = projectPurple; }}
        >
          <ArrowLeft size={18} /> חזרה למשרות
        </button>

        {/* כרטיס עליון - Job Header Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                {job.title}
              </h1>
              {job.company && (
                <p style={{ fontSize: '18px', color: '#4b5563', margin: '0 0 4px 0' }}>
                  {job.company}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span role="img" aria-label="location" style={{ fontSize: '18px' }}>📍</span>
                  {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span role="img" aria-label="time" style={{ fontSize: '18px' }}>🕒</span>
                  {getTimeAgo(job.createdAt)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span role="img" aria-label="work mode" style={{ fontSize: '18px' }}>🏢</span>
                  {job.workMode || 'משרד'}
                </div>
              </div>
            </div>
            <span
              style={{
                backgroundColor: job.isActive ? '#e6ffee' : '#ffe6e6',
                color: job.isActive ? '#10b981' : '#ef4444',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}
            >
              {job.isActive ? 'פעילה' : 'לא פעילה'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '15px' }}>

{/* קובץ קורות חיים - בחירה והצגה */}
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={handleFileChange}
    ref={fileInputRef}
    style={{ display: 'none' }}
  />
  {/* עטיפה חדשה לכפתורים כדי ליישר אותם */}
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
    <OutlinedPurpleButton
      onClick={() => fileInputRef.current?.click()}
      // הסגנונות onMouseOver/Out יכולים לעבור ל-OutlinedPurpleButton עצמו אם הוא רכיב מותאם אישית
      // או להישאר כאן אם זהו כפתור HTML רגיל
      onMouseOver={e => { e.currentTarget.style.backgroundColor = '#E2E8F0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      בחר קובץ קו"ח
    </OutlinedPurpleButton>
    <OutlinedPurpleButton onClick={() => handleUploadOnly()} disabled={uploading || !selectedFile}>
      <Send size={15} />
       {uploading ? 'שולח...' : 'שליחת קו"ח'} {/* שינוי כאן: טקסט דינמי לפי מצב ה-uploading */}
    </OutlinedPurpleButton>
    {/* כפתור לייק (שמור משרה) */}
            <button
              onClick={handleClickSaveJob}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease',
              }}
              title={saved ? 'בטל שמירה' : 'שמור משרה'}
            >
              <Heart
                width={28}
                height={28}
                fill={saved ? projectPurple : 'none'}
                stroke={projectPurple}
                strokeWidth={1.5}
              />
            </button>
  </div>
  {selectedFile && (
    <p style={{ marginTop: '0.5rem', color: '#333', fontSize: '0.9rem' }}>
      קובץ נבחר: {selectedFile.name}
    </p>
  )}
   {/* הודעת הצלחה להעלאת קורות חיים */}
  {uploadSuccess && (
    <p style={{ color: '#442063', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
      קו"ח נשלחו בהצלחה!
    </p>
  )}
</div>

            
          </div>
        </div>
        


        {/* פרטי המשרה המלאים */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
        }}>
          
          {/* תיאור התפקיד */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              תיאור התפקיד:
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.8' }}>
              {job.description}
            </p>
          </div>

          {/* דרישות תפקיד */}
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              דרישות תפקיד:
            </h2>
            {renderRequirements(job.requirements)}
          </div>
        </div>

        {/* כרטיס AI */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          padding: '30px',
          marginBottom: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
            Diverse-360 - בינה מלאכותית לעזרתך
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: '0' }}>
            כלי AI חכמים שיעזרו לכם לבדוק, לשפר ולהתכונן לתפקיד הבא שלכם.
          </p>
          
          

          {/* כפתורי AI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginTop: '10px' }}>
            {/* כפתור "שיפור קובץ קורות חיים" - יפתח את מודאל הניתוח */}
            

            <OutlinedPurpleButton 
                        onClick={handleAnalyzeResumeForImprovement}
                        disabled={!selectedFile || analyzing}
                      >
                        {(analyzing || uploading) ? 'מנתח...' : 'נתח קו"ח לשיפור'}✨
                      </OutlinedPurpleButton>
            
                      <OutlinedPurpleButton 
                        onClick={handleGenerateCoverLetter}
              disabled={!selectedFile || !jobId || generateCoverLetterLoading}
                      >
                        {generateCoverLetterLoading ? 'כותב מכתב עבורך...' : 'כתוב לי מכתב מקדים'}✨
                      </OutlinedPurpleButton>
          </div>
          {error && (
            <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>
          )}
        </div>

        
        {/* מודאלים */}
        {isResumeMatchModalOpen && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(68,32,99,.4)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              background: '#fff', padding: '2rem', borderRadius: '20px',
              maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', position: 'relative'
            }}>
              <button
                onClick={() => setIsResumeMatchModalOpen(false)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'rgba(68,32,99,.1)', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'
                }}
              >
                &times;
              </button>
              {/* כאן נציג את ResumeMatchModal */}
              <ResumeMatchModal 
                onClose={() => setIsResumeMatchModalOpen(false)} 
                onJobsSuggested={(jobs) => {
                  // כאן תוכלי להחליט מה לעשות עם המשרות המותאמות
                  // לדוגמה, להציג אותן בדף זה או לנווט לדף המשרות הראשי
                  console.log("משרות מותאמות שהוחזרו מהמודאל:", jobs);
                  // אם את רוצה להציג אותן כאן, תצטרכי state נוסף
                  // setSuggestedJobs(jobs);
                  // אם את רוצה לנווט לדף המשרות הראשי, תשתמשי ב-navigate
                  // navigate('/jobs', { state: { suggestedJobs: jobs } });
                  setIsResumeMatchModalOpen(false); // סגור את המודאל
                }}
              />
            </div>
          </div>
        )}

        {isAnalysisModalOpen && analysisResult && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(68,32,99,.4)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              background: '#fff', padding: '2rem', borderRadius: '20px',
              maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', position: 'relative'
            }}>
              <button
                onClick={() => setIsAnalysisModalOpen(false)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'rgba(68,32,99,.1)', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'
                }}
              >
                &times;
              </button>
              <AnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                content={analysisResult}
              />
            </div>
          </div>
        )}

        {isCoverLetterModalOpen && coverLetterContent && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(68,32,99,.4)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{
              background: '#fff', padding: '2rem', borderRadius: '20px',
              maxWidth: '90%', maxHeight: '90%', overflowY: 'auto', position: 'relative'
            }}>
              <button
                onClick={() => setIsCoverLetterModalOpen(false)}
                style={{
                  position: 'absolute', top: '15px', right: '15px',
                  background: 'rgba(68,32,99,.1)', border: 'none', borderRadius: '50%',
                  width: '40px', height: '40px', fontSize: '16px', cursor: 'pointer'
                }}
              >
                &times;
              </button>
              <CoverLetterModal
                content={coverLetterContent}
                onClose={() => setIsCoverLetterModalOpen(false)}
                onChange={(newContent) => setCoverLetterContent(newContent)}
                jobTitle={job?.title || "מכתב מקדים"}
                jobId= {job?.id || ""} // ID גנרי אם אין קשר למשרה
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
