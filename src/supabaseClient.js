import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nwooccvnjqofbuqftrep.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b29jY3ZuanFvZmJ1cWZ0cmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NDQ5ODUsImV4cCI6MjAyNjEyMDk4NX0.YUtE7HeHwtNK4kX63ViQcZnLwKORa7vAbRqhK1vbNRk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BASE_URL = supabaseUrl;

