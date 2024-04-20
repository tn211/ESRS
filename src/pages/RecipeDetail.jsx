import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import { supabase } from '../supabaseClient';

const RecipeDetail = ({ session }) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState('Not yet rated');
  const [submitter, setSubmitter] = useState('');

  useEffect(() => {
    fetchRecipeAndComments();
    checkFavorite();
    fetchRatings();
  }, [recipeId, session]);

  const fetchRecipeAndComments = async () => {
    setLoading(true);
  
    if (!session || !session.user) {
      console.error("User is not logged in");
      setLoading(false);
      return;
    }
  
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select(`
        *,
        ingredients(ingredient_id, name, quantity, unit),
        profiles(username),
        steps(step_id, instruction, step_number)  // Fetch steps with step_number and instruction
      `)
      .eq('recipe_id', recipeId)
      .single();
  
    if (recipeError) {
      console.error('Error fetching recipe details:', recipeError);
    } else {
      setRecipe(recipeData);
      if (recipeData.profiles) {  // Check if profiles data is available
        setSubmitter(recipeData.profiles.username);
      } else {
        console.log('No profile data available for this recipe');
        setSubmitter('Unknown');  // Fallback if no username data is available
      }
    }
  
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select(`
        *,
        user_id!inner(username)
      `)
      .eq('slug', recipeId);
  
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    } else {
      setComments(commentsData);
    }
  
    setLoading(false);
  };
  



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

  const toggleFavorite = async () => {
    if (!session || !session.user) {
      alert("You must be logged in to use favorites.");
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('profile_id', session.user.id);

      if (error) {
        console.error('Error removing from favorites:', error);
      } else {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from('likes')
        .insert([{ recipe_id: recipeId, profile_id: session.user.id }]);

      if (error) {
        console.error('Error adding to favorites:', error);
      } else {
        setIsFavorite(true);
      }
    }
  };

  const handleRating = async (rating) => {
    if (!session || !session.user) {
      alert("You must be logged in to rate recipes.");
      return;
    }

    const existingRating = ratings.find(r => r.profile_id === session.user.id);
    const updatedRating = { recipe_id: recipeId, profile_id: session.user.id, rating };

    if (existingRating) {
      const { error } = await supabase
        .from('ratings')
        .update({ rating })
        .match({ recipe_id: recipeId, profile_id: session.user.id });
      if (error) {
        console.error('Error updating rating:', error);
      } else {
        const newRatings = ratings.map(r => r.profile_id === session.user.id ? updatedRating : r);
        setRatings(newRatings);
        updateAverageRating(newRatings);
      }
    } else {
      const { error } = await supabase
        .from('ratings')
        .insert([updatedRating]);
      if (error) {
        console.error('Error inserting rating:', error);
      } else {
        const newRatings = [...ratings, updatedRating];
        setRatings(newRatings);
        updateAverageRating(newRatings);
      }
    }
  };

  const updateAverageRating = (ratings) => {
    const total = ratings.reduce((acc, cur) => acc + cur.rating, 0);
    const average = total / ratings.length;
    setAverageRating(average.toFixed(1));
  };

  const handleCommentChange = (e) => {
    setNewCommentBody(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      alert("You must be logged in to post a comment.");
      return;
    }

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          slug: recipeId,
          body: newCommentBody,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error posting comment:', error);
    } else {
      await fetchRecipeAndComments();
      setNewCommentBody('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }
  
  return (
    <>
      <Layout>
        <div>
          <h2>{recipe.title}</h2>
          <small>Submitted by: {submitter}</small>
          <p>{recipe.description}</p>
          <h3>Instructions:</h3>
          <ol>
            {recipe.steps && recipe.steps.sort((a, b) => a.step_number - b.step_number).map(step => (
              <li key={step.step_id}>
                {step.instruction}
              </li>
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
            <button onClick={toggleFavorite}>
              {isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
            </button>
            <div>
            {[1, 2, 3, 4, 5].map(value => (
              <button key={value} onClick={() => handleRating(value)}>{value}</button>
            ))}
            <p>Current Rating: {averageRating}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3>Comments:</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.body}</p>
                <small>{comment.user_id.username}</small>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newCommentBody}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default RecipeDetail;
