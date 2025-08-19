import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseUrl="https://zxzmwxmssgqwwqecvclf.supabase.co"
const supabaseServiceKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4em13eG1zc2dxd3dxZWN2Y2xmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI4NTkyNSwiZXhwIjoyMDcwODYxOTI1fQ.yFMz0XF3VXjQwyQo-b4Ng5FhZvn0hAqve0BoHFT4Gco"
const supabaseAnonKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4em13eG1zc2dxd3dxZWN2Y2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODU5MjUsImV4cCI6MjA3MDg2MTkyNX0.0RuNCZyB4Iafp5HUdyKNqHXRY5te-iqNEqFwR9A1Aco"

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client configuration for frontend
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey
};