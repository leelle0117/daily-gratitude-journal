export interface GratitudeEntry {
  id?: number;
  line1: string;
  line2: string;
  line3: string;
  date: string; // "YYYY-MM-DD"
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GratitudeFormData {
  line1: string;
  line2: string;
  line3: string;
}
