import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  status: 'active' | 'closed';
  slug: string;
  user_id: string;
  created_at: string;
  poster_url?: string;
}

export interface Registration {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  custom_responses?: Record<string, any>;
}

export type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox';

export interface EventField {
  id: string;
  event_id: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  options?: string[];
  order_index: number;
  created_at: string;
}
