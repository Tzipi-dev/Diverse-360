import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetAllJobsQuery } from "./jobsApi";
import JobCard from "./components/JobCards/JobCard";
import SearchBar from "./components/SearchBar";
import { Job } from "../../types/jobsTypes";
import SavedJobsPage from "./components/addJobFicher/SavedJobsPage";
import { Bookmark, Sparkles } from "lucide-react";
import { useSavedJobs } from "./components/addJobFicher/SavedJobsContext";
import ResumeUploadModal from "./components/resumeUploadModal";
import SuggestedJobsList from "./components/suggestedJobsList";
import { useAddScreenAnalyticsMutation } from "../admin/analyticsApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useLocation, useNavigate } from 'react-router-dom'; // <--- ייבא את useNavigate כאן!

const JobPage: React.FC = () => {
  const [addAnalytics] = useAddScreenAnalyticsMutation();
  const enterTimeRef = useRef<number>(Date.now());
  const { data: allJobs = [], isLoading, isError } = useGetAllJobsQuery();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showSavedJobs, setShowSavedJobs] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const { savedJobs } = useSavedJobs();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const location = useLocation();
  const navigate = useNavigate(); // <--- אתחל את useNavigate כאן!

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    enterTimeRef.current = Date.now();
    return () => {
      const duration = Date.now() - enterTimeRef.current;
      if (userId && duration > 1000) {
        addAnalytics({
          user_id: userId,
          path: location.pathname,
          duration,
        });
      }
    };
  }, [location.pathname, userId, addAnalytics]);

 useEffect(() => {
  const sameLength = filteredJobs.length === allJobs.length;
  const sameContent = filteredJobs.every((job, i) => job.id === allJobs[i]?.id);

  if (!sameLength || !sameContent) {
    setFilteredJobs(allJobs);
    setPage(1);
  }
}, [allJobs, filteredJobs]);

 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page])

  const onSearchResults = useCallback((jobs: Job[]) => {
    setFilteredJobs(jobs);
    setPage(1);
  }, []);

  // ** מטפל חדש עבור onDetailsClick של JobCard **
  const handleJobCardDetailsClick = useCallback((job: Job) => {
    navigate(`/jobs/${job.id}`); // מנווט לדף JobDetailsPage עם ה-ID הספציפי של המשרה
  }, [navigate]);

  // עבור onUploadCV, תצטרך להגדיר פונקציה שתטפל בהעלאת קבצים
  // ואולי לשלב אותה עם ה-API של קורות החיים שלך. לעת עתה, אפשר לשמור אותה פשוטה.
  const handleJobCardUploadCV = useCallback((job: Job, file: File) => {
    console.log(`Uploading CV for job ${job.title} with file: ${file.name}`);
    // כאן תוכל להוסיף לוגיקה להעלאת הקובץ לשרת
    // לדוגמה, באמצעות useUploadResumeMutation אם זה רלוונטי
  }, []);

  // Calculate paginated jobs
  const paginatedJobs = filteredJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const hasNextPage = page * itemsPerPage < filteredJobs.length;

  return (
    <>
      <style>{`
        .jobpage-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          direction: rtl;
        }

        .jobpage-header {
          background-image: url("/images/home.png");
          background-size: cover;
          background-position: center;
          padding: 1.2rem 1rem 3rem 1rem;
          border-bottom: 4px solid #ccc;
          height: 35vh;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-top: -80px;
        }

        .jobpage-header-title-box {
          text-align: center;
        }

        .jobpage-header-title-box h1 {
          margin-bottom: 0.5rem;
          color: white;
          margin-top: 130px;
        }

        .jobpage-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .jobpage-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.2rem;
          margin-top: 0.5rem;
        }

        .jobpage-buttons {
          position: absolute;
          bottom: 20px;
          left: 30px;
          display: flex;
          gap: 12px;
        }

        .saved-jobs-button,
        .suggest-cv-button {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 10px;
          transition: all 0.3s ease;
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        .saved-jobs-button:hover,
        .suggest-cv-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        .saved-jobs-count {
          background-color: #ff4757;
          color: white;
          border-radius: 50%;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .jobpage-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .jobpage-filters {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .jobpage-jobs-count-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .jobpage-jobs-count-label {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .jobpage-jobs-count-accent {
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #442063 0%, #5b2d7a 100%);
          border-radius: 2px;
        }

        .jobpage-jobs-count-title {
          color: #442063;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .jobpage-jobs-count-number {
          background: linear-gradient(135deg, #442063 0%, #5b2d7a 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .jobpage-jobs-grid {
          display: grid;
          gap: 1.5rem;
        }

        .jobpage-jobcard-wrapper {
          opacity: 0;
          animation: fadeInUp 0.6s ease forwards;
        }

        .jobpage-empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
        }

        .jobpage-empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .jobpage-empty-title {
          color: #442063;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .jobpage-empty-text {
          color: #6b7280;
          font-size: 1rem;
        }

        .saved-jobs-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(68, 32, 99, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .saved-jobs-modal-content {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          max-width: 90%;
          max-height: 90%;
          overflow-y: auto;
          position: relative;
        }

        .saved-jobs-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(68, 32, 99, 0.1);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 16px;
          cursor: pointer;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="jobpage-root">
        <div className="jobpage-header">
          <div className="jobpage-header-title-box">
            <h1 className="jobpage-title">לוח משרות</h1>
            <p className="jobpage-subtitle">מצאי את המשרה הבאה שלך במקום אחד</p>
          </div>

          <div className="jobpage-buttons">
            {/* <button onClick={() => setShowSuggestions(true)} className="suggest-cv-button">
              <Sparkles size={18} color="white" />
              <span>התאם לי משרות</span>
            </button> */}

            <button onClick={() => setShowSavedJobs(!showSavedJobs)} className="saved-jobs-button">
              <Bookmark size={20} color="white" />
              <span>משרות שמורות</span>
              {savedJobs.length > 0 && (
                <span className="saved-jobs-count">{savedJobs.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="jobpage-main">
          <div className="jobpage-filters">
            <SearchBar onSearchResults={onSearchResults} />
          </div>

          <div className="jobpage-jobs-count-container">
            <div className="jobpage-jobs-count-label">
              <div className="jobpage-jobs-count-accent" />
              <h2 className="jobpage-jobs-count-title">משרות זמינות</h2>
            </div>
            <div className="jobpage-jobs-count-number">{filteredJobs.length} משרות נמצאו</div>
          </div>

          <div className="jobpage-jobs-grid">
            {paginatedJobs.map((job, index) => (
              <div
                key={job.id}
                className="jobpage-jobcard-wrapper"
                style={{ animationDelay: `${Math.min(index * 0.1, 1)}s` }}
              >
                <JobCard
                  job={job}
                  onDetailsClick={handleJobCardDetailsClick} // <--- העבר את הפונקציה החדשה כאן!
                  onUploadCV={handleJobCardUploadCV}       // <--- העבר את הפונקציה החדשה כאן!
                />
              </div>
            ))}
          </div>

          {/* Pagination controls inline */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              margin: "1rem 0",
              direction: "ltr",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: page === 1 ? "#ccc" : "#442063",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              קודם
            </button>
            <span style={{ alignSelf: "center", fontWeight: "bold" }}>עמוד {page}</span>
            <button
              onClick={() => setPage((p) => (hasNextPage ? p + 1 : p))}
              disabled={!hasNextPage}
              style={{
                padding: "8px 16px",
                backgroundColor: !hasNextPage ? "#ccc" : "#442063",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: !hasNextPage ? "not-allowed" : "pointer",
              }}
            >
              הבא
            </button>
          </div>

          {filteredJobs.length === 0 && !isLoading && (
            <div className="jobpage-empty-state">
              <div className="jobpage-empty-icon">🔍</div>
              <h3 className="jobpage-empty-title">לא נמצאו משרות</h3>
              <p className="jobpage-empty-text">נסי לשנות את קריטריוני החיפוש או הסינון</p>
            </div>
          )}

          {isLoading && <p style={{ textAlign: "center" }}>טוען משרות...</p>}
          {isError && <p style={{ textAlign: "center", color: "red" }}>שגיאה בטעינת המשרות</p>}

          <SuggestedJobsList jobs={suggestedJobs} />
        </div>

        {/* Saved Jobs Modal */}
        {showSavedJobs && (
          <div className="saved-jobs-modal-overlay" onClick={() => setShowSavedJobs(false)}>
            <div
              className="saved-jobs-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSavedJobs(false)}
                className="saved-jobs-modal-close"
                aria-label="סגור"
              >
                ❌
              </button>
              <SavedJobsPage />
            </div>
          </div>
        )}

        {/* Resume Upload Modal */}
        {showSuggestions && (
          <ResumeUploadModal
            onClose={() => setShowSuggestions(false)}
            onJobsSuggested={(jobs) => setSuggestedJobs(jobs)}
          />
        )}
      </div>
    </>
  );
};

export default JobPage;