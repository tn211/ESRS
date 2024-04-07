import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [recipeId, setRecipeId] = useState('');

  async function handleUpload(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!recipeId) {
        throw new Error('You must specify a recipe ID.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `recipe-images/${fileName}`;

      let { error: uploadError } = await supabase.storage.from('recipe-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      await addImageUrlToRecipes(`${filePath}`);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  }

  async function addImageUrlToRecipes(imageUrl) {
    const { data, error } = await supabase
      .from('recipes')
      .update({ image_url: imageUrl })
      .match({ recipe_id: recipeId });

    if (error) {
      console.error('Error inserting image URL:', error);
      return;
    }

    console.log('Image URL added to recipe:', data);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Recipe ID"
        value={recipeId}
        onChange={(e) => setRecipeId(e.target.value)}
        disabled={uploading}
      />
      <label className="button primary" htmlFor="recipe-image-upload">
        {uploading ? 'Uploading...' : 'Upload Recipe Image'}
      </label>
      <input
        type="file"
        id="recipe-image-upload"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ visibility: 'hidden', position: 'absolute' }}
      />
    </div>
  );
}

export default ImageUpload;
