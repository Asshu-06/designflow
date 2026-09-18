// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isLocalStorageFallback = 
  import.meta.env.VITE_USE_LOCAL_STORAGE_FALLBACK === 'true' || 
  supabaseUrl.includes('placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
