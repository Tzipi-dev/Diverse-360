export interface ProjectCarouselModel {
    id: string;
    created_at?: string; // שדה תאריך אוטומטי
    updated_at?:string;
    projectName: string;
    description: string;
    imageURL?: string ;
    referenceLinkURL: string;
  }
  
