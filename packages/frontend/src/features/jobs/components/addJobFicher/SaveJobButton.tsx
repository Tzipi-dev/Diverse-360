// import React from 'react';
// import { Heart } from 'lucide-react';
// import { Job } from '../../../../types/jobsTypes';
// import { useSavedJobs } from './SavedJobsContext';

// interface SaveJobButtonProps {
//   job: Job;
//   size?: 'small' | 'medium';
// }

// const SaveJobButton: React.FC<SaveJobButtonProps> = ({ job, size = 'medium' }) => {
//   const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();
//   const saved = isJobSaved(job.id);

//   const handleClick = (e: React.MouseEvent) => {
//     e.stopPropagation(); // מניעת העברת האירוע לרכיב האב
//     if (saved) {
//       unsaveJob(job.id);
//     } else {
//       saveJob(job);
//     }
//   };

//   const iconSize = size === 'small' ? 16 : 20;
//   const padding = size === 'small' ? '6px' : '8px';

//   return (
//     <button
//       onClick={handleClick}
//       style={{
//         background: 'none',
//         border: 'none',
//         cursor: 'pointer',
//         padding,
//         borderRadius: '6px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         transition: 'background-color 0.2s',
//         color: saved ? '#ef4444' : '#9ca3af'
//       }}
//       onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
//       onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
//       title={saved ? 'בטל שמירה' : 'שמור משרה'}
//     >
//       <Heart 
//         width={iconSize} 
//         height={iconSize} 
//         fill={saved ? '#ef4444' : 'none'}
//         stroke={saved ? '#ef4444' : '#9ca3af'}
//       />
//     </button>
//   );
// };

// export default SaveJobButton;


import React from 'react';
import { Heart } from 'lucide-react';
import { Job } from '../../../../types/jobsTypes';
import { useSavedJobs } from './SavedJobsContext';

interface SaveJobButtonProps {
  job: Job;
  size?: 'small' | 'medium';
}

const SaveJobButton: React.FC<SaveJobButtonProps> = ({ job, size = 'medium' }) => {
  const { saveJob, unsaveJob, isJobSaved } = useSavedJobs();
  const saved = isJobSaved(job.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // מניעת העברת האירוע לרכיב האב
    if (saved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const iconSize = size === 'small' ? 16 : 20;
  const padding = size === 'small' ? '6px' : '8px';

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s',
        color: saved ? '#ef4444' : '#9ca3af'
      }}
      onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
      onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      title={saved ? 'בטל שמירה' : 'שמור משרה'}
    >
      <Heart 
        width={iconSize} 
        height={iconSize} 
        fill={saved ? '#ef4444' : 'none'}
        stroke={saved ? '#ef4444' : '#9ca3af'}
      />
    </button>
  );
};

export default SaveJobButton;