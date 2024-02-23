import React, { useState } from 'react';

const IngredientForm = ({ recipeId, onIngredientSubmit }) => {
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onIngredientSubmit(recipeId, { name: ingredientName, quantity: ingredientQuantity });
    setIngredientName('');
    setIngredientQuantity('');
  };

  return (
    <div>
      <h2>Add Ingredients to Your Recipe</h2>
      <form onSubmit={handleSubmit}>
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
  );
};

export default IngredientForm;
