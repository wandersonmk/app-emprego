
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jmsptfgjtkppxmfhlqxf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptc3B0ZmdqdGtwcHhtZmhscXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNjQ5MTIsImV4cCI6MjA1NTY0MDkxMn0.3qMI_EXiFywKC2uZPENfD7-iyRwmL5uiAJVzSa8amEg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
