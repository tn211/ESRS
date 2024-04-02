import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';

const IngredientEntryPage = ({ session, recipeId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('ingredients')
        .insert([
          {
            name: data.name,
            quantity: data.quantity,
            recipe_id: recipeId,
            profile_id: session.user.id,
          },
        ]);

      if (error) {
        throw error;
      }

      alert('Ingredient added successfully!');
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