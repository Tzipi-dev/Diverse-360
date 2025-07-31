// אחראית על מידע בקצרה על המשרה 
// מיקום סוג וזמן פרסום
import React from 'react';

import { MapPin, Clock, Briefcase } from 'lucide-react';
import { Job } from '../../../../types/jobsTypes';
// ייבוא פונקציה שמחזירה טקסט של זמן
import { getTimeAgo } from '../../../../utils/jobUtils';

interface JobDetailsProps {
  job: Job;
}
const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      color: '#6B7280', // אפור
      fontSize: '12px',
      marginBottom: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <MapPin style={{ width: '12px', height: '12px' }} />
        <span>{job.location}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Briefcase style={{ width: '12px', height: '12px' }} />
        <span>{job.workMode} </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Clock style={{ width: '12px', height: '12px' }} />
        <span>{getTimeAgo(job.createdAt)}</span>
      </div>
      
    </div>
  );
};

export default JobDetails;