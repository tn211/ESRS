import React, { useState } from 'react';

const RecipeForm = ({ supabase }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');

  // Hardcoded user_id for testing
  const user_id = 1; // ID of the test user

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('recipes')
      .insert([
        {
          user_id, // Use the hardcoded test user's ID
          title,
          description,
          instructions,
        },
      ]);

    if (error) {
      console.error(error.message);
    } else {
      alert('Recipe added successfully!');
      // Optionally reset form fields or handle success (e.g., redirect)
      setTitle('');
      setDescription('');
      setInstructions('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div>
        <label htmlFor="instructions">Instructions</label>
        <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RecipeForm;
