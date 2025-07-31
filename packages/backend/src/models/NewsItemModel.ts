export interface NewsItem {
  id: string; 
  title: string;  
  content: string;  
  audience_type: 'all' | 'user' | 'cycle' | 'class';  
  audience_value?: string | null;  
  channels: string[]; 
  dynamic_variables?: string[];  
  send_at?: string | null; 
  created_at: string;  
  updated_at: string; 
}
