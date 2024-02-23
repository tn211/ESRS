import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wjrqqfjolcpxmlzwxxbj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcnFxZmpvbGNweG1send4eGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcwOTY1MDksImV4cCI6MjAyMjY3MjUwOX0.bCIIyngIq6xLTZxpMcutiSYkmCL7ldYxNYF5OF7Z-10';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
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

  const handleSubmitRecipe = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('recipes')
      .insert([{ title, description, instructions, user_id: 1 }]);

    if (error) {
      console.error('Error inserting recipe:', error);
    } else {
      setTitle('');
      setDescription('');
      setInstructions('');
      setNewRecipeId(data ? data[0].recipe_id : null); // Update for successful insert
      setUpdateCounter(prev => prev + 1); // Trigger re-fetch
    }
  };

  const handleSubmitIngredient = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('ingredients')
      .insert([{ recipe_id: newRecipeId, name: ingredientName, quantity: ingredientQuantity }]);

    if (error) {
      console.error('Error inserting ingredient:', error);
    } else {
      setIngredientName('');
      setIngredientQuantity('');
      setUpdateCounter(prev => prev + 1); // Trigger re-fetch or UI update
    }
  };

  return (
    <div className="container">
      <h1>DishConnect</h1>
      <form onSubmit={handleSubmitRecipe}>
        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe Title"
          required
        />
        <textarea
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe Description"
          required
        />
        <textarea
          className="input"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
          required
        />
        <button type="submit">Submit Recipe</button>
      </form>
      
      {newRecipeId && (
        <div>
          <h2>Add Ingredients to Your Recipe</h2>
          <form onSubmit={handleSubmitIngredient}>
            <input
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              placeholder="Ingredient Name"
              required
            />
            <input
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(e.target.value)}
              placeholder="Quantity"
              required
            />
            <button type="submit">Add Ingredient</button>
          </form>
        </div>
      )}

      <div className="recipesList">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipeItem">
            <strong>{recipe.title}</strong>: {recipe.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
