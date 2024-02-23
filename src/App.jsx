import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import IngredientForm from './components/IngredientForm';

const supabaseUrl = 'https://wjrqqfjolcpxmlzwxxbj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnFxZmpvbGNweG1send4eGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwOTY1MDksImV4cCI6MjAyMjY3MjUwOX0.bCIIyngIq6xLTZxpMcutiSYkmCL7ldYxNYF5OF7Z-10';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipeId, setNewRecipeId] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);

  useEffect(() => {
    fetchRecipes();
  }, [updateCounter]);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) console.error(error);
    else setRecipes(data);
  };

  const handleSubmitRecipe = async (recipeData) => {
    // Including user_id in the recipeData object
    const { data, error } = await supabase
      .from('recipes')
      .insert([{ ...recipeData, user_id: 1 }]); // Hardcoded user_id for testing

    if (!error && data) {
      setNewRecipeId(data[0].id); // Assuming 'id' is the primary key field for your recipes
      setUpdateCounter(prev => prev + 1);
    } else {
      console.error('Error inserting recipe:', error);
    }
  };

  const handleIngredientSubmit = async (recipeId, ingredientData) => {
    const { error } = await supabase
      .from('ingredients')
      .insert([{ ...ingredientData, recipe_id: recipeId }]);

    if (!error) {
      setUpdateCounter(prev => prev + 1);
    } else {
      console.error('Error inserting ingredient:', error);
    }
  };

  return (
    <div className="container">
      <h1>DishConnect</h1>
      <RecipeForm onSubmitRecipe={handleSubmitRecipe} />
      {newRecipeId && <IngredientForm recipeId={newRecipeId} onIngredientSubmit={handleIngredientSubmit} />}
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default App;
