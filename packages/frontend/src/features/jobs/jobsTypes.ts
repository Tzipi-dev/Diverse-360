export interface Job {
    id: string;
    title: string;
    company?: string; // הפכנו לאופציונלי כפי שביקשת
    description: string;
    location: string;
    requirements: string;
    createdAt: Date;
    isActive: boolean;
    workMode: string;
    skills_required?: string[]; // הפכנו לאופציונלי כי הוא ריק ב-DB
    experience_level?: 'Junior' | 'Mid-level' | 'Senior' | 'Any'; // הפכנו לאופציונלי כי הוא ריק ב-DB
    link?: string;
}

export interface JobCardProps {
    job: Job;
    onDetailsClick: (job: Job) => void;
    onUploadCV: (job: Job, file: File) => void;
}



