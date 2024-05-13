// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import RecipeList from '../../components/recipe-list/RecipeList';
import Layout from '../../components/layout-components/Layout';
import './UserRecipesPage.css';

// Component to display a user's recipes
const UserRecipesPage = ({ session }) => {
  // State to hold the list of recipes
  const [recipes, setRecipes] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Effect to fetch user's recipes on component mount or session change
  useEffect(() => {
    console.log("useEffect triggered in UserRecipesPage");
    // Check for valid session and user object
    if (!session || !session.user) {
      console.log("Session or session.user is not available");
      setLoading(false);
      return;
    }

    console.log("Session is available, proceeding to fetch recipes");
    // Asynchronous function to fetch recipes from the database
    const fetchRecipes = async () => {
      console.log(`Fetching recipes for user ID: ${session.user.id}`);
      // Fetch user-specific recipes from the database
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
        .eq('profile_id', session.user.id); // Filtering recipes by user ID
      // Handle fetch error      
      if (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
        return;
      }

      console.log("Recipes and ingredients fetched successfully:", data);
      // Update recipes state with fetched data
      setRecipes(data);
      setLoading(false);
    };

    fetchRecipes();
  }, [session]); // Re-run useEffect when the session changes
  // Log for debugging rendering issues
  console.log(`Rendering UserRecipesPage, Recipes Count: ${recipes.length}, Loading: ${loading}`);
  // Render the component using JSX
  return (
    <Layout>
      <div className='user-recipes-page'>
        <h1>My Recipes</h1>
        {session && supabase ? ( // Check that session and supabase are not null
          <RecipeList supabase={supabase} userId={session.user.id} />
        ) : (
          <p>Loading or not authenticated...</p> // Fallback message
        )}
      </div>
    </Layout>
  );
};
// Export the component for use in other parts of the application
export default UserRecipesPage;
