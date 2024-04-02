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
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          profile_id: session.user.id,
        }])
        .single();

      if (recipeError) {
        throw recipeError;
      }

      if (!recipeData) {
        throw new Error('No recipe data returned from insert operation.');
      }

      const recipeId = recipeData.id;
      const ingredientsWithRecipeId = ingredients.map((ingredient) => ({
        ...ingredient,
        recipe_id: recipeId,
      }));

      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredientsWithRecipeId);

      if (ingredientsError) {
        console.error('Ingredients insertion error:', ingredientsError);
        throw ingredientsError;
      }

      alert('Recipe and ingredients added successfully!');
      setIngredients([{ name: '', quantity: '' }]); // Reset for new entries
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
        <input {...register('title', { required: true })} />
        {errors.title && <span>This field is required</span>}
      </div>
      <div>
        <label>Description</label>
        <textarea {...register('description', { required: true })} />
        {errors.description && <span>This field is required</span>}
      </div>
      <div>
        <label>Instructions</label>
        <textarea {...register('instructions', { required: true })} />
        {errors.instructions && <span>This field is required</span>}
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