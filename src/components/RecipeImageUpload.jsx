import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function RecipeImageUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  async function uploadImage(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('recipe-images').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // This part deviates from the original intent to directly construct a URL
      // Instead, consider invoking onUploadComplete with filePath if needed,
      // similar to how Avatar.jsx might handle it after a successful upload.
      onUploadComplete?.(filePath);

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div>
        <label className="button primary block" htmlFor="recipe-image-upload">
          {uploading ? 'Uploading ...' : 'Upload Image'}
        </label>
        <input
          style={{ visibility: 'hidden', position: 'absolute' }}
          type="file"
          id="recipe-image-upload"
          accept="image/*"
          onChange={uploadImage}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
