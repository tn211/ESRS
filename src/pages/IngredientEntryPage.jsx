import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';

const IngredientEntryPage = ({ session }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [recipeImageUrl, setRecipeImageUrl] = useState('');

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      // Insert recipe details first
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: recipeTitle,
            description: recipeDescription,
            instructions: recipeInstructions,
            image_url: recipeImageUrl,
            profile_id: session.user.id,
          },
        ])
        .single();

      if (recipeError) throw recipeError;

      // Use the recipe_id from the inserted recipe for the ingredient
      const recipeId = recipeData.id;
      const { error: ingredientError } = await supabase
        .from('ingredients')
        .insert([
          {
            ...data, // Assuming data contains ingredient details
            recipe_id: recipeId,
            profile_id: session.user.id,
          },
        ]);

      if (ingredientError) throw ingredientError;

      alert('Recipe and ingredient added successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <input value={recipeTitle} onChange={(e) => setRecipeTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <textarea value={recipeDescription} onChange={(e) => setRecipeDescription(e.target.value)} required></textarea>
      </div>
      <div>
        <label>Instructions</label>
        <textarea value={recipeInstructions} onChange={(e) => setRecipeInstructions(e.target.value)} required></textarea>
      </div>
      <div>
        <label>Image URL</label>
        <input value={recipeImageUrl} onChange={(e) => setRecipeImageUrl(e.target.value)} />
      </div>
      <div>
        <label>Name</label>
        <input {...register('name', { required: true })} />
        {errors.name && <span>This field is required</span>}
      </div>
      <div>
        <label>Quantity</label>
        <input {...register('quantity', { required: true })} />
        {errors.quantity && <span>This field is required</span>}
      </div>
      <button type="submit" disabled={submitting}>Submit Ingredient</button>
    </form>
  );
};

export default IngredientEntryPage;