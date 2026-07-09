import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key are required in environment variables');
}

// Service role client bypasses RLS policies. To be used ONLY on the server side (Route Handlers, Server Actions)
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // Serverless context doesn't need to persist sessions
  },
});
