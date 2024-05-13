import React from "react";
import { supabase } from "../../supabaseClient";

const FavoriteButton = ({ recipeId, isFavorite, setIsFavorite, session }) => {
  const toggleFavorite = async () => {
    if (!session || !session.user) {
      alert("You must be logged in to use favorites.");
      return;
    }

    const { error } = isFavorite
      ? await supabase
          .from("likes")
          .delete()
          .eq("recipe_id", recipeId)
          .eq("profile_id", session.user.id)
      : await supabase
          .from("likes")
          .insert([{ recipe_id: recipeId, profile_id: session.user.id }]);

    if (error) {
      console.error("Error updating favorites:", error);
    } else {
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <button onClick={toggleFavorite}>
      {isFavorite ? "Remove from Favourites" : "Add to Favourites"}
    </button>
  );
};

export default FavoriteButton;
