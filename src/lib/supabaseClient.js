import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://stnmmtkwwfpgtdygawjh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0bm1tdGt3d2ZwZ3RkeWdhd2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTY0ODgsImV4cCI6MjA2MTI3MjQ4OH0.mYtr37nMAru-DgyKJExkF3y5XQdkxGa0LzudCEIZ8ZM';
export const supabase = createClient(supabaseUrl, supabaseKey);

