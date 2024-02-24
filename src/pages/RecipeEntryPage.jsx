import React from 'react';
import RecipeForm from '../components/RecipeForm';

const RecipeEntryPage = ({ supabase }) => {
  return (
    <div>
      <h2>Add a New Recipe</h2>
      <RecipeForm supabase={supabase} />
    </div>
  );
};

export default RecipeEntryPage;
