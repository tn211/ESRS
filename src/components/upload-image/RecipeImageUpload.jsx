import { useEffect, useState } from 'react'; // Importing necessary hooks
import { supabase } from '../../supabaseClient'; // Importing supabase client
// RecipeImageUploader component
export default function RecipeImageUploader({ url, size, onUpload = (filePath) => console.log("Uploaded file path:", filePath) }) {
  const [recipeImageUrl, setRecipeImageUrl] = useState(null); // State to store recipe image URL
  const [uploading, setUploading] = useState(false); // State to manage upload status

  useEffect(() => {
    // Download recipe image if URL is provided
    if (url) downloadRecipeImage(url);
  }, [url]);
// Function to download recipe image
  async function downloadRecipeImage(path) {
    try {
      const { data, error } = await supabase.storage.from('recipe-images').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setRecipeImageUrl(url); // Set downloaded image URL
    } catch (error) {
      console.log('Error downloading recipe image: ', error.message);
    }
  }
// Function to upload recipe image
  async function uploadRecipeImage(event) {
    try {
      setUploading(true); // Set uploading status to true
// Check if a file is selected
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0]; // Get the selected file
      const fileExt = file.name.split('.').pop(); // Get the file extension
      const fileName = `${Math.random()}.${fileExt}`; // Generate a random file name
      const filePath = `${fileName}`; // Construct file path

      console.log('Uploading file:', file);
      console.log('File path:', filePath);
// Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage.from('recipe-images').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath); // Callback function to handle uploaded file path
    } catch (error) {
      console.error('Error uploading recipe image:', error);
    } finally {
      setUploading(false); // Ensure setUploading is set to false in both success and error cases
    }
  }

  return (
    <div> {/* Render uploaded recipe image or placeholder */}
      {recipeImageUrl ? (
        <img
          src={recipeImageUrl}
          alt="Recipe Image"
          className="recipe-image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="recipe-image no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}> {/* Upload button */}
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload Image'}
        </label>
        <input 
          style={{ 
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadRecipeImage}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
