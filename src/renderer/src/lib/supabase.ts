import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yrjgatenreointxowngz.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyamdhdGVucmVvaW50eG93bmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MjY2MjksImV4cCI6MjA5MDQwMjYyOX0.FAXiwayDhBrhvDCjz9XaKRLxFD7In3hkE2IxlqIsW9M'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)