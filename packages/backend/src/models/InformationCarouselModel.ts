export interface InformationCarouselModel {
    id: string;
    created_at?: string; // שדה תאריך אוטומטי
    updated_at?:string;
    title: string;
    description: string;
    imageURL?: string ;
    referenceLinkURL: string;
  }
  
