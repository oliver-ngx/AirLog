import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://hmuoqixfwdqjdlhfquuj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdW9xaXhmd2RxamRsaGZxdXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTE5NDYsImV4cCI6MjA4NzY4Nzk0Nn0.CB2AEDBPTqqgf6PjANMIlWoQmP6_wbPsHliEavUZ2Fc'
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
