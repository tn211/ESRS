import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Layout from './Layout';
import { Link } from 'react-router-dom'; // Import Link
import './RecentRecipesPage.css';

const RecentRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered in RecentRecipesPage");

    const fetchRecentRecipes = async () => {
      console.log("Fetching 10 most recent recipes");

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
        .order('created_at', { ascending: false }) // Order by created_at in descending order
        .limit(10); // Limit to 10 results

      if (error) {
        console.error('Error fetching recent recipes:', error);
        setLoading(false);
        return;
      }

      console.log("10 most recent recipes fetched successfully:", data);
      setRecipes(data);
      setLoading(false);
    };

    fetchRecentRecipes();
  }, []); // Empty dependency array means this effect runs once on mount

  console.log(`Rendering RecentRecipesPage, Recipes Count: ${recipes.length}, Loading: ${loading}`);

  return (
    <Layout>
      <div>
        <h1>Recent Recipes</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {recipes.map((recipe, index) => (
            <div key={`${recipe.recipe_id}-${index}`}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <h2>{recipe.title}</h2>
                </Link>
                <p>{recipe.description}</p>
                {/* Display other recipe details as needed */}
            </div>
            ))}
          </div>
        )}
        {/* Link back to home */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </Layout>
  );
};

export default RecentRecipesPage;