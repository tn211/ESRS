import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import RecipeList from '../../components/recipe-list/RecipeList';
import Layout3 from '../../components/layout-components/Layout3';
import './UserRecipesPage.css';

const UserRecipesPage = ({ session }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered in UserRecipesPage");

    if (!session || !session.user) {
      console.log("Session or session.user is not available");
      setLoading(false);
      return;
    }

    console.log("Session is available, proceeding to fetch recipes");

    const fetchRecipes = async () => {
      console.log(`Fetching recipes for user ID: ${session.user.id}`);

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          ingredients (
            ingredient_id,
            name,
            quantity,
            recipe_id
          )
        `)
        .eq('profile_id', session.user.id);

      if (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
        return;
      }

      console.log("Recipes and ingredients fetched successfully:", data);
      setRecipes(data);
      setLoading(false);
    };

    fetchRecipes();
  }, [session]); // Re-run useEffect when the session changes

  console.log(`Rendering UserRecipesPage, Recipes Count: ${recipes.length}, Loading: ${loading}`);

  return (
    <Layout3>
      <div className='user-recipes-page'>
        <h1>My Recipes</h1>
        {session && supabase ? ( // Check that session and supabase are not null
          <div className="card1">
            <RecipeList supabase={supabase} userId={session.user.id} />
          </div>
        ) : (
          <p>Loading or not authenticated...</p> // Fallback message
        )}
      </div>
    </Layout3>
  );
};

export default UserRecipesPage;
