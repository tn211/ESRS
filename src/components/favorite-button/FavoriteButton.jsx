import React from 'react'; // Importing React library
import { supabase } from '../../supabaseClient'; // Importing supabase client

// Functional component for favorite button
const FavoriteButton = ({ recipeId, isFavorite, setIsFavorite, session }) => {
  // Function to toggle favorite status
  const toggleFavorite = async () => {
    // Check if user is logged in
    if (!session || !session.user) {
      alert("You must be logged in to use favorites.");
      return;
    }
// Toggle favorite status in database
    const { error } = isFavorite ? 
      await supabase.from('likes').delete().eq('recipe_id', recipeId).eq('profile_id', session.user.id) :
      await supabase.from('likes').insert([{ recipe_id: recipeId, profile_id: session.user.id }]);
// Handling errors
    if (error) {
      console.error('Error updating favorites:', error);
    } else {
      // Update state with new favorite status
      setIsFavorite(!isFavorite);
    }
  };
// Render favorite button with appropriate text
  return (
    <button onClick={toggleFavorite}>
      {isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
    </button>
  );
};
// Exporting FavoriteButton component
export default FavoriteButton;
