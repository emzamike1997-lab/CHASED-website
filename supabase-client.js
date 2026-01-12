
// Supabase Configuration
const SUPABASE_URL = 'https://keznpnwibyphyvjbslox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtlem5wbndpYnlwaHl2amJzbG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxODE0MzIsImV4cCI6MjA4Mzc1NzQzMn0.efisBO6y3ySFV9InD2boDIIWpBnFVpKfsMBGH7K9OTM';

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files if using modules, but here we'll rely on global scope or order
window.supabaseClient = supabase;
