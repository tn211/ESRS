import React, { useState } from "react";
import { Link } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import IngredientsForm from "../components/IngredientsForm";

const RecipeEntryPage = ({ supabase }) => {
  const [recipeId, setRecipeId] = useState(null);

  const handleRecipeSubmitted = (newRecipeId) => {
    setRecipeId(newRecipeId);
  };

  return (
    <div>
      {!recipeId ? (
        <RecipeForm
          supabase={supabase}
          onRecipeSubmitted={handleRecipeSubmitted}
        />
      ) : (
        <IngredientsForm supabase={supabase} recipeId={recipeId} />
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default RecipeEntryPage;
