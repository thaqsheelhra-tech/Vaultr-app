import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nvmzrokofhubnkiudurs.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bXpyb2tvZmh1Ym5raXVkdXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MTQ1NDEsImV4cCI6MjA5MTI5MDU0MX0.x6DL5KTW3t2NGsOCOWx7AULKDOl1kc12YuHFKPL6e8c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
