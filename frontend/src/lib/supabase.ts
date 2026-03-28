import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Provide your Supabase URL and key here or via env vars.
// The user currently has not provided these, so throwing errors if they use it locally.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
