export interface SuggestedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
    skills_required: string[];
    experience_level: 'Junior' | 'Mid-level' | 'Senior' | 'Any';
    link: string;
}

export interface Resume {
    id: string; 
    job_id: string; 
    file_path: string; 
    uploaded_at: string; 
    skills?: string[];
    experience_years?: number | null;
    suggested_jobs?: SuggestedJob[];
    embedding?: number[]; 
    user_id?: string;
    file_name?: string;
    wants_email?: boolean; 
}
