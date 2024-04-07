import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';

const RecipeDetail = ({ supabase }) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          ingredients (
            ingredient_id,
            name,
            quantity,
            unit
          )
        `)
        .eq('recipe_id', recipeId)
        .single();

      if (error) {
        console.error('Error fetching recipe details:', error);
        return;
      }

      setRecipe(data);
    };

    fetchRecipeDetail();
  }, [recipeId, supabase]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Layout>
      <div>
        <h2>{recipe.title}</h2>
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
      </Layout>
      </>
  );
};

export default RecipeDetail;
