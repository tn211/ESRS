import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function IngredientEntryPage({ session }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recipeId, setRecipeId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('ingredients')
      .insert([
        { name, quantity, profile_id: session.user.id, recipe_id: recipeId },
      ]);

    if (error) {
      alert(error.message);
    } else {
      alert('Ingredient added successfully!');
      // Reset form
      setName('');
      setQuantity('');
      setRecipeId('');
    }
  };

  return (
    <div>
      <h2>Add Ingredient</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Ingredient Name:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="recipeId">Recipe ID:</label>
          <input
            id="recipeId"
            value={recipeId}
            onChange={(e) => setRecipeId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Ingredient</button>
      </form>
    </div>
  );
}

export default IngredientEntryPage;