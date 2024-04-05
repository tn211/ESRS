import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabaseClient';
import { Link } from "react-router-dom";
import Image from '../components/Image';

const RecipeEntryPage = ({ session }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [recipeURL, setRecipeURL] = useState(null);
  const [loading, setLoading] = useState(true)
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredientField = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleImageUpload = (filePath) => { 
    setRecipeURL(filePath);
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
          image_url: data.image_url,
          profile_id: session.user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

        if (!ignore) {
            if (recipeError) {
              console.warn(recipeError)
            } else if (data) {
              setRecipeURL(data.image_url)
            }
          }    

      const recipeId = recipeData.recipe_id; 
      const imageURL = recipeData.image_url;

      console.log('recipeID', recipeId)
      console.log('imageURL', imageURL)

      async function updateImage(event, imageUrl) {
        event.preventDefault()
    
        setLoading(true)
        const { recipeData } = recipeData
    
        const updates = {
          id: recipeData.recipe.id,
          image_url: imageUrl,
        }
    
        const { error } = await supabase.from('recipes').upsert(updates)
    
        if (error) {
          alert(error.message)
        } else {
          setRecipeURL(imageUrl)
        }
        setLoading(false)
      }

      for (const ingredient of data.ingredients) {
        const { error: ingredientError } = await supabase
          .from('ingredients')
          .insert({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit, 
            recipe_id: recipeId,
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
    <form onSubmit={handleSubmit(onSubmit)}>
        <Image
              url={recipeURL}
              size={150}
              onUpload={(event, url) => {
                  updateImage(event, url)
              }}
          />
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
  );
};

export default RecipeEntryPage;