import { createClient } from "@supabase/supabase-js";

const supabaseUrl ="https://xtfarxnswqsguatfjsmu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZmFyeG5zd3FzZ3VhdGZqc211Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NzcyNzIsImV4cCI6MjA3MzI1MzI3Mn0.7NJdba6CxjX81K2hz8YNHOUG0KhSeJ_bf0-8zdkeGzE";

export const supabase = createClient(supabaseUrl,supabaseAnonKey)