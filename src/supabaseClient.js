import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wjrqqfjolcpxmlzwxxbj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnFxZmpvbGNweG1send4eGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwOTY1MDksImV4cCI6MjAyMjY3MjUwOX0.bCIIyngIq6xLTZxpMcutiSYkmCL7ldYxNYF5OF7Z-10";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
