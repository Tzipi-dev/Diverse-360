// // אחראית על הצגת רשימת משרות כרטיסים
// import React from 'react';
// import { Job } from '../../../../types/jobsTypes';
// import JobCard from './JobCard';

// interface JobsListProps {
//   jobs: Job[];
//   onDetailsClick: (job: Job) => void;
//   onUploadCV: (job: Job, file: File) => void;
// }

// const JobsList: React.FC<JobsListProps> = ({ jobs, onDetailsClick, onUploadCV }) => {
// return (
//     <div
//       style={{
//         display: 'grid',
//         gridTemplateColumns: '1fr',
//         gap: '24px',
//       }}
//     >
//       {jobs.map((job) => (
//         <div key={job.id} style={{ width: '100%' }}>
//           <JobCard
//             job={job}
//             onDetailsClick={onDetailsClick}
//             onUploadCV={onUploadCV}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };


// export default JobsList;


// אחראית על הצגת רשימת משרות כרטיסים
import React from 'react';
import { Job } from '../../../../types/jobsTypes';
import JobCard from './JobCard';

interface JobsListProps {
  jobs: Job[];
  onDetailsClick: (job: Job) => void;
  onUploadCV: (job: Job, file: File) => void;
}

const JobsList: React.FC<JobsListProps> = ({ jobs, onDetailsClick, onUploadCV }) => {
return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
      }}
    >
      {jobs.map((job) => (
        <div key={job.id} style={{ width: '100%' }}>
          <JobCard
            job={job}
            onDetailsClick={onDetailsClick}
            onUploadCV={onUploadCV}
          />
        </div>
      ))}
    </div>
  );
};


export default JobsList;