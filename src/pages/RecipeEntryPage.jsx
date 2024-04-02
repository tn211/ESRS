import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';

const RecipeEntryPage = ({ session }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredientField = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      // Insert the recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          profile_id: session.user.id,
        })
        .single();

      if (recipeError) {
        console.error('Recipe insertion error:', recipeError);
        throw recipeError;
      }

      // Check if recipeData is valid and has an id
      if (!recipeData || typeof recipeData.id === 'undefined') {
        throw new Error('Failed to obtain recipe ID.');
      }

      const recipeId = recipeData.id;
      console.log('Recipe inserted with ID:', recipeId);

      // Sequentially insert ingredients
      for (const ingredient of ingredients) {
        console.log('Inserting ingredient:', ingredient);
        const { error: ingredientError } = await supabase
          .from('ingredients')
          .insert({
            name: ingredient.name,
            quantity: ingredient.quantity,
            recipe_id: recipeId,
            profile_id: session.user.id,
          });

        if (ingredientError) {
          console.error('Ingredient insertion error:', ingredientError);
          throw ingredientError;
        }
      }

      console.log('All ingredients inserted successfully.');
      setIngredients([{ name: '', quantity: '' }]); // Reset for new entries
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Title</label>
        <input {...register('title', { required: true })} />
      </div>
      <div>
        <label>Description</label>
        <textarea {...register('description', { required: true })} />
      </div>
      <div>
        <label>Instructions</label>
        <textarea {...register('instructions', { required: true })} />
      </div>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            {...register(`ingredients[${index}].name`, { required: true })}
            placeholder="Ingredient Name"
          />
          <input
            {...register(`ingredients[${index}].quantity`, { required: true })}
            placeholder="Quantity"
          />
          <button type="button" onClick={() => removeIngredientField(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addIngredientField}>Add Ingredient</button>
      <button type="submit" disabled={submitting}>Submit Recipe</button>
    </form>
  );
};

export default RecipeEntryPage;