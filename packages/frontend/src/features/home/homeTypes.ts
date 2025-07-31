export interface InfoItem {
  id: string;
  created_at?: string; // שדה תאריך אוטומטי
  updated_at?:string; 
  title: string;
  description:string;
  imageURL: string;
  referenceLinkURL: string;
}


export interface ProjectItem {
  id: string; 
  created_at?: string; // שדה תאריך אוטומטי
  updated_at?: string;
  projectName: string;
  imageURL: string;
  referenceLinkURL: string;
  description?: string; 
}

export interface TipesItem {
  id: string;
  created_at?: string; // שדה תאריך אוטומטי
  updated_at?:string; 
  title: string;
  description:string;
  imageURL: string;
  referenceLinkURL: string;
}

export interface LogoItem {
  id: string; 
  created_at?: string; // שדה תאריך אוטומטי
  updated_at?: string; // שדה תאריך אוטומטי
  name: string;
  imageURL: string;
}



