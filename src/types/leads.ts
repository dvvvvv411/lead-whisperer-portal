
export interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: 'neu' | 'akzeptiert' | 'abgelehnt';
}

export interface Comment {
  id: string;
  lead_id: string;
  created_at: string;
  content: string;
  user_email: string;
}
