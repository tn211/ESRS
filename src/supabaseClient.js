import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = "https://nwooccvnjqofbuqftrep.supabase.co";
// const supabaseAnonKey =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53b29jY3ZuanFvZmJ1cWZ0cmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NDQ5ODUsImV4cCI6MjAyNjEyMDk4NX0.YUtE7HeHwtNK4kX63ViQcZnLwKORa7vAbRqhK1vbNRk";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const avatarBucket = "/storage/v1/object/public/avatars";
const recipeBucket = "/storage/v1/object/public/recipe-images";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const BASE_URL = supabaseUrl;
export const avatarBucketPath = avatarBucket;
export const recipeBucketPath = recipeBucket;
