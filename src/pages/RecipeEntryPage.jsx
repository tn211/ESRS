import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import Dropdown from '../components/dropdown/Dropdown';
import Layout from './Layout';

const RecipeEntryPage = ({ session }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredientField = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      // Insert the recipe and retrieve the recipe ID
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          profile_id: session.user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      const recipeId = recipeData.recipe_id; // Assuming the ID field is 'id'

      console.log('recipeID', recipeId)

      // Insert ingredients using the retrieved recipe ID
      for (const ingredient of data.ingredients) {
        const { error: ingredientError } = await supabase
          .from('ingredients')
          .insert({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit, // Include the unit in the insertion data
            recipe_id: recipeId, // Use the retrieved recipe ID
            profile_id: session.user.id,
          });

        if (ingredientError) throw ingredientError;
      }

      alert('Recipe and ingredients added successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Submission error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
    <Layout>
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
          {...register(`ingredients[${index}].quantity`, {
            required: "Quantity is required",
            valueAsNumber: true,
            validate: {
              isFloat: value => !isNaN(value) && Number(value) == value && (!/\.\d{3,}/.test(value) || "Please limit to 2 decimal places"),
            }
          })}
          type="number"
          step="0.01" // Allow decimal values up to 2 decimal places
          placeholder="Quantity"
        />
          <select {...register(`ingredients[${index}].unit`, { required: true })}>
            <option value="">Select Unit</option>
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
            <option value="pinch">pinch</option>
            <option value="g">g</option>
            <option value="mL">mL</option>  
            <option value="L">L</option>
            <option value="oz">oz</option>
            <option value="lb">lb</option>
            <option value="cups">cups</option>
            <option value="pints">pints</option>
            <option value="quarts">quarts</option>
            <option value="gallons">gallons</option>

            {/* Add more units as needed */}
          </select>
          <button type="button" onClick={() => removeIngredientField(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addIngredientField}>Add Ingredient</button>
      <button type="submit" disabled={submitting}>Submit Recipe</button>
      <div>

        <Link to="/">Back to Home</Link>
        </div>
    </form>
    </Layout>
    </>
  );
};

export default RecipeEntryPage;