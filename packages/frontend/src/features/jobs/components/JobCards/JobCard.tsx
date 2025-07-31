// import React from 'react';
// import { Heart } from 'lucide-react';
// import { JobCardProps, Job } from '../../../../types/jobsTypes';
// import { useSavedJobs } from '../addJobFicher/SavedJobsContext';
// import { truncateText, getTimeAgo } from '../../../../utils/jobUtils'; // <--- ייבוא מ-UTIL (שנה נתיב לפי הצורך)

// const JobCard: React.FC<JobCardProps> = ({ job, onDetailsClick, onUploadCV }) => {
//   const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();
//   const saved = isJobSaved(job.id);

//   const handleClickSaveJob = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (saved) {
//       unsaveJob(job.id);
//     } else {
//       saveJob(job);
//     }
//   };

//   const projectPurple = '#442063';

//   return (
//     <div
//       style={{
//         backgroundColor: '#fff',
//         borderRadius: '16px',
//         boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
//         padding: '24px',
//         border: '1px solid #e5e7eb',
//         transition: 'all 0.3s ease',
//         marginBottom: '24px',
//         maxWidth: '800px',
//         marginInline: 'auto',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '16px',
//         minHeight: '250px',
//       }}
//     >
//       {/* כותרת המשרה והסטטוס - שינוי ל-flex-end */}
//       <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: '8px' }}>
//         {/* כותרת המשרה מועברת לצד שמאל (בגלל rtl) */}
//         <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0', flexGrow: 1 }}>
//           {job.title}
//         </h2>
//         {/* סטטוס "פעילה/לא פעילה" */}
//         <span
//           style={{
//             backgroundColor: job.isActive ? '#e6ffee' : '#ffe6e6',
//             color: job.isActive ? '#10b981' : '#ef4444',
//             padding: '4px 12px',
//             borderRadius: '9999px',
//             fontSize: '12px',
//             fontWeight: '600',
//             whiteSpace: 'nowrap',
//           }}
//         >
//           {job.isActive ? 'פעילה' : 'לא פעילה'}
//         </span>
//       </div>

//       {/* תיאור קצר */}
//       <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6', margin: '0' }}>
//         {truncateText(job.description, 150)}
//       </p>

//       {/* פרטי מיקום וזמן */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//           <span role="img" aria-label="location" style={{ fontSize: '16px' }}>📍</span>
//           {job.location}
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//           <span role="img" aria-label="time" style={{ fontSize: '16px' }}>🕒</span>
//           {getTimeAgo(job.createdAt)}
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//           <span role="img" aria-label="office" style={{ fontSize: '16px' }}>🏢</span>
//           {job.workMode || 'משרד'}
//         </div>
//       </div>

//       {/* כפתורים */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
//         {/* כפתור "פרטים נוספים" */}
//         <button
//           onClick={() => onDetailsClick(job)}
//           style={{
//             backgroundColor: 'transparent',
//             color: '#3b82f6',
//             border: 'none',
//             padding: '8px 12px',
//             borderRadius: '8px',
//             fontSize: '14px',
//             fontWeight: '600',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '4px',
//             transition: 'background-color 0.2s ease',
//           }}
//         >
//           <span style={{ fontSize: '18px' }}>+</span>
//           פרטים נוספים
//         </button>

//         {/* כפתור לייק - מותאם אישית בתוך JobCard - ללא העיגול */}
//         <button
//           onClick={handleClickSaveJob}
//           style={{
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer',
//             padding: '0',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             transition: 'transform 0.2s ease',
//           }}
//           title={saved ? 'בטל שמירה' : 'שמור משרה'}
//         >
//           <Heart
//             width={24}
//             height={24}
//             fill={saved ? projectPurple : 'none'}
//             stroke={projectPurple}
//             strokeWidth={1.5}
//           />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobCard;


import React from 'react';
import { Heart } from 'lucide-react';
import { JobCardProps, Job } from '../../../../types/jobsTypes';
import { useSavedJobs } from '../addJobFicher/SavedJobsContext';
import { truncateText, getTimeAgo } from '../../../../utils/jobUtils'; // <--- וודא שהנתיב נכון

const JobCard: React.FC<JobCardProps> = ({ job, onDetailsClick, onUploadCV }) => {
  // בגלל התיקון ב-SavedJobsPage.tsx, אנחנו מצפים ש-job יהיה מוגדר כאן.
  // אם בכל זאת יגיע undefined, שגיאה עדיין תופיע, אך סביר להניח שזה לא יקרה.
  const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.id); // שורה 9

  const handleClickSaveJob = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const projectPurple = '#442063';

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        padding: '24px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
        marginBottom: '24px',
        maxWidth: '800px',
        marginInline: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: '250px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0', flexGrow: 1 }}>
          {job.title}
        </h2>
        <span
          style={{
            backgroundColor: job.isActive ? '#e6ffee' : '#ffe6e6',
            color: job.isActive ? '#10b981' : '#ef4444',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          {job.isActive ? 'פעילה' : 'לא פעילה'}
        </span>
      </div>

      {/* תיאור קצר */}
      <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6', margin: '0' }}>
        {truncateText(job.description, 150)}
      </p>

      {/* פרטי מיקום וזמן */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span role="img" aria-label="location" style={{ fontSize: '16px' }}>📍</span>
          {job.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span role="img" aria-label="time" style={{ fontSize: '16px' }}>🕒</span>
          {getTimeAgo(job.createdAt)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span role="img" aria-label="office" style={{ fontSize: '16px' }}>🏢</span>
          {job.workMode || 'משרד'}
        </div>
      </div>

      {/* כפתורים */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        {/* כפתור "פרטים נוספים" */}
        <button
          onClick={() => onDetailsClick(job)}
          style={{
            backgroundColor: 'transparent',
            color: '#442063',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'background-color 0.2s ease',
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          פרטים נוספים
        </button>

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
            width={24}
            height={24}
            fill={saved ? projectPurple : 'none'}
            stroke={projectPurple}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
