// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout-components/Layout';
import { supabase } from '../../supabaseClient';
import './RecipeDetail.css';
import FavoriteButton from '../../components/favorite-button/FavoriteButton';
import RatingButtons from '../../components/rating-buttons/RatingButtons';
import Comments from '../../components/comments/Comments';

// Component to display detailed information about a specific recipe
const RecipeDetail = ({ session }) => {
  // Retrieve the recipe ID from the URL parameters
  const { recipeId } = useParams();
  // State to hold the full recipe data
  const [recipe, setRecipe] = useState(null);
  // State to track if the recipe is marked as a favorite by the user
  const [isFavorite, setIsFavorite] = useState(false);
  // State to manage the loading state of the recipe data
  const [loading, setLoading] = useState(true);
  // State to hold the average rating of the recipe, initially not rated
  const [averageRating, setAverageRating] = useState('Not yet rated');
  // State to store the name of the recipe submitter
  const [submitter, setSubmitter] = useState('Unknown');
  // State to store the submitter's ID for linking to their profile
  const [submitterId, setSubmitterId] = useState(null);

  // Effect hook to manage fetching data on component mount or when recipeId/session changes
  useEffect(() => {
    fetchRecipeAndComments();
    fetchRatings();
    checkFavorite(); 
}, [recipeId, session]);

  // Asynchronous function to fetch the detailed recipe information including ingredients and steps
  const fetchRecipeAndComments = async () => {
    setLoading(true);
  
    if (!session || !session.user) {
      console.error("User is not logged in");
      setLoading(false);
      return;
    }
  
    try { // Fetch main recipe data
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select(`
          *,
          image_url,
          ingredients(ingredient_id, name, quantity, unit),
          profile_id,
          steps(step_id, instruction, step_number)
        `)
        .eq('recipe_id', recipeId)
        .single();

      if (recipeError) throw recipeError;

      setRecipe(recipeData);
      setSubmitterId(recipeData.profile_id);
      // Fetch submitter's username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', recipeData.profile_id)
        .single();

      if (profileError) throw profileError;
      setSubmitter(profileData.username);
      // Fetch comments associated with the recipe
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          user_id!inner(username)
        `)
        .eq('slug', recipeId);

      if (commentsError) throw commentsError;
      setComments(commentsData);

    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };
// Function to check if the current user has favorited the recipe
  const checkFavorite = async () => {
    if (session && session.user) {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('recipe_id', recipeId)
        .eq('profile_id', session.user.id);

      if (error) {
        console.error('Error checking favorite status:', error);
      } else {
        setIsFavorite(data.length > 0);
      }
    }
  };
// Function to fetch ratings and update the average rating state
  const fetchRatings = async () => {
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('ratings')
      .select('*')
      .eq('recipe_id', recipeId);
  
    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError);
    } else {
      setRatings(ratingsData);
      updateAverageRating(ratingsData);
    }
  };
  
  // Helper function to generate the full image URL
  const getFullImageUrl = (imagePath) => {
    const baseUrl = 'https://nwooccvnjqofbuqftrep.supabase.co/storage/v1/object/public/recipe-images';
    return `${baseUrl}/${imagePath}`;
  };
  // Helper function to format cooking time from minutes to hours and minutes
  const formatTime = (totalMinutes) => {
    if (totalMinutes === '--') return '--';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  // Conditional rendering based on loading state and recipe availability
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }
  // Render the full recipe detail page
  return (
    <>
      <Layout>
        <div className="recipe-page">
          <h2>{recipe.title}</h2>
          <small>Submitted by: {submitterId ? <Link to={`/chefs/${submitterId}`}>{submitter}</Link> : 'Unknown'}</small>
          <div>
            <label>Prep Time: </label>
            <span>{formatTime(recipe.prep_time)}</span>
            <br />
            <label>Cook Time: </label>
            <span>{formatTime(recipe.cook_time)}</span>
          </div>
          <p>{recipe.description}</p>
          <div className='img-wrapper'>
            <img src={recipe.image_url ? getFullImageUrl(recipe.image_url) : "/src/assets/placeholder.png"} alt={recipe.title} style={{ maxWidth: '100%' }} />
          </div>
          <h3>Instructions:</h3>
          <ol>
            {recipe.steps && recipe.steps.sort((a, b) => a.step_number - b.step_number).map(step => (
              <li key={step.step_id}>{step.instruction}</li>
            ))}
          </ol>
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient.ingredient_id}>
                {ingredient.quantity} {ingredient.unit !== 'whole' ? ingredient.unit + ' ' : ''}{ingredient.name}
              </li>
            ))}
          </ul>

          <div>
          <FavoriteButton recipeId={recipeId} isFavorite={isFavorite} setIsFavorite={setIsFavorite} session={session} />
          </div>

          <div>
            <RatingButtons
              recipeId={recipeId}
              session={session}
            />
          </div>
          
        </div>

        <div>
        <Comments
          recipeId={recipeId}
          session={session}
        />
        </div>

      </Layout>
    </>
  );
};
// Export the component for use in other parts of the application
export default RecipeDetail;



