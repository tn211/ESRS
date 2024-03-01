import React from 'react';
import { Link } from 'react-router-dom'; // new import
import { supabase } from '../supabaseClient';
import IngredientsForm from '../components/IngredientsForm';

const AddIngredientsPage = () => {
  const recipeId = 36; // hardcoded recipe ID

  return (
    <div>
      <h2>Add Ingredients for Recipe</h2>
      <IngredientsForm supabase={supabase} recipeId={recipeId} />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default AddIngredientsPage;