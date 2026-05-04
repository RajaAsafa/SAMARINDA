const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL, SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di backend/.env');
}

const authOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, authOptions);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, authOptions);

module.exports = {
  supabase,
  supabaseAdmin,
};
