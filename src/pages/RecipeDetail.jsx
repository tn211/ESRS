import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import { supabase } from '../supabaseClient';

const RecipeDetail = ({ session }) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeAndComments = async () => {
      // If no user is found in the session, exit early
      if (!session || !session.user) {
        console.error("User is not logged in");
        setLoading(false);
        return;
      }

      // Fetch recipe details
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .select('*, ingredients(ingredient_id, name, quantity, unit)')
        .eq('recipe_id', recipeId)
        .single();

      if (recipeError) {
        console.error('Error fetching recipe details:', recipeError);
        setLoading(false);
        return;
      }
      setRecipe(recipeData);

      // Fetch comments related to the recipe
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('slug', recipeId);

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      } else {
        setComments(commentsData);
      }
      setLoading(false);
    };

    fetchRecipeAndComments();
  }, [recipeId, session]);

  const handleCommentChange = (e) => {
    setNewCommentBody(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Ensure there's a session and a user before proceeding
    if (!session || !session.user) {
      alert("You must be logged in to post a comment.");
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          slug: recipeId,
          body: newCommentBody,
          user_id: session.user.id
        }
      ]);

    if (error) {
      console.error('Error posting comment:', error);
    } else {
      setComments([...comments, ...data]);
      setNewCommentBody(''); // Clear the input box after submission
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
        
        <div>
          <h3>Comments:</h3>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>
                <p>{comment.body}</p>
                <small>Commented on: {new Date(comment.created_at).toLocaleString()}</small>
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






{/* <section id="comment-section">
<div class="comment">
<h3>User Name</h3>
<p>This is a comment...</p>
</div>

  
<form id="comment-form">
<label for="username">Name:</label>
<input type="text" id="username" name="username" required></input>
<label for="comment">Comment:</label>
<textarea id="comment" name="comment" required></textarea>
<button type="submit">Submit Comment</button>
</form>


</section> */}