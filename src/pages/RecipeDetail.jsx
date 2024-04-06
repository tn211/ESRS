import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Ensure Link is imported

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

  useEffect(() => {
    window.disqus_config = function () {
      this.page.url = window.location.href;
      this.page.identifier = recipeId;
    };

    const disqusScriptId = 'disqus-script';
    let script = document.getElementById(disqusScriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = disqusScriptId;
      script.src = 'https://dishconnect.disqus.com/embed.js';
      script.setAttribute('data-timestamp', +new Date());
      document.body.appendChild(script);
    } else {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.url = window.location.href;
          this.page.identifier = recipeId;
        },
      });
    }

  }, [recipeId]); 

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
        <div id="disqus_thread"></div>
        <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
      </div>
    </>
  );
};

export default RecipeDetail;
