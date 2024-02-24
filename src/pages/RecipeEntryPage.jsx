import React from 'react';
import RecipeForm from '../components/RecipeForm';
import { Link } from 'react-router-dom';

const RecipeEntryPage = ({ supabase }) => {
  return (
    <div>
        <Link to="/">Back to Home</Link>
        <h1>DishConnect</h1>
      <h2>Add a New Recipe</h2>
      <RecipeForm supabase={supabase} />
    </div>
  );
};

export default RecipeEntryPage;
