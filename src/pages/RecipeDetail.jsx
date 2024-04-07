import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('recipe_id, title, description, instructions, image_url, ingredients (ingredient_id, name, quantity, unit)')
        .eq('recipe_id', recipeId)
        .single();
  
      if (error) {
        console.error('Error fetching recipe details:', error);
        return;
      }
  
      setRecipe(data);
      if (data && data.image_url) {
        // Pass `data.image_url` directly assuming it's the correct path within the `recipe-images` bucket
        downloadImage(data.image_url);
      }
    };
  
    fetchRecipeDetail();
  }, [recipeId]);
  

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('recipe-images').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error) {
      console.error('Error downloading image:', error.message);
    }
  }  

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h2>{recipe.title}</h2>
        {imageUrl && <img src={imageUrl} alt="Recipe" style={{ width: '100%', height: 'auto' }} />}
        <p>{recipe.description}</p>
        <p><strong>Instructions:</strong> {recipe.instructions}</p>
        <h3>Ingredients:</h3>
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.ingredient_id}>{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
          ))}
        </ul>
      </div>
      <div>
        <Link to="/my-recipes">My Recipes</Link>
        <br />
        <Link to="/recent-recipes">Recently Added</Link>
        <br />
        <Link to="/">Back to Home</Link>
      </div>
    </>
  );
}
