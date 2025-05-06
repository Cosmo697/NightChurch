import { createClient } from '@supabase/supabase-js';

// Check if required environment variables are defined
if (!process.env.SUPABASE_URL) {
  console.error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_ANON_KEY environment variable');
}

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;