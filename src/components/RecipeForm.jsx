import React, { useState } from 'react';

const RecipeForm = ({ onSubmitRecipe }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRecipe({ title, description, instructions });
    setTitle('');
    setDescription('');
    setInstructions('');
  };

  return (
<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
  <input
    className="input" // Ensure you have appropriate Tailwind CSS classes here
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Recipe Title"
    required
  />
  <textarea
    className="input" // Ensure you have appropriate Tailwind CSS classes here
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Recipe Description"
    required
  />
  <textarea
    className="input" // Ensure you have appropriate Tailwind CSS classes here
    value={instructions}
    onChange={(e) => setInstructions(e.target.value)}
    placeholder="Instructions"
    required
  />
  <button type="submit" className="btn">Submit Recipe</button>
</form>

  );
};

export default RecipeForm;
