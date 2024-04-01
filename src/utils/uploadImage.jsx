import { supabase } from '../supabaseClient';

const uploadImage = async (file, bucket = 'recipe-images') => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Generate a unique file name to prevent overwriting existing files
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random()}.${fileExtension}`;
  const filePath = `${fileName}`;

  // Attempt to upload the file to the specified bucket
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // If the bucket is public, construct the URL directly
  const url = `${supabase.storage.from(bucket).getPublicUrl(filePath).publicURL}`;

  return url;
};

export default uploadImage;