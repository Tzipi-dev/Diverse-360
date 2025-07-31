export interface CourseVideo {
  id: string;             
  course_id: string;       
  title: string;         
  description: string;     
  video_url: string;       
  video_path?: string;     
  duration: number;       
  order_in_course: number;    
}

export interface Course {
  id: string;             
  title: string;       
  description?: string;   
  uploadedAt: Date;       
  isActive: boolean;     
  subject: string;        
  lecturer: string;       
  videoUrl?: string;      
  videoPath?: string;   
  imageUrl: string  
}
export interface GenerateCourseImageOptions {
  subject: string;
  description: string;
  prompt: string;
}
export interface OPTIONS {
  status: "ALL" | "SEARCH";
}

export type NewCourse = Omit<Course, 'id'>;

export interface VideoFormData {
  title: string;
  description?: string;
  videoFile: FileList;
}