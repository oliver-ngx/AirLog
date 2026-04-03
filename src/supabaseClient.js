import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hmuoqixfwdqjdlhfquuj.supabase.co'
const supabaseAnonKey = 'sb_publishable_1bQYtoiIlvQDTa6ACVk3Ae_1V03rz3e'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)