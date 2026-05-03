const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// For DB operations (bypass RLS if service key is provided)
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

// For auth validation
const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

module.exports = { supabase, supabaseAdmin };