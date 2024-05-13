import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Layout from '../../components/layout-components/Layout';
import { Link } from 'react-router-dom'; 
import './RecentRecipesPage.css';

// RecentRecipesPage component definition using React functional component style
const RecentRecipesPage = () => {
  // useState hook to manage recipes array state
  const [recipes, setRecipes] = useState([]);
  // useState hook to manage loading state, initially set to true
  const [loading, setLoading] = useState(true);

    // useEffect hook to perform side effects in the component (fetching data from API)
  useEffect(() => {
    // Log to indicate when useEffect is triggered
    console.log("useEffect triggered in RecentRecipesPage");

    // Asynchronous function to fetch the most recent recipes from the database
    const fetchRecentRecipes = async () => {
      // Logging fetch action
      console.log("Fetching 10 most recent recipes");

      // Destructuring to extract data and error from the awaited promise returned by supabase
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          image_url,
          ingredients (
            ingredient_id,
            name,
            quantity,
            recipe_id
          )
        `)
        .order('created_at', { ascending: false }) // Order by created_at in descending order
        .limit(10); // Limit to 10 results
// Handling response and errors after the fetch operation
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

  // function to construct full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images';
    return `${baseUrl}/${imagePath}`;
  };

  console.log(`Rendering RecentRecipesPage, Recipes Count: ${recipes.length}, Loading: ${loading}`);

  return (
    <Layout>
      <div className='recent-recipe-page'>
        <h1>Recent Recipes</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {recipes.map((recipe, index) => (
            <div key={`${recipe.recipe_id}-${index}`}>
            <Link to={`/recipes/${recipe.recipe_id}`}>
              <div className='img-wrapper'>
                <img src={recipe.image_url ? getFullImageUrl(recipe.image_url) : "/src/assets/placeholder.png"} alt={recipe.title} />
              </div> 
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