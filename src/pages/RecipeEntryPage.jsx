import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';
import uploadImage from '../utils/uploadImage'; // Ensure this function is correctly set up for file uploads

const RecipeEntryPage = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [submitting, setSubmitting] = useState(false);

  // Register the file input for react-hook-form
  React.useEffect(() => {
    register('image'); // Manually register the file input
  }, [register]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const { title, description, instructions, ingredients, image } = data; // Changed to 'image'

    try {
      // Assuming 'image' is a File object
      const uploadedImageUrl = await uploadImage(image[0]); // Pass the first file object

      // Create the recipe with the uploaded image URL
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title,
            description,
            instructions,
            image_url: uploadedImageUrl, // Use the uploaded image URL
            profile_id: supabase.auth.user().id,
          },
        ]);

      if (recipeError) {
        console.error('Error inserting recipe:', recipeError);
        setSubmitting(false);
        return;
      }

      // Assuming ingredients is an array of { name, quantity }
      const ingredientsWithRecipeId = ingredients.map(ingredient => ({
        ...ingredient,
        recipe_id: recipeData[0].id, // Assuming the key is 'id'
      }));

      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .insert(ingredientsWithRecipeId);

      if (ingredientsError) {
        console.error('Error inserting ingredients:', ingredientsError);
      }

      setSubmitting(false);
      // Redirect or show success message
    } catch (error) {
      console.error('Submission error:', error);
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
        <input {...register('ingredients', { required: true })} placeholder="Name, Quantity" />
        {errors.ingredients && <span>This field is required</span>}
      </div>
      <div>
        <label>Image</label>
        <input 
          type="file" 
          onChange={(e) => setValue('image', e.target.files)} // Update for file input
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting}>Submit</button>
    </form>
  );
};

export default RecipeEntryPage;