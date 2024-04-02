import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';
import uploadImage from '../utils/uploadImage';

const RecipeEntryPage = ({ session }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);

  useEffect(() => {
    register('image');
  }, [register]);

  const addIngredientField = () => {
    setIngredients(currentIngredients => [...currentIngredients, { name: '', quantity: '' }]);
  };

  const removeIngredientField = index => {
    setIngredients(currentIngredients => currentIngredients.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      let uploadedImageUrl;
      if (data.image && data.image.length) {
        const filePath = await uploadImage(data.image[0], 'recipe-images');
        uploadedImageUrl = filePath;
      } else {
        uploadedImageUrl = null; // Handle cases where no image is uploaded
        }

      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: data.title,
            description: data.description,
            instructions: data.instructions,
            image_url: uploadedImageUrl,
            profile_id: session.user.id,
          }, 
        ])
        .single();

      console.log('Recipe Data:', recipeData);
      console.error('Recipe Error:', recipeError);        
          
      if (recipeError) {
        console.error('Insert recipe error:', recipeError.message);
        alert(`Submission error: ${recipeError.message}`);
        setSubmitting(false);
        return;
       } // Exit the function early on error

      if (!recipeData) {
        console.error('No recipe data returned from insert operation.');
        alert('No recipe data returned from insert operation.');
        setSubmitting(false);
        return; // Exit the function early if no data is returned
    }

      console.log('Inserted recipe data:', recipeData);

      const recipeId = recipeData.id;
      // Assuming recipeId is correctly obtained
      const ingredientsWithRecipeId = ingredients.map((ingredient) => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        recipe_id: recipeId, // Ensure this is correctly derived from the recipeData
        profile_id: session.user.id, // Optional, based on your requirements
      }));


      const { error: ingredientsError } = await supabase.from('ingredients').insert(ingredientsWithRecipeId);

      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError.message);
        alert(`Error inserting ingredients: ${ingredientsError.message}`);
        // Handle the error appropriately
}

      alert('Recipe added successfully!');
      // Consider resetting form fields here
    } catch (error) {
      alert(`Submission error: ${error.message}`);
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
      <div>
        <label>Ingredients</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              {...register(`ingredients[${index}].name`, { required: true })}
              placeholder="Ingredient Name"
              defaultValue={ingredient.name}
              style={{ marginRight: '5px' }}
            />
            <input
              {...register(`ingredients[${index}].quantity`, { required: true })}
              placeholder="Quantity"
              defaultValue={ingredient.quantity}
              style={{ marginRight: '5px' }}
            />
            <button 
              type="button"
              onClick={() => removeIngredientField(index)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addIngredientField} style={{ marginTop: '10px' }}>
          Add Ingredient
        </button>
      </div>
      <div>
        <label>Image</label>
        <input 
          type="file" 
          {...register("image")}
          onChange={(e) => setValue('image', e.target.files, { shouldValidate: true })}
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting}>Submit Recipe</button>
    </form>
  );

};

export default RecipeEntryPage;
