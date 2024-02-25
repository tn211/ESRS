import React, { useState } from 'react';

const IngredientsForm = ({ supabase, recipeId }) => {
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Example submission logic, adapt based on your actual ingredient schema
    try {
      const { error } = await supabase
        .from('ingredients')
        .insert(ingredients.map(ingredient => ({ ...ingredient, recipe_id: recipeId })));
      
      if (error) throw error;

      alert('Ingredients added successfully!');
      setIngredients([{ name: '', quantity: '' }]); // Reset after successful submission
    } catch (error) {
      console.error('Error submitting ingredients:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            name="name"
            value={ingredient.name}
            onChange={(event) => handleIngredientChange(index, event)}
            placeholder="Ingredient Name"
            required
          />
          <input
            name="quantity"
            value={ingredient.quantity}
            onChange={(event) => handleIngredientChange(index, event)}
            placeholder="Quantity"
            required
          />
        </div>
      ))}
      <button type="button" onClick={addIngredient}>Add Another Ingredient</button>
      <button type="submit">Submit Ingredients</button>
    </form>
  );
};

export default IngredientsForm;
